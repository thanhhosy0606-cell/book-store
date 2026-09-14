package com.bookmind.service;

import com.bookmind.config.PayOSConfig;
import com.bookmind.entity.Order;
import com.bookmind.entity.Payment;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.entity.enums.PaymentMethod;
import com.bookmind.entity.enums.PaymentStatus;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.PaymentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PayOSService {

    private static final Logger log = LoggerFactory.getLogger(PayOSService.class);
    private static final String PAYOS_API_ENDPOINT = "https://api-merchant.payos.vn/v2/payment-requests";

    private final PayOSConfig payOSConfig;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public PayOSService(PayOSConfig payOSConfig,
                        OrderRepository orderRepository,
                        PaymentRepository paymentRepository) {
        this.payOSConfig = payOSConfig;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Tạo liên kết thanh toán PayOS VietQR
     */
    public Map<String, Object> createPaymentLink(Order order, String customReturnUrl, String customCancelUrl) {
        Map<String, Object> result = new HashMap<>();

        if (!payOSConfig.isConfigured()) {
            result.put("success", false);
            result.put("configured", false);
            result.put("message", "PayOS chưa được cấu hình API Key. Vui lòng thêm PAYOS_CLIENT_ID, PAYOS_API_KEY và PAYOS_CHECKSUM_KEY!");
            return result;
        }

        try {
            // PayOS orderCode phải là số nguyên dương <= 9007199254740991
            long orderCode = Long.parseLong(String.valueOf(System.currentTimeMillis()).substring(3));

            int amount = order.getTotalAmount() != null ? order.getTotalAmount().intValue() : 0;
            if (amount <= 0) {
                result.put("success", false);
                result.put("message", "Số tiền đơn hàng không hợp lệ!");
                return result;
            }

            // Đồng bộ tracking number
            if (order.getTrackingNumber() == null || order.getTrackingNumber().isBlank()) {
                order.setTrackingNumber("BM-" + orderCode);
                orderRepository.save(order);
            }

            // Description trong PayOS tối đa 25 ký tự không dấu
            String desc = "DH BM " + (order.getId() != null ? order.getId() : orderCode);
            if (desc.length() > 25) {
                desc = desc.substring(0, 25);
            }

            String returnUrl = (customReturnUrl != null && !customReturnUrl.isBlank()) ? customReturnUrl : payOSConfig.getReturnUrl();
            String cancelUrl = (customCancelUrl != null && !customCancelUrl.isBlank()) ? customCancelUrl : payOSConfig.getCancelUrl();

            // Chuỗi tạo chữ ký HMAC-SHA256 theo quy chuẩn PayOS
            String rawSignatureData = "amount=" + amount +
                    "&cancelUrl=" + cancelUrl +
                    "&description=" + desc +
                    "&orderCode=" + orderCode +
                    "&returnUrl=" + returnUrl;

            String signature = PayOSConfig.hmacSHA256(payOSConfig.getChecksumKey(), rawSignatureData);

            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("orderCode", orderCode);
            requestPayload.put("amount", amount);
            requestPayload.put("description", desc);
            requestPayload.put("cancelUrl", cancelUrl);
            requestPayload.put("returnUrl", returnUrl);
            requestPayload.put("signature", signature);

            String requestBodyJson = objectMapper.writeValueAsString(requestPayload);
            log.info("Sending PayOS Payment Request: {}", requestBodyJson);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(PAYOS_API_ENDPOINT))
                    .header("Content-Type", "application/json")
                    .header("x-client-id", payOSConfig.getClientId())
                    .header("x-api-key", payOSConfig.getApiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("PayOS API Response Status: {}, Body: {}", response.statusCode(), response.body());

            JsonNode root = objectMapper.readTree(response.body());
            String code = root.has("code") ? root.get("code").asText() : "";

            if ("00".equals(code) && root.has("data")) {
                JsonNode dataNode = root.get("data");
                result.put("success", true);
                result.put("configured", true);
                result.put("orderCode", orderCode);
                result.put("trackingNumber", order.getTrackingNumber());
                result.put("checkoutUrl", dataNode.has("checkoutUrl") ? dataNode.get("checkoutUrl").asText() : "");
                result.put("qrCode", dataNode.has("qrCode") ? dataNode.get("qrCode").asText() : "");
                result.put("paymentLinkId", dataNode.has("paymentLinkId") ? dataNode.get("paymentLinkId").asText() : "");
                result.put("accountNumber", dataNode.has("accountNumber") ? dataNode.get("accountNumber").asText() : "");
                result.put("accountName", dataNode.has("accountName") ? dataNode.get("accountName").asText() : "");
                result.put("amount", amount);
            } else {
                result.put("success", false);
                result.put("configured", true);
                result.put("message", root.has("desc") ? root.get("desc").asText() : "Lỗi không xác định từ PayOS");
            }
        } catch (Exception e) {
            log.error("Error creating PayOS payment link", e);
            result.put("success", false);
            result.put("message", "Lỗi tạo liên kết PayOS: " + e.getMessage());
        }

        return result;
    }

    /**
     * Xác thực chữ ký Webhook từ PayOS
     */
    public boolean verifyWebhookSignature(JsonNode dataNode, String signature) {
        if (!payOSConfig.isConfigured() || signature == null || signature.isBlank() || dataNode == null) {
            return false;
        }

        try {
            Map<String, String> sortedFields = new TreeMap<>();
            Iterator<Map.Entry<String, JsonNode>> fields = dataNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                String key = field.getKey();
                JsonNode val = field.getValue();
                if (val.isValueNode()) {
                    sortedFields.put(key, val.asText());
                }
            }

            StringBuilder sb = new StringBuilder();
            for (Map.Entry<String, String> entry : sortedFields.entrySet()) {
                if (sb.length() > 0) sb.append("&");
                sb.append(entry.getKey()).append("=").append(entry.getValue());
            }

            String calculated = PayOSConfig.hmacSHA256(payOSConfig.getChecksumKey(), sb.toString());
            return calculated.equalsIgnoreCase(signature);
        } catch (Exception e) {
            log.error("Error verifying PayOS signature", e);
            return false;
        }
    }

    /**
     * Xử lý xác nhận đơn hàng khi PayOS báo chuyển khoản thành công
     */
    @Transactional
    public boolean processSuccessfulPayment(Long orderCode, String paymentLinkId, String reference) {
        try {
            Optional<Order> orderOpt = orderRepository.findByTrackingNumber("BM-" + orderCode);
            if (orderOpt.isEmpty()) {
                log.warn("Order not found with tracking number BM-{}", orderCode);
                return false;
            }

            Order order = orderOpt.get();
            order.setStatus(OrderStatus.CONFIRMED);
            order.setInvoiceIssuedAt(LocalDateTime.now());
            orderRepository.save(order);

            // Cập nhật hoặc tạo payment record
            List<Payment> payments = paymentRepository.findByOrderId(order.getId());
            Payment payment = (payments != null && !payments.isEmpty()) ? payments.get(0) : new Payment();
            payment.setOrder(order);
            payment.setPaymentMethod(PaymentMethod.VIETQR);
            payment.setPaymentStatus(PaymentStatus.COMPLETED);
            payment.setTransactionRef(reference != null ? reference : String.valueOf(orderCode));
            payment.setPaymentDate(LocalDateTime.now());
            paymentRepository.save(payment);

            log.info("PayOS Payment successfully confirmed for order {}", order.getTrackingNumber());
            return true;
        } catch (Exception e) {
            log.error("Error processing PayOS success payment", e);
            return false;
        }
    }
}
