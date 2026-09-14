package com.bookmind.controller;

import com.bookmind.dto.AdminOrderDto;
import com.bookmind.entity.Book;
import com.bookmind.entity.Order;
import com.bookmind.entity.Payment;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "*")
public class AdminOrderController {

    private static final Logger log = LoggerFactory.getLogger(AdminOrderController.class);
    private final OrderRepository orderRepository;

    public AdminOrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminOrderDto>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String search) {

        List<Order> orders = orderRepository.findAll();

        if (status != null) {
            orders = orders.stream()
                    .filter(o -> o.getStatus() == status)
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            orders = orders.stream()
                    .filter(o -> (o.getTrackingNumber() != null && o.getTrackingNumber().toLowerCase().contains(q)) ||
                                 (o.getReceiverName() != null && o.getReceiverName().toLowerCase().contains(q)) ||
                                 (o.getReceiverPhone() != null && o.getReceiverPhone().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        List<AdminOrderDto> dtos = orders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminOrderDto> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(o -> ResponseEntity.ok(toDto(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body("Trạng thái đơn hàng không hợp lệ!");
        }

        try {
            OrderStatus newStatus = OrderStatus.valueOf(statusStr.toUpperCase());
            return orderRepository.findById(id)
                    .map(order -> {
                        order.setStatus(newStatus);
                        Order updated = orderRepository.save(order);
                        log.info("Admin updated order #{} status to {}", id, newStatus);
                        return ResponseEntity.ok(toDto(updated));
                    })
                    .orElse(ResponseEntity.notFound().build());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Trạng thái không tồn tại: " + statusStr);
        }
    }

    private AdminOrderDto toDto(Order order) {
        String paymentMethod = "COD";
        String paymentStatus = "CHƯA THANH TOÁN";

        if (order.getPayments() != null && !order.getPayments().isEmpty()) {
            Payment p = order.getPayments().get(0);
            paymentMethod = p.getPaymentMethod() != null ? p.getPaymentMethod().name() : "COD";
            paymentStatus = p.getPaymentStatus() != null ? p.getPaymentStatus().name() : "PENDING";
        }

        List<AdminOrderDto.AdminOrderItemDto> itemDtos = null;
        if (order.getOrderDetails() != null) {
            itemDtos = order.getOrderDetails().stream().map(d -> {
                Book b = d.getBook();
                Long bookId = b != null ? b.getId() : null;
                String title = b != null ? b.getTitle() : "Sách";
                String img = "";
                if (b != null && b.getImages() != null && !b.getImages().isEmpty()) {
                    img = b.getImages().get(0).getImageUrl();
                }
                BigDecimal price = d.getUnitPrice() != null ? d.getUnitPrice() : BigDecimal.ZERO;
                int qty = (d.getQuantity() != null) ? d.getQuantity().intValue() : 0;
                BigDecimal sub = price.multiply(BigDecimal.valueOf(qty));

                return AdminOrderDto.AdminOrderItemDto.builder()
                        .bookId(bookId)
                        .bookTitle(title)
                        .bookImage(img)
                        .quantity(qty)
                        .unitPrice(price)
                        .subtotal(sub)
                        .build();
            }).collect(Collectors.toList());
        }

        return AdminOrderDto.builder()
                .id(order.getId())
                .trackingNumber(order.getTrackingNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .note(order.getNote())
                .paymentMethod(paymentMethod)
                .paymentStatus(paymentStatus)
                .createdAt(order.getCreatedAt())
                .items(itemDtos)
                .build();
    }
}
