package com.bookmind.controller;

import com.bookmind.dto.ApiResponse;
import com.bookmind.dto.PaymentWebhookRequest;
import com.bookmind.entity.Order;
import com.bookmind.entity.Payment;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.entity.enums.PaymentStatus;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.PaymentRepository;
import com.bookmind.service.PaymentWebhookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PaymentWebhookController {

    private static final Logger log = LoggerFactory.getLogger(PaymentWebhookController.class);

    private final PaymentWebhookService webhookService;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PaymentWebhookController(PaymentWebhookService webhookService,
                                    OrderRepository orderRepository,
                                    PaymentRepository paymentRepository) {
        this.webhookService = webhookService;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Endpoint chính nhận Webhook từ SePay, Casso hoặc PayOS khi có biến động số dư.
     */
    @PostMapping("/webhook/payment")
    public ResponseEntity<Map<String, Object>> handlePaymentWebhook(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody PaymentWebhookRequest request) {

        log.info("Received Payment Webhook request: {}", request);

        // Xác thực API Key nếu bên trung gian có cấu hình
        if (authHeader != null && !webhookService.validateApiKey(authHeader)) {
            log.warn("Unauthorized webhook access with Authorization header: {}", authHeader);
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Mã xác thực API Key không hợp lệ!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        try {
            String rawJson = objectMapper.writeValueAsString(request);
            Order order = webhookService.processPaymentWebhook(request, rawJson);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xác thực thanh toán đơn hàng thành công!");
            response.put("orderId", order.getId());
            response.put("trackingNumber", order.getTrackingNumber());
            response.put("invoiceNumber", order.getInvoiceNumber());
            response.put("status", order.getStatus().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error handling payment webhook", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi xử lý webhook: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Endpoint giả lập thanh toán (Simulation Endpoint) dùng cho Developer/Admin test nhanh.
     */
    @PostMapping("/webhook/payment/simulate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> simulatePayment(
            @RequestBody Map<String, Object> body) {
        // Accept both 'trackingNumber' and 'orderCode' from frontend
        String trackingNumber = body.containsKey("trackingNumber") ? String.valueOf(body.get("trackingNumber")) : null;
        if (trackingNumber == null || trackingNumber.isBlank()) {
            trackingNumber = body.containsKey("orderCode") ? String.valueOf(body.get("orderCode")) : null;
        }
        log.info("Simulating payment for trackingNumber/orderCode: {}", trackingNumber);

        if (trackingNumber == null || trackingNumber.isBlank() || "null".equals(trackingNumber)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng cung cấp trackingNumber hoặc orderCode (VD: BM-XXXXXX)!"));
        }

        // Normalize: ensure format BM-XXXXX (uppercase)
        String normalizedTracking = trackingNumber.trim().toUpperCase();
        if (!normalizedTracking.startsWith("BM-") && normalizedTracking.startsWith("BM")) {
            normalizedTracking = "BM-" + normalizedTracking.substring(2);
        }

        Optional<Order> orderOpt = orderRepository.findByTrackingNumber(normalizedTracking);
        if (orderOpt.isEmpty()) {
            // Try original form as fallback
            orderOpt = orderRepository.findByTrackingNumber(trackingNumber.trim());
        }
        if (orderOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy đơn hàng với mã: " + trackingNumber + " (normalized: " + normalizedTracking + ")"));
        }

        Order order = orderOpt.get();
        Object amountObj = body.get("amount");
        java.math.BigDecimal amount = order.getTotalAmount();
        if (amountObj != null) {
            try { amount = new java.math.BigDecimal(amountObj.toString()); } catch (Exception ignored) {}
        }

        PaymentWebhookRequest simReq = new PaymentWebhookRequest();
        simReq.setReferenceCode("SIM-" + System.currentTimeMillis());
        simReq.setGateway(body.containsKey("gateway") ? String.valueOf(body.get("gateway")) : "BIDV-SIMULATOR");
        simReq.setAccountNumber("0974932089");
        simReq.setAmountIn(amount);
        simReq.setTransactionContent("Thanh toan don hang " + order.getTrackingNumber());

        try {
            String rawJson = objectMapper.writeValueAsString(simReq);
            Order processed = webhookService.processPaymentWebhook(simReq, rawJson);

            Map<String, Object> data = new HashMap<>();
            data.put("paid", true);
            data.put("orderId", processed.getId());
            data.put("trackingNumber", processed.getTrackingNumber());
            data.put("amount", amount);
            data.put("invoiceNumber", processed.getInvoiceNumber());
            data.put("status", processed.getStatus().name());

            return ResponseEntity.ok(ApiResponse.success("Giả lập nhận tiền thành công! Đơn hàng đã được thanh toán.", data));
        } catch (Exception e) {
            log.error("Simulation failed", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Giả lập thất bại: " + e.getMessage()));
        }
    }

    /**
     * Endpoint polling để Frontend kiểm tra trạng thái thanh toán realtime (mỗi 2 giây).
     */
    @GetMapping("/orders/check-payment/{trackingNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPaymentStatus(
            @PathVariable("trackingNumber") String trackingNumber) {

        Optional<Order> orderOpt = orderRepository.findByTrackingNumber(trackingNumber.trim());
        if (orderOpt.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.error("Không tìm thấy đơn hàng!"));
        }

        Order order = orderOpt.get();
        List<Payment> payments = paymentRepository.findByOrderId(order.getId());
        Payment primaryPayment = payments.isEmpty() ? null : payments.get(0);

        boolean isPaid = order.getStatus() != OrderStatus.PENDING &&
                primaryPayment != null &&
                primaryPayment.getPaymentStatus() == PaymentStatus.COMPLETED;

        Map<String, Object> res = new HashMap<>();
        res.put("paid", isPaid);       // JS uses data.paid
        res.put("isPaid", isPaid);     // keep backward compat
        res.put("orderId", order.getId());
        res.put("trackingNumber", order.getTrackingNumber());
        res.put("amount", order.getTotalAmount());
        res.put("status", order.getStatus().name());
        res.put("paymentStatus", primaryPayment != null ? primaryPayment.getPaymentStatus().name() : "PENDING");
        res.put("invoiceNumber", order.getInvoiceNumber());
        res.put("totalAmount", order.getTotalAmount());

        return ResponseEntity.ok(ApiResponse.success(isPaid ? "Đã thanh toán" : "Đang chờ thanh toán", res));
    }
}
