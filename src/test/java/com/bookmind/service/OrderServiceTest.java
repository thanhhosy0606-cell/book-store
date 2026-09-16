package com.bookmind.service;

import com.bookmind.dto.CreateOrderRequest;
import com.bookmind.dto.OrderDto;
import com.bookmind.entity.Book;
import com.bookmind.entity.Order;
import com.bookmind.entity.User;
import com.bookmind.entity.enums.BookStatus;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.repository.BookRepository;
import com.bookmind.repository.OrderDetailRepository;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.PaymentRepository;
import com.bookmind.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderDetailRepository orderDetailRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CouponService couponService;

    @InjectMocks
    private OrderService orderService;

    private User sampleUser;
    private Book sampleBook;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("user@example.com");

        sampleBook = new Book();
        sampleBook.setId(10L);
        sampleBook.setTitle("Sách Lập Trình Java");
        sampleBook.setAuthor("Nhã Nam");
        sampleBook.setSalePrice(new BigDecimal("150000"));
        sampleBook.setStockQuantity(50);
        sampleBook.setStatus(BookStatus.AVAILABLE);
    }

    @Test
    void testCreateOrder_Success() {
        CreateOrderRequest req = new CreateOrderRequest();
        req.setUserId(1L);
        req.setReceiverName("Nguyen Van A");
        req.setReceiverPhone("0987654321");
        req.setShippingAddress("123 Duong ABC, Ha Noi");
        req.setPaymentMethod("COD");

        CreateOrderRequest.OrderItemDto item = new CreateOrderRequest.OrderItemDto();
        item.setBookId(10L);
        item.setQuantity(2);
        item.setPrice(new BigDecimal("150000"));
        req.setItems(Collections.singletonList(item));

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(bookRepository.findById(10L)).thenReturn(Optional.of(sampleBook));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(100L);
            o.setOrderDetails(new ArrayList<>());
            return o;
        });

        OrderDto result = orderService.createOrder(req);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals("Chờ xác nhận", result.getStatusLabel());
        assertEquals(1, result.getStatusCode());
        assertEquals(new BigDecimal("300000"), result.getTotalAmount());
        // Verify stock was reduced from 50 to 48
        assertEquals(48, sampleBook.getStockQuantity());
    }

    @Test
    void testCreateOrder_OutOfStock_ThrowsException() {
        sampleBook.setStockQuantity(1);

        CreateOrderRequest req = new CreateOrderRequest();
        req.setUserId(1L);
        req.setReceiverName("Nguyen Van A");
        req.setReceiverPhone("0987654321");
        req.setShippingAddress("123 Duong ABC");
        req.setPaymentMethod("COD");

        CreateOrderRequest.OrderItemDto item = new CreateOrderRequest.OrderItemDto();
        item.setBookId(10L);
        item.setQuantity(5);
        item.setPrice(new BigDecimal("150000"));
        req.setItems(Collections.singletonList(item));

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(bookRepository.findById(10L)).thenReturn(Optional.of(sampleBook));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> orderService.createOrder(req));
        assertTrue(ex.getMessage().contains("Kho không đủ sách"));
    }

    @Test
    void testCreateOrder_StoppedBook_ThrowsException() {
        sampleBook.setStatus(BookStatus.STOPPED);

        CreateOrderRequest req = new CreateOrderRequest();
        req.setUserId(1L);
        req.setReceiverName("Nguyen Van A");
        req.setReceiverPhone("0987654321");
        req.setShippingAddress("123 Duong ABC");
        req.setPaymentMethod("COD");

        CreateOrderRequest.OrderItemDto item = new CreateOrderRequest.OrderItemDto();
        item.setBookId(10L);
        item.setQuantity(1);
        item.setPrice(new BigDecimal("150000"));
        req.setItems(Collections.singletonList(item));

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(bookRepository.findById(10L)).thenReturn(Optional.of(sampleBook));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> orderService.createOrder(req));
        assertTrue(ex.getMessage().contains("ngừng kinh doanh"));
    }

    @Test
    void testUpdateOrderStatus_Success() {
        Order existingOrder = new Order();
        existingOrder.setId(100L);
        existingOrder.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(100L)).thenReturn(Optional.of(existingOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderDto updated = orderService.updateOrderStatus(100L, "SHIPPING");

        assertNotNull(updated);
        assertEquals("SHIPPING", updated.getStatus());
        assertEquals("Chờ giao hàng", updated.getStatusLabel());
        assertEquals(3, updated.getStatusCode());
    }
}
