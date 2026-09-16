package com.bookmind.controller;

import com.bookmind.config.PayOSConfig;
import com.bookmind.dto.ApiResponse;
import com.bookmind.dto.CreateOrderRequest;
import com.bookmind.dto.OrderDto;
import com.bookmind.entity.Order;
import com.bookmind.repository.OrderRepository;
import com.bookmind.service.OrderService;
import com.bookmind.service.PayOSService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment/payos")
@CrossOrigin(origins = "*")
public class PayOSController {

    private static final Logger log = LoggerFactory.getLogger(PayOSController.class);

    private final PayOSService payOSService;
    private final PayOSConfig payOSConfig;
    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public PayOSController(PayOSService payOSService,
                           PayOSConfig payOSConfig,
                           OrderService orderService,
                           OrderRepository orderRepository) {
        this.payOSService = payOSService;
        this.payOSConfig = payOSConfig;
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    /**
     * Kiểm tra trạng thái cấu hình PayOS
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPayOSStatus() {
        boolean configured = payOSConfig.isConfigured();
        Map<String, Object> data = new HashMap<>();
        data.put("configured", configured);
        data.put("returnUrl", payOSConfig.getReturnUrl());
        return ResponseEntity.ok(ApiResponse.success(
                configured ? "PayOS đã được cấu hình hoạt động" : "PayOS chưa cấu hình API Key",
                data
        ));
    }

    /**
     * Tạo liên kết thanh toán PayOS VietQR
     */
    @PostMapping("/create-payment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPayment(@RequestBody CreateOrderRequest request) {
        log.info("Received PayOS create payment request for receiver: {}, amount: {}",
                request.getReceiverName(), request.getTotalAmount());
        try {
            request.setPaymentMethod("VIETQR");

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

            Map<String, Object> paymentResult = payOSService.createPaymentLink(order, request.getReturnUrl(), request.getCancelUrl());
            paymentResult.put("orderId", order.getId());
            paymentResult.put("trackingNumber", order.getTrackingNumber());

            if (Boolean.TRUE.equals(paymentResult.get("success"))) {
                return ResponseEntity.ok(ApiResponse.success("Tạo liên kết thanh toán PayOS thành công!", paymentResult));
            } else {
                return ResponseEntity.ok(ApiResponse.error(
                        paymentResult.get("message") != null ? paymentResult.get("message").toString() : "Không thể tạo liên kết PayOS",
                        paymentResult
                ));
            }
        } catch (Exception e) {
            log.error("Error creating PayOS payment", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi tạo thanh toán PayOS: " + e.getMessage()));
        }
    }

    /**
     * Xác nhận đơn hàng khi khách hàng thanh toán thành công và được PayOS chuyển hướng về payment-result.html
     */
    @RequestMapping(value = "/confirm-return", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<ApiResponse<OrderDto>> confirmPayOSReturn(
            @RequestParam(value = "orderCode", required = false) Long orderCode,
            @RequestParam(value = "id", required = false) String paymentLinkId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "code", required = false) String code) {

        log.info("Received PayOS return confirmation: orderCode={}, status={}, code={}", orderCode, status, code);

        if (orderCode == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Thiếu mã đơn hàng PayOS (orderCode)"));
        }

        boolean isPaid = "PAID".equalsIgnoreCase(status) || "00".equals(code);
        if (!isPaid) {
            return ResponseEntity.ok(ApiResponse.error("Giao dịch PayOS chưa hoàn tất hoặc đã bị hủy", null));
        }

        try {
            boolean processed = payOSService.processSuccessfulPayment(orderCode, paymentLinkId, "PAYOS-RETURN-" + orderCode);
            if (processed) {
                OrderDto dto = orderService.getOrderByTrackingNumber("BM-" + orderCode);
                return ResponseEntity.ok(ApiResponse.success("Xác nhận thanh toán PayOS thành công!", dto));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy đơn hàng với mã BM-" + orderCode));
            }
        } catch (Exception e) {
            log.error("Error confirming PayOS return", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi xác nhận: " + e.getMessage()));
        }
    }

    /**
     * Webhook nhận thông báo thanh toán tự động từ PayOS Cloud
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handlePayOSWebhook(@RequestBody JsonNode root) {
        log.info("Received PayOS Webhook: {}", root.toString());
        Map<String, Object> response = new HashMap<>();

        try {
            if (!root.has("data") || !root.has("signature")) {
                response.put("error", -1);
                response.put("message", "Thiếu dữ liệu payload hoặc chữ ký");
                return ResponseEntity.badRequest().body(response);
            }

            JsonNode dataNode = root.get("data");
            String signature = root.get("signature").asText();

            boolean valid = payOSService.verifyWebhookSignature(dataNode, signature);
            if (!valid) {
                log.warn("Invalid PayOS webhook signature");
                response.put("error", -1);
                response.put("message", "Chữ ký không hợp lệ");
                return ResponseEntity.badRequest().body(response);
            }

            Long orderCode = dataNode.has("orderCode") ? dataNode.get("orderCode").asLong() : null;
            String paymentLinkId = dataNode.has("paymentLinkId") ? dataNode.get("paymentLinkId").asText() : "";
            String reference = dataNode.has("reference") ? dataNode.get("reference").asText() : "";

            if (orderCode != null) {
                payOSService.processSuccessfulPayment(orderCode, paymentLinkId, reference);
            }

            response.put("error", 0);
            response.put("message", "Xác nhận webhook thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing PayOS webhook", e);
            response.put("error", -1);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
