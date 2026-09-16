package com.bookmind.entity;

import com.bookmind.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "tracking_number", length = 50, unique = true)
    private String trackingNumber;

    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @Column(name = "shipping_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "shipping_address", columnDefinition = "TEXT", nullable = false)
    private String shippingAddress;

    @Column(name = "receiver_name", length = 100, nullable = false)
    private String receiverName;

    @Column(name = "receiver_phone", length = 15, nullable = false)
    private String receiverPhone;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "invoice_issued_at")
    private LocalDateTime invoiceIssuedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Payment> payments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.shippingFee == null) {
            this.shippingFee = BigDecimal.ZERO;
        }
        if (this.status == null) {
            this.status = OrderStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public LocalDateTime getInvoiceIssuedAt() {
        return invoiceIssuedAt;
    }

    public void setInvoiceIssuedAt(LocalDateTime invoiceIssuedAt) {
        this.invoiceIssuedAt = invoiceIssuedAt;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }

    public String getPaymentMethod() {
        if (payments != null && !payments.isEmpty() && payments.get(0).getPaymentMethod() != null) {
            return payments.get(0).getPaymentMethod().name();
        }
        return "COD";
    }

    public String getPaymentStatus() {
        if (payments != null && !payments.isEmpty() && payments.get(0).getPaymentStatus() != null) {
            return payments.get(0).getPaymentStatus().name();
        }
        return "PENDING";
    }

    public List<com.bookmind.dto.CreateOrderRequest.OrderItemDto> getItems() {
        if (orderDetails == null) return java.util.Collections.emptyList();
        return orderDetails.stream().map(d -> {
            Book b = d.getBook();
            return new com.bookmind.dto.CreateOrderRequest.OrderItemDto(
                    b != null ? b.getId() : null,
                    b != null ? b.getTitle() : "Sách",
                    b != null ? b.getAuthor() : "",
                    d.getQuantity(),
                    d.getUnitPrice()
            );
        }).collect(java.util.stream.Collectors.toList());
    }
}
