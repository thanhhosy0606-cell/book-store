package com.bookmind.controller;

import com.bookmind.dto.AdminOrderDto;
import com.bookmind.dto.AdminStatsDto;
import com.bookmind.dto.RevenueAnalyticsDto;
import com.bookmind.entity.Book;
import com.bookmind.entity.Order;
import com.bookmind.entity.Payment;
import com.bookmind.entity.enums.OrderStatus;
import com.bookmind.repository.BookRepository;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "*")
public class AdminStatsController {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public AdminStatsController(OrderRepository orderRepository,
                                BookRepository bookRepository,
                                UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<AdminStatsDto> getDashboardStats() {
        List<Order> allOrders = orderRepository.findAll();
        List<Book> allBooks = bookRepository.findAll();
        long totalCustomers = userRepository.count();

        // Calculate Revenue: Orders that are not cancelled
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pending = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count();
        long confirmed = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.CONFIRMED).count();
        long shipping = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.SHIPPING).count();
        long delivered = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED).count();
        long cancelled = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.CANCELLED).count();

        long lowStock = allBooks.stream()
                .filter(b -> b.getStockQuantity() != null && b.getStockQuantity() <= 10)
                .count();

        // Recent 5 orders
        List<AdminOrderDto> recentOrders = allOrders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .map(this::toOrderDto)
                .collect(Collectors.toList());

        // Category Book counts
        Map<String, Long> categoryCounts = new HashMap<>();
        for (Book b : allBooks) {
            String catName = b.getCategory() != null ? b.getCategory().getName() : "Khác";
            categoryCounts.put(catName, categoryCounts.getOrDefault(catName, 0L) + 1);
        }

        AdminStatsDto stats = AdminStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders((long) allOrders.size())
                .pendingOrders(pending)
                .confirmedOrders(confirmed)
                .shippingOrders(shipping)
                .deliveredOrders(delivered)
                .cancelledOrders(cancelled)
                .totalBooks((long) allBooks.size())
                .lowStockBooks(lowStock)
                .totalCustomers(totalCustomers)
                .recentOrders(recentOrders)
                .categoryBookCounts(categoryCounts)
                .build();

        return ResponseEntity.ok(stats);
    }

    private AdminOrderDto toOrderDto(Order order) {
        String paymentMethod = "COD";
        String paymentStatus = "CHƯA THANH TOÁN";

        if (order.getPayments() != null && !order.getPayments().isEmpty()) {
            Payment p = order.getPayments().get(0);
            paymentMethod = p.getPaymentMethod() != null ? p.getPaymentMethod().name() : "COD";
            paymentStatus = p.getPaymentStatus() != null ? p.getPaymentStatus().name() : "PENDING";
        }

        return AdminOrderDto.builder()
                .id(order.getId())
                .trackingNumber(order.getTrackingNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(paymentMethod)
                .paymentStatus(paymentStatus)
                .createdAt(order.getCreatedAt())
                .build();
    }

    @GetMapping("/revenue-analytics")
    @Transactional(readOnly = true)
    public ResponseEntity<RevenueAnalyticsDto> getRevenueAnalytics(
            @RequestParam(defaultValue = "DAY") String period,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "30") Integer days
    ) {
        LocalDate today = LocalDate.now();
        int targetYear = (year != null && year > 2000) ? year : today.getYear();
        String periodUpper = period.toUpperCase();

        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED && o.getCreatedAt() != null)
                .collect(Collectors.toList());

        List<String> labels = new ArrayList<>();
        List<BigDecimal> revenues = new ArrayList<>();
        List<Long> orderCounts = new ArrayList<>();
        List<RevenueAnalyticsDto.RevenueDetailItemDto> details = new ArrayList<>();

        String filterTitle = "";
        BigDecimal totalRevenue = BigDecimal.ZERO;
        long totalOrders = 0;

        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("dd/MM");

        if ("MONTH".equals(periodUpper)) {
            filterTitle = "Năm " + targetYear + " (12 Tháng)";
            for (int m = 1; m <= 12; m++) {
                final int currentMonth = m;
                String label = "Tháng " + (m < 10 ? "0" + m : m);
                labels.add(label);

                List<Order> monthOrders = validOrders.stream()
                        .filter(o -> o.getCreatedAt().getYear() == targetYear && o.getCreatedAt().getMonthValue() == currentMonth)
                        .collect(Collectors.toList());

                BigDecimal monthRev = monthOrders.stream()
                        .map(Order::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                revenues.add(monthRev);
                orderCounts.add((long) monthOrders.size());
                totalRevenue = totalRevenue.add(monthRev);
                totalOrders += monthOrders.size();
            }
        } else if ("YEAR".equals(periodUpper)) {
            filterTitle = "Toàn Bộ Các Năm";
            int minYear = validOrders.stream()
                    .mapToInt(o -> o.getCreatedAt().getYear())
                    .min()
                    .orElse(today.getYear() - 3);
            int maxYear = Math.max(today.getYear(), validOrders.stream()
                    .mapToInt(o -> o.getCreatedAt().getYear())
                    .max()
                    .orElse(today.getYear()));

            if (maxYear - minYear < 3) {
                minYear = maxYear - 3;
            }

            for (int y = minYear; y <= maxYear; y++) {
                final int currentYear = y;
                String label = "Năm " + currentYear;
                labels.add(label);

                List<Order> yearOrders = validOrders.stream()
                        .filter(o -> o.getCreatedAt().getYear() == currentYear)
                        .collect(Collectors.toList());

                BigDecimal yearRev = yearOrders.stream()
                        .map(Order::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                revenues.add(yearRev);
                orderCounts.add((long) yearOrders.size());
                totalRevenue = totalRevenue.add(yearRev);
                totalOrders += yearOrders.size();
            }
        } else {
            // Default "DAY"
            int numDays = (days != null && days > 0) ? Math.min(days, 90) : 30;
            filterTitle = numDays + " Ngày Gần Nhất";

            LocalDate startDate = today.minusDays(numDays - 1);
            for (int i = 0; i < numDays; i++) {
                LocalDate date = startDate.plusDays(i);
                String label = date.format(dayFormatter);
                labels.add(label);

                List<Order> dayOrders = validOrders.stream()
                        .filter(o -> o.getCreatedAt().toLocalDate().isEqual(date))
                        .collect(Collectors.toList());

                BigDecimal dayRev = dayOrders.stream()
                        .map(Order::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                revenues.add(dayRev);
                orderCounts.add((long) dayOrders.size());
                totalRevenue = totalRevenue.add(dayRev);
                totalOrders += dayOrders.size();
            }
        }

        BigDecimal aov = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        for (int i = 0; i < labels.size(); i++) {
            BigDecimal rev = revenues.get(i);
            double pct = totalRevenue.compareTo(BigDecimal.ZERO) > 0
                    ? rev.multiply(BigDecimal.valueOf(100)).divide(totalRevenue, 2, RoundingMode.HALF_UP).doubleValue()
                    : 0.0;

            details.add(RevenueAnalyticsDto.RevenueDetailItemDto.builder()
                    .timeLabel(labels.get(i))
                    .orderCount(orderCounts.get(i))
                    .revenue(rev)
                    .percentage(pct)
                    .build());
        }

        RevenueAnalyticsDto result = RevenueAnalyticsDto.builder()
                .period(periodUpper)
                .filterTitle(filterTitle)
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .averageOrderValue(aov)
                .labels(labels)
                .revenues(revenues)
                .orderCounts(orderCounts)
                .details(details)
                .build();

        return ResponseEntity.ok(result);
    }
}
