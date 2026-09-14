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
        if (configuredApiKey == null || configuredApiKey.isBlank()) {
            return true;
        }
        if (authHeader == null || authHeader.isBlank()) {
            return false;
        }
        String cleanHeader = authHeader.replace("Apikey", "").replace("Bearer", "").trim();
        return configuredApiKey.equals(cleanHeader);
    }

    @Transactional
    public Order processPaymentWebhook(PaymentWebhookRequest request, String rawJson) {
        log.info("Processing payment webhook: ref={}, amount={}, content={}",
                request.getTransactionReference(), request.getReceivedAmount(), request.getContentText());

        String txRef = request.getTransactionReference();

        // 1. Chống trùng lặp (Idempotency)
        Optional<Payment> existingPayment = paymentRepository.findByTransactionRef(txRef);
        if (existingPayment.isPresent() && existingPayment.get().getPaymentStatus() == PaymentStatus.COMPLETED) {
            log.info("Transaction reference {} already processed successfully.", txRef);
            return existingPayment.get().getOrder();
        }

        // 2. Tìm đơn hàng tương ứng qua nội dung chuyển khoản
        String content = request.getContentText();
        Order order = findMatchingOrder(content, request.getOrderCode())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng khớp với nội dung: " + content));

        // 3. Kiểm tra số tiền
        BigDecimal received = request.getReceivedAmount();
        BigDecimal expected = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;

        if (received.compareTo(expected) < 0) {
            log.warn("Order #{} received amount {} is less than expected {}", order.getId(), received, expected);
            throw new IllegalArgumentException(String.format("Số tiền chuyển (%s) nhỏ hơn tổng tiền đơn hàng (%s)", received, expected));
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

    private Optional<Order> findMatchingOrder(String content, Long payOsOrderCode) {
        if (payOsOrderCode != null) {
            Optional<Order> byId = orderRepository.findById(payOsOrderCode);
            if (byId.isPresent()) return byId;
        }

        if (content == null || content.isBlank()) {
            return Optional.empty();
        }

        // Tìm kiếm pattern BM-XXXXXXXX hoặc BMXXXXXXXX (8 ký tự)
        Pattern patternBM = Pattern.compile("(?i)(BM-?[A-Z0-9]{6,10})");
        Matcher matcherBM = patternBM.matcher(content);
        if (matcherBM.find()) {
            String matched = matcherBM.group(1).toUpperCase();
            // Chuẩn hóa định dạng BM-XXXXXXXX
            String normalizedTracking = matched.startsWith("BM-") ? matched : "BM-" + matched.substring(2);
            Optional<Order> order = orderRepository.findByTrackingNumber(normalizedTracking);
            if (order.isPresent()) return order;

            // Thử tìm theo mã gốc nếu không có dấu gạch ngang
            order = orderRepository.findByTrackingNumber(matched);
            if (order.isPresent()) return order;
        }

        // Thử tìm theo DHxxxx (Mã đơn rút gọn theo ID)
        Pattern patternDH = Pattern.compile("(?i)DH(\\d+)");
        Matcher matcherDH = patternDH.matcher(content);
        if (matcherDH.find()) {
            try {
                Long orderId = Long.parseLong(matcherDH.group(1));
                Optional<Order> byId = orderRepository.findById(orderId);
                if (byId.isPresent()) return byId;
            } catch (NumberFormatException ignored) {}
        }

        // Quét toàn bộ đơn hàng PENDING gần nhất
        List<Order> pendingOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        for (Order o : pendingOrders) {
            if (o.getTrackingNumber() != null && content.toUpperCase().contains(o.getTrackingNumber().toUpperCase())) {
                return Optional.of(o);
            }
        }

        return Optional.empty();
    }
}
