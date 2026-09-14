package com.bookmind.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDto {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long pendingOrders;
    private Long confirmedOrders;
    private Long shippingOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Long totalBooks;
    private Long lowStockBooks;
    private Long totalCustomers;
    private List<AdminOrderDto> recentOrders;
    private Map<String, Long> categoryBookCounts;
}
