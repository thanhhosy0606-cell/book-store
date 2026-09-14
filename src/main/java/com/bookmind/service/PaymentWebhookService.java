package com.bookmind.service;

import com.bookmind.dto.PaymentWebhookRequest;
import com.bookmind.entity.Order;
import com.bookmind.entity.Payment;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.entity.enums.PaymentMethod;
import com.bookmind.entity.enums.PaymentStatus;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PaymentWebhookService {

    private static final Logger log = LoggerFactory.getLogger(PaymentWebhookService.class);

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceService invoiceService;

    @Value("${payment.webhook.api-key:bookmind_secret_webhook_key_2026}")
    private String configuredApiKey;

    public PaymentWebhookService(OrderRepository orderRepository,
                                 PaymentRepository paymentRepository,
                                 InvoiceService invoiceService) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.invoiceService = invoiceService;
    }

    public boolean validateApiKey(String authHeader) {
        if (configuredApiKey == null || configuredApiKey.isBlank() || "none".equalsIgnoreCase(configuredApiKey.trim())) {
            return true;
        }
        if (authHeader == null || authHeader.isBlank()) {
            return false;
        }
        String cleanHeader = authHeader.replaceAll("(?i)^(apikey|bearer)\\s+", "").trim();
        return configuredApiKey.equals(cleanHeader) || configuredApiKey.equalsIgnoreCase(cleanHeader);
    }

    @Transactional
    public Order processPaymentWebhook(PaymentWebhookRequest request, String rawJson) {
        log.info("Processing payment webhook: ref={}, amount={}, content={}, code={}, gateway={}",
                request.getTransactionReference(), request.getReceivedAmount(), request.getContentText(), request.getCode(), request.getGateway());

        String txRef = request.getTransactionReference();

        // 1. Chống trùng lặp (Idempotency)
        Optional<Payment> existingPayment = paymentRepository.findByTransactionRef(txRef);
        if (existingPayment.isPresent() && existingPayment.get().getPaymentStatus() == PaymentStatus.COMPLETED) {
            log.info("Transaction reference {} already processed successfully.", txRef);
            return existingPayment.get().getOrder();
        }

        // 2. Tìm đơn hàng tương ứng qua nội dung chuyển khoản, mã SePay hoặc số tiền
        String content = request.getContentText();
        BigDecimal received = request.getReceivedAmount();
        Optional<Order> matchedOrderOpt = findMatchingOrder(content, request.getCode(), request.getOrderCode(), received);
        if (matchedOrderOpt.isEmpty()) {
            log.warn("No matching order found for webhook: content='{}', code='{}', amount={}", content, request.getCode(), received);
            return null;
        }

        Order order = matchedOrderOpt.get();

        // 3. Kiểm tra số tiền
        BigDecimal expected = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
        if (received.compareTo(expected) < 0) {
            log.warn("Order #{} received amount {} is less than expected {}", order.getId(), received, expected);
            return null;
        }

        // 4. Cập nhật trạng thái đơn hàng & sinh hóa đơn
        order.setStatus(OrderStatus.CONFIRMED);
        invoiceService.ensureInvoiceGenerated(order);
        orderRepository.save(order);

        // 5. Cập nhật hoặc tạo bản ghi Payment
        List<Payment> payments = paymentRepository.findByOrderId(order.getId());
        Payment payment = payments.isEmpty() ? new Payment() : payments.get(0);

        payment.setOrder(order);
        payment.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(txRef);
        payment.setTransactionRef(txRef);
        payment.setBankAccount(request.getAccountNumber());
        payment.setTransferContent(content);
        payment.setRawWebhookPayload(rawJson);

        paymentRepository.save(payment);

        log.info("Order #{} (tracking: {}) has been paid successfully via Webhook. Invoice: {}",
                order.getId(), order.getTrackingNumber(), order.getInvoiceNumber());

        return order;
    }

    private Optional<Order> findMatchingOrder(String content, String sePayCode, Long payOsOrderCode, BigDecimal receivedAmount) {
        // 1. Nếu SePay đã trích xuất sẵn trường code
        if (sePayCode != null && !sePayCode.isBlank()) {
            String c = sePayCode.trim().toUpperCase();
            Optional<Order> byCode = orderRepository.findByTrackingNumber(c);
            if (byCode.isPresent()) return byCode;
            if (!c.startsWith("BM-") && c.startsWith("BM")) {
                byCode = orderRepository.findByTrackingNumber("BM-" + c.substring(2));
                if (byCode.isPresent()) return byCode;
            } else if (!c.startsWith("BM")) {
                byCode = orderRepository.findByTrackingNumber("BM-" + c);
                if (byCode.isPresent()) return byCode;
            }
        }

        // 2. Nếu PayOS gửi orderCode dạng ID số
        if (payOsOrderCode != null) {
            Optional<Order> byId = orderRepository.findById(payOsOrderCode);
            if (byId.isPresent()) return byId;
        }

        if (content != null && !content.isBlank()) {
            // 3. Tìm kiếm pattern BM-XXXXXXXX hoặc BMXXXXXXXX hoặc BM XXXXXXXX
            Pattern patternBM = Pattern.compile("(?i)BM[\\s\\-_]?([A-Z0-9]{4,12})");
            Matcher matcherBM = patternBM.matcher(content);
            if (matcherBM.find()) {
                String sub = matcherBM.group(1).toUpperCase();
                // Thử tìm BM-sub
                Optional<Order> order = orderRepository.findByTrackingNumber("BM-" + sub);
                if (order.isPresent()) return order;

                // Thử tìm BMsub
                order = orderRepository.findByTrackingNumber("BM" + sub);
                if (order.isPresent()) return order;

                // Thử tìm sub
                order = orderRepository.findByTrackingNumber(sub);
                if (order.isPresent()) return order;
            }

            // 4. Thử tìm theo DHxxxx
            Pattern patternDH = Pattern.compile("(?i)DH(\\d+)");
            Matcher matcherDH = patternDH.matcher(content);
            if (matcherDH.find()) {
                try {
                    Long orderId = Long.parseLong(matcherDH.group(1));
                    Optional<Order> byId = orderRepository.findById(orderId);
                    if (byId.isPresent()) return byId;
                } catch (NumberFormatException ignored) {}
            }

            // 5. Quét toàn bộ đơn hàng PENDING gần nhất
            List<Order> pendingOrders = orderRepository.findAllByOrderByCreatedAtDesc();
            String alphaNumContent = content.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
            for (Order o : pendingOrders) {
                if (o.getTrackingNumber() != null) {
                    String trackingRaw = o.getTrackingNumber().toUpperCase();
                    if (content.toUpperCase().contains(trackingRaw)) {
                        return Optional.of(o);
                    }
                    String trackingAlphaNum = trackingRaw.replaceAll("[^a-zA-Z0-9]", "");
                    if (!trackingAlphaNum.isEmpty() && alphaNumContent.contains(trackingAlphaNum)) {
                        return Optional.of(o);
                    }
                }
            }
        }

        // 6. Fallback thông minh: Nếu chỉ có duy nhất 1 đơn hàng PENDING trong vòng 30 phút có đúng số tiền
        if (receivedAmount != null && receivedAmount.compareTo(BigDecimal.ZERO) > 0) {
            LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);
            List<Order> candidateOrders = orderRepository.findAllByOrderByCreatedAtDesc().stream()
                    .filter(o -> o.getStatus() == OrderStatus.PENDING)
                    .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isAfter(threshold))
                    .filter(o -> o.getTotalAmount() != null && o.getTotalAmount().compareTo(receivedAmount) == 0)
                    .toList();
            if (candidateOrders.size() == 1) {
                log.info("Matched single pending order #{} by amount {} within 30 minutes", candidateOrders.get(0).getId(), receivedAmount);
                return Optional.of(candidateOrders.get(0));
            }
        }

        return Optional.empty();
    }
}
