package com.bookmind.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
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

    // SePay standard fields
    @JsonProperty("id")
    private Long id;

    @JsonProperty("gateway")
    private String gateway;

    @JsonProperty("transactionDate")
    @JsonAlias({"transaction_date", "when", "createdAt", "transactionDateTime"})
    private String transactionDate;

    @JsonProperty("accountNumber")
    @JsonAlias({"account_number", "bank_account_id", "bank_sub_acc_id"})
    private String accountNumber;

    @JsonProperty("subAccount")
    private String subAccount;

    @JsonProperty("transferType")
    private String transferType;

    // Số tiền vào tài khoản
    @JsonProperty("transferAmount")
    @JsonAlias({"amount_in", "amountIn"})
    private BigDecimal transferAmount;

    @JsonProperty("amountIn")
    private BigDecimal amountIn;

    // Hỗ trợ trường "amount" nếu dùng chuẩn Casso / PayOS
    @JsonProperty("amount")
    private BigDecimal amount;

    @JsonProperty("amountOut")
    private BigDecimal amountOut;

    @JsonProperty("accumulated")
    private BigDecimal accumulated;

    @JsonProperty("code")
    private String code;

    @JsonProperty("content")
    @JsonAlias({"transaction_content", "transactionContent", "memo"})
    private String content;

    @JsonProperty("transactionContent")
    private String transactionContent;

    @JsonProperty("referenceCode")
    @JsonAlias({"reference_number", "referenceNumber", "tid", "reference"})
    private String referenceCode;

    @JsonProperty("description")
    private String description;

    // PayOS standard fields
    @JsonProperty("orderCode")
    @JsonAlias({"order_code"})
    private Long orderCode;

    @JsonProperty("paymentLinkId")
    private String paymentLinkId;

    public BigDecimal getReceivedAmount() {
        if (transferAmount != null && transferAmount.compareTo(BigDecimal.ZERO) > 0) {
            return transferAmount;
        }
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
        if (content != null) sb.append(content).append(" ");
        if (transactionContent != null) sb.append(transactionContent).append(" ");
        if (code != null) sb.append(code).append(" ");
        if (description != null) sb.append(description).append(" ");
        return sb.toString().trim();
    }

    public String getTransactionReference() {
        if (referenceCode != null && !referenceCode.isBlank()) return referenceCode.trim();
        if (id != null) return String.valueOf(id);
        if (paymentLinkId != null) return paymentLinkId;
        return "REF-" + System.currentTimeMillis();
    }

    // Explicit Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGateway() { return gateway; }
    public void setGateway(String gateway) { this.gateway = gateway; }

    public String getTransactionDate() { return transactionDate; }
    public void setTransactionDate(String transactionDate) { this.transactionDate = transactionDate; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getSubAccount() { return subAccount; }
    public void setSubAccount(String subAccount) { this.subAccount = subAccount; }

    public String getTransferType() { return transferType; }
    public void setTransferType(String transferType) { this.transferType = transferType; }

    public BigDecimal getTransferAmount() { return transferAmount; }
    public void setTransferAmount(BigDecimal transferAmount) { this.transferAmount = transferAmount; }

    public BigDecimal getAmountIn() { return amountIn; }
    public void setAmountIn(BigDecimal amountIn) { this.amountIn = amountIn; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getAmountOut() { return amountOut; }
    public void setAmountOut(BigDecimal amountOut) { this.amountOut = amountOut; }

    public BigDecimal getAccumulated() { return accumulated; }
    public void setAccumulated(BigDecimal accumulated) { this.accumulated = accumulated; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getTransactionContent() { return transactionContent; }
    public void setTransactionContent(String transactionContent) { this.transactionContent = transactionContent; }

    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getOrderCode() { return orderCode; }
    public void setOrderCode(Long orderCode) { this.orderCode = orderCode; }

    public String getPaymentLinkId() { return paymentLinkId; }
    public void setPaymentLinkId(String paymentLinkId) { this.paymentLinkId = paymentLinkId; }
}

