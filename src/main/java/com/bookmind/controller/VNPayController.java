package com.bookmind.controller;

import com.bookmind.dto.ApiResponse;
import com.bookmind.dto.CreateOrderRequest;
import com.bookmind.dto.OrderDto;
import com.bookmind.entity.Order;
import com.bookmind.entity.enums.PaymentMethod;
import com.bookmind.repository.OrderRepository;
import com.bookmind.service.OrderService;
import com.bookmind.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment/vnpay")
@CrossOrigin(origins = "*")
public class VNPayController {

    private static final Logger log = LoggerFactory.getLogger(VNPayController.class);

    private final VNPayService vnPayService;
    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public VNPayController(VNPayService vnPayService,
                           OrderService orderService,
                           OrderRepository orderRepository) {
        this.vnPayService = vnPayService;
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    /**
     * Khởi tạo đơn hàng & tạo URL chuyển hướng sang cổng thanh toán VNPay Sandbox
     */
    @PostMapping("/create-payment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPayment(
            HttpServletRequest httpServletRequest,
            @RequestBody CreateOrderRequest request,
            @RequestParam(value = "bankCode", required = false) String bankCode) {

        log.info("Received VNPay create payment request for receiver: {}, amount: {}",
                request.getReceiverName(), request.getTotalAmount());
        try {
            request.setPaymentMethod("VNPAY");

            Order order;
            if (request.getTrackingNumber() != null && !request.getTrackingNumber().isBlank()) {
                Optional<Order> existing = orderRepository.findByTrackingNumber(request.getTrackingNumber().trim());
                if (existing.isPresent()) {
                    order = existing.get();
                } else {
                    OrderDto dto = orderService.createOrder(request);
                    order = orderRepository.findById(dto.getId()).orElseThrow();
                }
            } else {
                OrderDto dto = orderService.createOrder(request);
                order = orderRepository.findById(dto.getId()).orElseThrow();
            }

            String paymentUrl = vnPayService.createPaymentUrl(httpServletRequest, order, bankCode);

            Map<String, Object> data = new HashMap<>();
            data.put("paymentUrl", paymentUrl);
            data.put("trackingNumber", order.getTrackingNumber());
            data.put("orderId", order.getId());
            data.put("amount", order.getTotalAmount());

            return ResponseEntity.ok(ApiResponse.success("Khởi tạo thanh toán VNPay thành công!", data));
        } catch (Exception e) {
            log.error("Error creating VNPay payment URL", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi tạo thanh toán VNPay: " + e.getMessage()));
        }
    }

    /**
     * Xử lý Return URL khi người dùng thanh toán xong và được VNPay chuyển hướng về website
     */
    @GetMapping({"/return", "/vnpay-return"})
    public void handleVNPayReturn(
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

        Map<String, String> fields = extractAllRequestParams(request);
        log.info("Received VNPay return redirect with params: {}", fields);

        String vnpResponseCode = fields.get("vnp_ResponseCode");
        String vnpTxnRef = fields.get("vnp_TxnRef");
        String vnpTransactionNo = fields.get("vnp_TransactionNo");
        String vnpBankCode = fields.get("vnp_BankCode");

        boolean isValid = vnPayService.validateSignature(fields);
        if (isValid && "00".equals(vnpResponseCode) && vnpTxnRef != null) {
            try {
                vnPayService.processPaymentSuccess(vnpTxnRef, vnpTransactionNo, vnpBankCode, fields.toString());
            } catch (Exception e) {
                log.error("Failed to update order on return redirect", e);
            }
        }

        // Chuyển hướng người dùng về trang giao diện kết quả đẹp mắt
        StringBuilder redirectUrl = new StringBuilder("/payment-result.html?");
        fields.forEach((k, v) -> redirectUrl.append(k).append("=").append(v).append("&"));
        response.sendRedirect(redirectUrl.toString());
    }

    /**
     * IPN Webhook Server-to-Server từ VNPay
     */
    @GetMapping({"/ipn", "/vnpay-ipn"})
    public ResponseEntity<Map<String, String>> handleVNPayIpn(HttpServletRequest request) {
        Map<String, String> fields = extractAllRequestParams(request);
        log.info("Received VNPay IPN notification: {}", fields);

        Map<String, String> result = new HashMap<>();

        if (!vnPayService.validateSignature(fields)) {
            result.put("RspCode", "97");
            result.put("Message", "Invalid Checksum");
            return ResponseEntity.ok(result);
        }

        String vnpTxnRef = fields.get("vnp_TxnRef");
        String vnpResponseCode = fields.get("vnp_ResponseCode");
        String vnpTransactionNo = fields.get("vnp_TransactionNo");
        String vnpBankCode = fields.get("vnp_BankCode");

        Optional<Order> orderOpt = orderRepository.findByTrackingNumber(vnpTxnRef);
        if (orderOpt.isEmpty()) {
            result.put("RspCode", "01");
            result.put("Message", "Order not Found");
            return ResponseEntity.ok(result);
        }

        Order order = orderOpt.get();
        if ("00".equals(vnpResponseCode)) {
            vnPayService.processPaymentSuccess(vnpTxnRef, vnpTransactionNo, vnpBankCode, fields.toString());
        }

        result.put("RspCode", "00");
        result.put("Message", "Confirm Success");
        return ResponseEntity.ok(result);
    }

    /**
     * API xác thực thông tin đơn hàng sau thanh toán (cho Frontend payment-result.html)
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPaymentResult(
            @RequestParam Map<String, String> allParams) {

        boolean isValid = vnPayService.validateSignature(allParams);
        String responseCode = allParams.get("vnp_ResponseCode");
        String txnRef = allParams.get("vnp_TxnRef");
        String transactionNo = allParams.get("vnp_TransactionNo");
        String bankCode = allParams.get("vnp_BankCode");

        Map<String, Object> data = new HashMap<>(allParams);
        data.put("isValidSignature", isValid);

        boolean isSuccess = isValid && "00".equals(responseCode);
        data.put("isSuccess", isSuccess);

        if (isSuccess && txnRef != null) {
            try {
                Order order = vnPayService.processPaymentSuccess(txnRef, transactionNo, bankCode, allParams.toString());
                data.put("orderId", order.getId());
                data.put("invoiceNumber", order.getInvoiceNumber());
                data.put("orderStatus", order.getStatus().name());
                data.put("receiverName", order.getReceiverName());
                data.put("totalAmount", order.getTotalAmount());
            } catch (Exception e) {
                log.warn("Error processing verified payment: {}", e.getMessage());
            }
        }

        String msg = isSuccess ? "Thanh toán VNPay thành công!" : "Giao dịch không thành công hoặc bị hủy!";
        return ResponseEntity.ok(ApiResponse.success(msg, data));
    }

    private Map<String, String> extractAllRequestParams(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
            String name = entry.getKey();
            String[] values = entry.getValue();
            if (values != null && values.length > 0) {
                fields.put(name, values[0]);
            }
        }
        return fields;
    }
}
