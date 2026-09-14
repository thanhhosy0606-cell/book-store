package com.bookmind.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentWebhookRequest {

    // SePay / Casso standard fields
    private Long id;
    private String gateway;
    private String transactionDate;
    private String accountNumber;
    private String subAccount;

    // Số tiền vào tài khoản
    private BigDecimal amountIn;
    // Hỗ trợ trường "amount" nếu dùng chuẩn Casso / PayOS
    private BigDecimal amount;
    private BigDecimal amountOut;
    private BigDecimal accumulated;

    private String code;
    private String transactionContent;
    private String referenceCode;
    private String description;

    // PayOS standard fields
    private Long orderCode;
    private String paymentLinkId;

    public BigDecimal getReceivedAmount() {
        if (amountIn != null && amountIn.compareTo(BigDecimal.ZERO) > 0) {
            return amountIn;
        }
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            return amount;
        }
        return BigDecimal.ZERO;
    }

    public String getContentText() {
        StringBuilder sb = new StringBuilder();
        if (transactionContent != null) sb.append(transactionContent).append(" ");
        if (description != null) sb.append(description).append(" ");
        if (code != null) sb.append(code).append(" ");
        return sb.toString().trim();
    }

    public String getTransactionReference() {
        if (referenceCode != null && !referenceCode.isBlank()) return referenceCode.trim();
        if (id != null) return String.valueOf(id);
        if (paymentLinkId != null) return paymentLinkId;
        return "REF-" + System.currentTimeMillis();
    }

    // Explicit setters to satisfy IDE language server (Lombok @Data generates these at compile time)
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }
    public void setGateway(String gateway) { this.gateway = gateway; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public void setAmountIn(java.math.BigDecimal amountIn) { this.amountIn = amountIn; }
    public void setTransactionContent(String transactionContent) { this.transactionContent = transactionContent; }
}
