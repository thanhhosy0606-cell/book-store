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

    // Explicit Getters and Setters
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getFilterTitle() { return filterTitle; }
    public void setFilterTitle(String filterTitle) { this.filterTitle = filterTitle; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
    public BigDecimal getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; }
    public List<String> getLabels() { return labels; }
    public void setLabels(List<String> labels) { this.labels = labels; }
    public List<BigDecimal> getRevenues() { return revenues; }
    public void setRevenues(List<BigDecimal> revenues) { this.revenues = revenues; }
    public List<Long> getOrderCounts() { return orderCounts; }
    public void setOrderCounts(List<Long> orderCounts) { this.orderCounts = orderCounts; }
    public List<RevenueDetailItemDto> getDetails() { return details; }
    public void setDetails(List<RevenueDetailItemDto> details) { this.details = details; }

    public static RevenueAnalyticsDtoBuilder builder() {
        return new RevenueAnalyticsDtoBuilder();
    }

    public static class RevenueAnalyticsDtoBuilder {
        private String period;
        private String filterTitle;
        private BigDecimal totalRevenue;
        private Long totalOrders;
        private BigDecimal averageOrderValue;
        private List<String> labels;
        private List<BigDecimal> revenues;
        private List<Long> orderCounts;
        private List<RevenueDetailItemDto> details;

        public RevenueAnalyticsDtoBuilder period(String period) { this.period = period; return this; }
        public RevenueAnalyticsDtoBuilder filterTitle(String filterTitle) { this.filterTitle = filterTitle; return this; }
        public RevenueAnalyticsDtoBuilder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public RevenueAnalyticsDtoBuilder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public RevenueAnalyticsDtoBuilder averageOrderValue(BigDecimal averageOrderValue) { this.averageOrderValue = averageOrderValue; return this; }
        public RevenueAnalyticsDtoBuilder labels(List<String> labels) { this.labels = labels; return this; }
        public RevenueAnalyticsDtoBuilder revenues(List<BigDecimal> revenues) { this.revenues = revenues; return this; }
        public RevenueAnalyticsDtoBuilder orderCounts(List<Long> orderCounts) { this.orderCounts = orderCounts; return this; }
        public RevenueAnalyticsDtoBuilder details(List<RevenueDetailItemDto> details) { this.details = details; return this; }

        public RevenueAnalyticsDto build() {
            RevenueAnalyticsDto dto = new RevenueAnalyticsDto();
            dto.period = this.period;
            dto.filterTitle = this.filterTitle;
            dto.totalRevenue = this.totalRevenue;
            dto.totalOrders = this.totalOrders;
            dto.averageOrderValue = this.averageOrderValue;
            dto.labels = this.labels;
            dto.revenues = this.revenues;
            dto.orderCounts = this.orderCounts;
            dto.details = this.details;
            return dto;
        }
    }

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

        public String getTimeLabel() { return timeLabel; }
        public void setTimeLabel(String timeLabel) { this.timeLabel = timeLabel; }
        public Long getOrderCount() { return orderCount; }
        public void setOrderCount(Long orderCount) { this.orderCount = orderCount; }
        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }

        public static RevenueDetailItemDtoBuilder builder() {
            return new RevenueDetailItemDtoBuilder();
        }

        public static class RevenueDetailItemDtoBuilder {
            private String timeLabel;
            private Long orderCount;
            private BigDecimal revenue;
            private Double percentage;

            public RevenueDetailItemDtoBuilder timeLabel(String timeLabel) { this.timeLabel = timeLabel; return this; }
            public RevenueDetailItemDtoBuilder orderCount(Long orderCount) { this.orderCount = orderCount; return this; }
            public RevenueDetailItemDtoBuilder revenue(BigDecimal revenue) { this.revenue = revenue; return this; }
            public RevenueDetailItemDtoBuilder percentage(Double percentage) { this.percentage = percentage; return this; }

            public RevenueDetailItemDto build() {
                RevenueDetailItemDto dto = new RevenueDetailItemDto();
                dto.timeLabel = this.timeLabel;
                dto.orderCount = this.orderCount;
                dto.revenue = this.revenue;
                dto.percentage = this.percentage;
                return dto;
            }
        }
    }
}
