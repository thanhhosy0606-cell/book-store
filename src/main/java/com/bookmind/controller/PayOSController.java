package com.bookmind.controller;

import com.bookmind.config.PayOSConfig;
import com.bookmind.dto.ApiResponse;
import com.bookmind.dto.CreateOrderRequest;
import com.bookmind.dto.OrderDto;
import com.bookmind.entity.Order;
import com.bookmind.repository.OrderRepository;
import com.bookmind.service.OrderService;
import com.bookmind.service.PayOSService;
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
                configured ? "PayOS đã được cấu hình" : "PayOS chưa cấu hình API Key",
                data
        ));
    }

    /**
     * Tạo liên kết thanh toán PayOS VietQR trực tiếp vào tài khoản ngân hàng
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

            Map<String, Object> paymentResult = payOSService.createPaymentLink(order, null, null);
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
}
