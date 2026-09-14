package com.bookmind.service;

import com.bookmind.config.VNPayConfig;
import com.bookmind.entity.Order;
import com.bookmind.entity.Payment;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.entity.enums.PaymentMethod;
import com.bookmind.entity.enums.PaymentStatus;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class VNPayService {

    private static final Logger log = LoggerFactory.getLogger(VNPayService.class);

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceService invoiceService;

    public VNPayService(VNPayConfig vnPayConfig,
                        OrderRepository orderRepository,
                        PaymentRepository paymentRepository,
                        InvoiceService invoiceService) {
        this.vnPayConfig = vnPayConfig;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.invoiceService = invoiceService;
    }

    /**
     * Tạo URL chuyển hướng sang cổng thanh toán VNPay Sandbox
     */
    public String createPaymentUrl(HttpServletRequest request, Order order, String bankCode) {
        long amount = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isBlank()) {
            vnpParams.put("vnp_BankCode", bankCode.trim());
        }

        vnpParams.put("vnp_TxnRef", order.getTrackingNumber());
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + order.getTrackingNumber());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", VNPayConfig.getIpAddress(request));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        // Sắp xếp các tham số theo thứ tự alphabet
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

        String paymentUrl = vnPayConfig.getPaymentUrl() + "?" + queryUrl;
        log.info("Generated VNPay payment URL for Order #{}: {}", order.getTrackingNumber(), paymentUrl);
        return paymentUrl;
    }

    /**
     * Xác thực chữ ký số (Checksum) trả về từ VNPay
     */
    public boolean validateSignature(Map<String, String> fields) {
        String vnpSecureHash = fields.get("vnp_SecureHash");
        if (vnpSecureHash == null || vnpSecureHash.isEmpty()) {
            return false;
        }

        // Tạo bản copy để loại trừ vnp_SecureHash & vnp_SecureHashType
        Map<String, String> cleanFields = new HashMap<>(fields);
        cleanFields.remove("vnp_SecureHash");
        cleanFields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(cleanFields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = cleanFields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String calculatedHash = VNPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        boolean isValid = calculatedHash.equalsIgnoreCase(vnpSecureHash);
        if (!isValid) {
            log.warn("VNPay signature mismatch! Expected: {}, Received: {}", calculatedHash, vnpSecureHash);
        }
        return isValid;
    }

    /**
     * Xử lý xác nhận đơn hàng khi thanh toán VNPay thành công
     */
    @Transactional
    public Order processPaymentSuccess(String trackingNumber, String vnpTransactionNo, String bankCode, String rawPayload) {
        log.info("Processing VNPay payment success for TrackingNumber: {}, TxnNo: {}", trackingNumber, vnpTransactionNo);
        Optional<Order> orderOpt = orderRepository.findByTrackingNumber(trackingNumber.trim());
        if (orderOpt.isEmpty()) {
            String upper = trackingNumber.trim().toUpperCase();
            if (!upper.startsWith("BM-") && upper.startsWith("BM")) {
                orderOpt = orderRepository.findByTrackingNumber("BM-" + upper.substring(2));
            } else {
                orderOpt = orderRepository.findByTrackingNumber(upper);
            }
        }

        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy đơn hàng: " + trackingNumber);
        }

        Order order = orderOpt.get();
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        // Tìm hoặc tạo mới Payment
        List<Payment> payments = paymentRepository.findByOrderId(order.getId());
        Payment payment = payments.isEmpty() ? new Payment() : payments.get(0);
        payment.setOrder(order);
        payment.setPaymentMethod(PaymentMethod.VNPAY);
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setTransactionId(vnpTransactionNo);
        payment.setTransactionRef(trackingNumber);
        payment.setTransferContent("VNPay " + (bankCode != null ? bankCode : "") + " " + vnpTransactionNo);
        payment.setRawWebhookPayload(rawPayload);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        // Đảm bảo hóa đơn VAT điện tử được phát hành
        invoiceService.ensureInvoiceGenerated(order);
        Order saved = orderRepository.save(order);
        log.info("Order #{} marked as CONFIRMED via VNPay.", saved.getTrackingNumber());
        return saved;
    }
}
