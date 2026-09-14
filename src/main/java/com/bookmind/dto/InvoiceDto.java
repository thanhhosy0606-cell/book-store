package com.bookmind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDto {

    private String invoiceNumber;
    private Long orderId;
    private String trackingNumber;
    private String issueDate;

    // Đơn vị bán hàng
    private String sellerName;
    private String sellerTaxCode;
    private String sellerAddress;
    private String sellerPhone;
    private String sellerEmail;

    // Khách hàng
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private String customerEmail;

    // Chi tiết sản phẩm
    private List<InvoiceItemDto> items;

    // Tổng kết tài chính
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private String paymentStatus;
    private String transactionRef;
    private String digitalSignature;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InvoiceItemDto {
        private String title;
        private String author;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
}
