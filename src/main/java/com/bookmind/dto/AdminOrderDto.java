package com.bookmind.dto;

import com.bookmind.entity.enums.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderDto {
    private Long id;
    private String trackingNumber;
    private Long userId;
    private String userEmail;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String note;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private List<AdminOrderItemDto> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminOrderItemDto {
        private Long bookId;
        private String bookTitle;
        private String bookImage;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
