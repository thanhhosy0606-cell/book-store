package com.bookmind.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
    private List<InvoiceItemDto> items = new ArrayList<>();

    // Tổng kết tài chính
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private String paymentStatus;
    private String transactionRef;
    private String digitalSignature;

    public InvoiceDto() {
    }

    public InvoiceDto(String invoiceNumber, Long orderId, String trackingNumber, String issueDate,
                      String sellerName, String sellerTaxCode, String sellerAddress, String sellerPhone, String sellerEmail,
                      String customerName, String customerPhone, String customerAddress, String customerEmail,
                      List<InvoiceItemDto> items, BigDecimal subtotal, BigDecimal shippingFee,
                      BigDecimal discountAmount, BigDecimal totalAmount, String paymentMethod,
                      String paymentStatus, String transactionRef, String digitalSignature) {
        this.invoiceNumber = invoiceNumber;
        this.orderId = orderId;
        this.trackingNumber = trackingNumber;
        this.issueDate = issueDate;
        this.sellerName = sellerName;
        this.sellerTaxCode = sellerTaxCode;
        this.sellerAddress = sellerAddress;
        this.sellerPhone = sellerPhone;
        this.sellerEmail = sellerEmail;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerAddress = customerAddress;
        this.customerEmail = customerEmail;
        this.items = items != null ? items : new ArrayList<>();
        this.subtotal = subtotal;
        this.shippingFee = shippingFee;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionRef = transactionRef;
        this.digitalSignature = digitalSignature;
    }

    public static InvoiceDtoBuilder builder() {
        return new InvoiceDtoBuilder();
    }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getSellerTaxCode() { return sellerTaxCode; }
    public void setSellerTaxCode(String sellerTaxCode) { this.sellerTaxCode = sellerTaxCode; }

    public String getSellerAddress() { return sellerAddress; }
    public void setSellerAddress(String sellerAddress) { this.sellerAddress = sellerAddress; }

    public String getSellerPhone() { return sellerPhone; }
    public void setSellerPhone(String sellerPhone) { this.sellerPhone = sellerPhone; }

    public String getSellerEmail() { return sellerEmail; }
    public void setSellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerAddress() { return customerAddress; }
    public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public List<InvoiceItemDto> getItems() { return items; }
    public void setItems(List<InvoiceItemDto> items) { this.items = items; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public String getDigitalSignature() { return digitalSignature; }
    public void setDigitalSignature(String digitalSignature) { this.digitalSignature = digitalSignature; }

    public static class InvoiceDtoBuilder {
        private String invoiceNumber;
        private Long orderId;
        private String trackingNumber;
        private String issueDate;
        private String sellerName;
        private String sellerTaxCode;
        private String sellerAddress;
        private String sellerPhone;
        private String sellerEmail;
        private String customerName;
        private String customerPhone;
        private String customerAddress;
        private String customerEmail;
        private List<InvoiceItemDto> items;
        private BigDecimal subtotal;
        private BigDecimal shippingFee;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
        private String paymentMethod;
        private String paymentStatus;
        private String transactionRef;
        private String digitalSignature;

        public InvoiceDtoBuilder invoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; return this; }
        public InvoiceDtoBuilder orderId(Long orderId) { this.orderId = orderId; return this; }
        public InvoiceDtoBuilder trackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; return this; }
        public InvoiceDtoBuilder issueDate(String issueDate) { this.issueDate = issueDate; return this; }
        public InvoiceDtoBuilder sellerName(String sellerName) { this.sellerName = sellerName; return this; }
        public InvoiceDtoBuilder sellerTaxCode(String sellerTaxCode) { this.sellerTaxCode = sellerTaxCode; return this; }
        public InvoiceDtoBuilder sellerAddress(String sellerAddress) { this.sellerAddress = sellerAddress; return this; }
        public InvoiceDtoBuilder sellerPhone(String sellerPhone) { this.sellerPhone = sellerPhone; return this; }
        public InvoiceDtoBuilder sellerEmail(String sellerEmail) { this.sellerEmail = sellerEmail; return this; }
        public InvoiceDtoBuilder customerName(String customerName) { this.customerName = customerName; return this; }
        public InvoiceDtoBuilder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public InvoiceDtoBuilder customerAddress(String customerAddress) { this.customerAddress = customerAddress; return this; }
        public InvoiceDtoBuilder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public InvoiceDtoBuilder items(List<InvoiceItemDto> items) { this.items = items; return this; }
        public InvoiceDtoBuilder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
        public InvoiceDtoBuilder shippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; return this; }
        public InvoiceDtoBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public InvoiceDtoBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public InvoiceDtoBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public InvoiceDtoBuilder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public InvoiceDtoBuilder transactionRef(String transactionRef) { this.transactionRef = transactionRef; return this; }
        public InvoiceDtoBuilder digitalSignature(String digitalSignature) { this.digitalSignature = digitalSignature; return this; }

        public InvoiceDto build() {
            return new InvoiceDto(invoiceNumber, orderId, trackingNumber, issueDate,
                    sellerName, sellerTaxCode, sellerAddress, sellerPhone, sellerEmail,
                    customerName, customerPhone, customerAddress, customerEmail,
                    items, subtotal, shippingFee, discountAmount, totalAmount,
                    paymentMethod, paymentStatus, transactionRef, digitalSignature);
        }
    }

    public static class InvoiceItemDto {
        private String title;
        private String author;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public InvoiceItemDto() {
        }

        public InvoiceItemDto(String title, String author, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
            this.title = title;
            this.author = author;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.totalPrice = totalPrice;
        }

        public static InvoiceItemDtoBuilder builder() {
            return new InvoiceItemDtoBuilder();
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

        public static class InvoiceItemDtoBuilder {
            private String title;
            private String author;
            private Integer quantity;
            private BigDecimal unitPrice;
            private BigDecimal totalPrice;

            public InvoiceItemDtoBuilder title(String title) { this.title = title; return this; }
            public InvoiceItemDtoBuilder author(String author) { this.author = author; return this; }
            public InvoiceItemDtoBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
            public InvoiceItemDtoBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
            public InvoiceItemDtoBuilder totalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; return this; }

            public InvoiceItemDto build() {
                return new InvoiceItemDto(title, author, quantity, unitPrice, totalPrice);
            }
        }
    }
}
