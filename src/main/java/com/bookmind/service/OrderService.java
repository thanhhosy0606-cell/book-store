package com.bookmind.service;

import com.bookmind.dto.CreateOrderRequest;
import com.bookmind.dto.OrderDto;
import com.bookmind.entity.*;
import com.bookmind.entity.enums.BookStatus;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.entity.enums.PaymentMethod;
import com.bookmind.entity.enums.PaymentStatus;
import com.bookmind.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final InvoiceService invoiceService;

    public OrderService(OrderRepository orderRepository,
                        OrderDetailRepository orderDetailRepository,
                        PaymentRepository paymentRepository,
                        UserRepository userRepository,
                        BookRepository bookRepository,
                        InvoiceService invoiceService) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.invoiceService = invoiceService;
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        log.info("Creating new order for receiver: {}", request.getReceiverName());

        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null) {
            List<User> allUsers = userRepository.findAll();
            if (!allUsers.isEmpty()) {
                user = allUsers.get(0);
            } else {
                user = new User();
                user.setEmail("khach_" + System.currentTimeMillis() + "@bookmind.vn");
                user.setFullName(request.getReceiverName() != null ? request.getReceiverName() : "Khách Hàng");
                user.setPhone(request.getReceiverPhone() != null && !request.getReceiverPhone().isBlank() ? request.getReceiverPhone() : null);
                user.setPassword("guest123456");
                user.setStatus(com.bookmind.entity.enums.UserStatus.ACTIVE);
                user = userRepository.save(user);
            }
        }

        String trackingNumber = (request.getTrackingNumber() != null && !request.getTrackingNumber().trim().isEmpty())
                ? request.getTrackingNumber().trim().toUpperCase()
                : "BM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        BigDecimal subtotal = request.getSubtotal() != null ? request.getSubtotal() : BigDecimal.ZERO;
        BigDecimal shippingFee = request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO;

        if (subtotal.compareTo(BigDecimal.ZERO) == 0 && request.getItems() != null && !request.getItems().isEmpty()) {
            for (CreateOrderRequest.OrderItemDto itemReq : request.getItems()) {
                BigDecimal itemPrice = itemReq.getPrice() != null ? itemReq.getPrice() : BigDecimal.ZERO;
                int qty = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;
                subtotal = subtotal.add(itemPrice.multiply(BigDecimal.valueOf(qty)));
            }
        }

        BigDecimal totalAmount = request.getTotalAmount() != null ? request.getTotalAmount() : subtotal.add(shippingFee);

        // Xác thực trước các sản phẩm trong giỏ hàng
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CreateOrderRequest.OrderItemDto itemReq : request.getItems()) {
                if (itemReq.getBookId() != null) {
                    Book checkBook = bookRepository.findById(itemReq.getBookId()).orElse(null);
                    if (checkBook != null) {
                        if (checkBook.getStatus() == BookStatus.STOPPED) {
                            throw new IllegalArgumentException("Sách '" + checkBook.getTitle() + "' hiện đã ngừng kinh doanh, không thể đặt mua!");
                        }
                        int reqQty = (itemReq.getQuantity() != null && itemReq.getQuantity() > 0) ? itemReq.getQuantity() : 1;
                        if (checkBook.getStockQuantity() != null && checkBook.getStockQuantity() < reqQty) {
                            throw new IllegalArgumentException("Kho không đủ sách cho cuốn '" + checkBook.getTitle() + "'! Bạn đặt " + reqQty + " cuốn nhưng kho chỉ còn " + checkBook.getStockQuantity() + " cuốn.");
                        }
                    }
                }
            }
        }

        Order order = new Order();
        order.setUser(user);
        order.setTrackingNumber(trackingNumber);
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setNote(request.getNote());
        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder = orderRepository.save(order);

        // Lưu danh sách chi tiết đơn hàng & cập nhật tồn kho
        List<CreateOrderRequest.OrderItemDto> itemDtos = new ArrayList<>();
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CreateOrderRequest.OrderItemDto itemReq : request.getItems()) {
                Book book = null;
                if (itemReq.getBookId() != null) {
                    book = bookRepository.findById(itemReq.getBookId()).orElse(null);
                }

                if (book != null) {
                    OrderDetail detail = new OrderDetail();
                    detail.setOrder(savedOrder);
                    detail.setBook(book);
                    Integer quantity = itemReq.getQuantity();
                    if (quantity == null || quantity <= 0) {
                        quantity = 1;
                    }
                    detail.setQuantity(quantity);
                    detail.setUnitPrice(itemReq.getPrice() != null ? itemReq.getPrice() : book.getSalePrice());
                    orderDetailRepository.save(detail);
                    savedOrder.getOrderDetails().add(detail);

                    // Trừ tồn kho và chuyển trạng thái nếu hết hàng
                    if (book.getStockQuantity() != null) {
                        int remaining = Math.max(0, book.getStockQuantity() - quantity);
                        book.setStockQuantity(remaining);
                        if (remaining == 0) {
                            book.setStatus(BookStatus.OUT_OF_STOCK);
                        }
                        bookRepository.save(book);
                    }

                    CreateOrderRequest.OrderItemDto orderItemDto = new CreateOrderRequest.OrderItemDto(
                            book.getId(),
                            book.getTitle(),
                            book.getAuthor(),
                            detail.getQuantity(),
                            detail.getUnitPrice()
                    );
                    itemDtos.add(orderItemDto);
                } else {
                    itemDtos.add(itemReq);
                }
            }
        }

        // Lưu thông tin thanh toán
        String methodStr = request.getPaymentMethod();
        PaymentMethod paymentMethod;
        PaymentStatus paymentStatus;

        if ("VIETQR".equalsIgnoreCase(methodStr) || "PAYOS".equalsIgnoreCase(methodStr)) {
            paymentMethod = PaymentMethod.VIETQR;
            paymentStatus = PaymentStatus.PENDING;
        } else {
            paymentMethod = PaymentMethod.COD;
            paymentStatus = PaymentStatus.PENDING;
        }

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus(paymentStatus);
        payment.setPaymentDate(paymentStatus == PaymentStatus.COMPLETED ? LocalDateTime.now() : null);
        payment.setTransactionId("TXN-" + System.currentTimeMillis());

        paymentRepository.save(payment);

        return mapToDto(savedOrder, itemDtos, paymentMethod.name(), paymentStatus.name());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByUser(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Vui lòng đăng nhập để xem danh sách đơn hàng!");
        }
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        try {
            OrderStatus status = OrderStatus.valueOf(newStatus.toUpperCase());
            order.setStatus(status);
            Order updated = orderRepository.save(order);
            return convertEntityToDto(updated);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái đơn hàng không hợp lệ: " + newStatus);
        }
    }

    public OrderDto getOrderByTrackingNumber(String trackingNumber) {
        Order order = orderRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + trackingNumber));
        return convertEntityToDto(order);
    }

    private OrderDto convertEntityToDto(Order order) {
        List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
        List<CreateOrderRequest.OrderItemDto> items = details.stream().map(d -> {
            Book b = d.getBook();
            return new CreateOrderRequest.OrderItemDto(
                    b != null ? b.getId() : null,
                    b != null ? b.getTitle() : "Sách",
                    b != null ? b.getAuthor() : "",
                    d.getQuantity(),
                    d.getUnitPrice()
            );
        }).collect(Collectors.toList());

        List<Payment> payments = paymentRepository.findByOrderId(order.getId());
        String pMethod = "COD";
        String pStatus = "PENDING";
        if (!payments.isEmpty()) {
            Payment p = payments.get(0);
            pMethod = p.getPaymentMethod() != null ? p.getPaymentMethod().name() : "COD";
            pStatus = p.getPaymentStatus() != null ? p.getPaymentStatus().name() : "PENDING";
        }

        return mapToDto(order, items, pMethod, pStatus);
    }

    private OrderDto mapToDto(Order order, List<CreateOrderRequest.OrderItemDto> items, String paymentMethod, String paymentStatus) {
        String statusLabel = "Chờ xác nhận";
        int statusCode = 1;

        if (order.getStatus() != null) {
            switch (order.getStatus()) {
                case PENDING -> {
                    statusLabel = "Chờ xác nhận";
                    statusCode = 1;
                }
                case CONFIRMED -> {
                    statusLabel = "Chờ lấy hàng";
                    statusCode = 2;
                }
                case SHIPPING -> {
                    statusLabel = "Chờ giao hàng";
                    statusCode = 3;
                }
                case DELIVERED -> {
                    statusLabel = "Đã giao";
                    statusCode = 4;
                }
                case CANCELLED -> {
                    statusLabel = "Đã hủy";
                    statusCode = 0;
                }
            }
        }

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTrackingNumber(order.getTrackingNumber());
        dto.setCreatedAt(order.getCreatedAt() != null ? order.getCreatedAt() : LocalDateTime.now());
        dto.setReceiverName(order.getReceiverName());
        dto.setReceiverPhone(order.getReceiverPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setNote(order.getNote());
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingFee(order.getShippingFee());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus() != null ? order.getStatus().name() : "PENDING");
        dto.setStatusLabel(statusLabel);
        dto.setStatusCode(statusCode);
        dto.setPaymentMethod(paymentMethod);
        dto.setPaymentStatus(paymentStatus);
        dto.setItems(items);

        return dto;
    }
}
