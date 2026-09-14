package com.bookmind.controller;

import com.bookmind.dto.ApiResponse;
import com.bookmind.dto.CreateOrderRequest;
import com.bookmind.dto.OrderDto;
import com.bookmind.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(@RequestBody CreateOrderRequest request) {
        log.info("Received request to create order: {}", request);
        try {
            OrderDto orderDto = orderService.createOrder(request);
            return ResponseEntity.ok(ApiResponse.success("Đặt hàng thành công!", orderDto));
        } catch (Exception e) {
            log.error("Error creating order", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể tạo đơn hàng: " + e.getMessage()));
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(@RequestParam(value = "userId", required = false) Long userId) {
        log.info("Fetching orders for userId: {}", userId);
        try {
            List<OrderDto> orders = orderService.getOrdersByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đơn hàng thành công!", orders));
        } catch (Exception e) {
            log.error("Error fetching orders", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể tải danh sách đơn hàng: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        log.info("Updating order #{} status to: {}", id, status);
        try {
            OrderDto updated = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái đơn hàng thành công!", updated));
        } catch (Exception e) {
            log.error("Error updating order status", e);
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByTrackingNumber(@PathVariable("trackingNumber") String trackingNumber) {
        try {
            OrderDto dto = orderService.getOrderByTrackingNumber(trackingNumber);
            return ResponseEntity.ok(ApiResponse.success("Tìm thấy đơn hàng", dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy đơn hàng: " + e.getMessage()));
        }
    }
}
