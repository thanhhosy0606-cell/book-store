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
}

