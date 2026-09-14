package com.bookmind.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueAnalyticsDto {
    private String period; // "DAY", "MONTH", "YEAR"
    private String filterTitle; // e.g. "30 Ngày Gần Nhất", "Năm 2026", "Tất Cả Các Năm"
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private BigDecimal averageOrderValue;
    private List<String> labels;
    private List<BigDecimal> revenues;
    private List<Long> orderCounts;
    private List<RevenueDetailItemDto> details;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueDetailItemDto {
        private String timeLabel;
        private Long orderCount;
        private BigDecimal revenue;
        private Double percentage;
    }
}
