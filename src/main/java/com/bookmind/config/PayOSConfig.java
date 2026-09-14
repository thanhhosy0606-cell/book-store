package com.bookmind.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class PayOSConfig {

    @Value("${payos.client-id:8bfb154b-bfa4-4a3c-a0be-acc4137a7e29}")
    private String clientId;

    @Value("${payos.api-key:d220df7f-0081-417e-93fb-0fc27e021c1c}")
    private String apiKey;

    @Value("${payos.checksum-key:136724377bd329a8c170a84453d3e3c2629c4c47b053f76fc9a1c4ac4c5c1cfd}")
    private String checksumKey;

    @Value("${payos.return-url:https://book-store-6q2m.onrender.com/payment-result.html}")
    private String returnUrl;

    @Value("${payos.cancel-url:https://book-store-6q2m.onrender.com/}")
    private String cancelUrl;

    public String getClientId() {
        return clientId != null ? clientId.trim() : "";
    }

    public String getApiKey() {
        return apiKey != null ? apiKey.trim() : "";
    }

    public String getChecksumKey() {
        return checksumKey != null ? checksumKey.trim() : "";
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public boolean isConfigured() {
        return !getClientId().isEmpty() && !getApiKey().isEmpty() && !getChecksumKey().isEmpty();
    }

    /**
     * Thuật toán HMAC-SHA256 theo tiêu chuẩn của PayOS
     */
    public static String hmacSHA256(String key, String data) {
        try {
            if (key == null || data == null) {
                return "";
            }
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi sinh chữ ký HMAC-SHA256 PayOS: " + e.getMessage(), e);
        }
    }
}
