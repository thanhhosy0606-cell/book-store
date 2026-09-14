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

    // Explicit Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<AdminOrderItemDto> getItems() { return items; }
    public void setItems(List<AdminOrderItemDto> items) { this.items = items; }

    public static AdminOrderDtoBuilder builder() {
        return new AdminOrderDtoBuilder();
    }

    public static class AdminOrderDtoBuilder {
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

        public AdminOrderDtoBuilder id(Long id) { this.id = id; return this; }
        public AdminOrderDtoBuilder trackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; return this; }
        public AdminOrderDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public AdminOrderDtoBuilder userEmail(String userEmail) { this.userEmail = userEmail; return this; }
        public AdminOrderDtoBuilder receiverName(String receiverName) { this.receiverName = receiverName; return this; }
        public AdminOrderDtoBuilder receiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; return this; }
        public AdminOrderDtoBuilder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public AdminOrderDtoBuilder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public AdminOrderDtoBuilder shippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; return this; }
        public AdminOrderDtoBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public AdminOrderDtoBuilder status(OrderStatus status) { this.status = status; return this; }
        public AdminOrderDtoBuilder note(String note) { this.note = note; return this; }
        public AdminOrderDtoBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public AdminOrderDtoBuilder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public AdminOrderDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AdminOrderDtoBuilder items(List<AdminOrderItemDto> items) { this.items = items; return this; }

        public AdminOrderDto build() {
            AdminOrderDto dto = new AdminOrderDto();
            dto.id = this.id;
            dto.trackingNumber = this.trackingNumber;
            dto.userId = this.userId;
            dto.userEmail = this.userEmail;
            dto.receiverName = this.receiverName;
            dto.receiverPhone = this.receiverPhone;
            dto.shippingAddress = this.shippingAddress;
            dto.subtotal = this.subtotal;
            dto.shippingFee = this.shippingFee;
            dto.totalAmount = this.totalAmount;
            dto.status = this.status;
            dto.note = this.note;
            dto.paymentMethod = this.paymentMethod;
            dto.paymentStatus = this.paymentStatus;
            dto.createdAt = this.createdAt;
            dto.items = this.items;
            return dto;
        }
    }

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

        public Long getBookId() { return bookId; }
        public void setBookId(Long bookId) { this.bookId = bookId; }
        public String getBookTitle() { return bookTitle; }
        public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
        public String getBookImage() { return bookImage; }
        public void setBookImage(String bookImage) { this.bookImage = bookImage; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

        public static AdminOrderItemDtoBuilder builder() {
            return new AdminOrderItemDtoBuilder();
        }

        public static class AdminOrderItemDtoBuilder {
            private Long bookId;
            private String bookTitle;
            private String bookImage;
            private Integer quantity;
            private BigDecimal unitPrice;
            private BigDecimal subtotal;

            public AdminOrderItemDtoBuilder bookId(Long bookId) { this.bookId = bookId; return this; }
            public AdminOrderItemDtoBuilder bookTitle(String bookTitle) { this.bookTitle = bookTitle; return this; }
            public AdminOrderItemDtoBuilder bookImage(String bookImage) { this.bookImage = bookImage; return this; }
            public AdminOrderItemDtoBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
            public AdminOrderItemDtoBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
            public AdminOrderItemDtoBuilder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }

            public AdminOrderItemDto build() {
                AdminOrderItemDto item = new AdminOrderItemDto();
                item.bookId = this.bookId;
                item.bookTitle = this.bookTitle;
                item.bookImage = this.bookImage;
                item.quantity = this.quantity;
                item.unitPrice = this.unitPrice;
                item.subtotal = this.subtotal;
                return item;
            }
        }
    }
}
