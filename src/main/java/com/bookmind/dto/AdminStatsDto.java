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

    // Explicit Getters and Setters
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
    public Long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }
    public Long getConfirmedOrders() { return confirmedOrders; }
    public void setConfirmedOrders(Long confirmedOrders) { this.confirmedOrders = confirmedOrders; }
    public Long getShippingOrders() { return shippingOrders; }
    public void setShippingOrders(Long shippingOrders) { this.shippingOrders = shippingOrders; }
    public Long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(Long deliveredOrders) { this.deliveredOrders = deliveredOrders; }
    public Long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(Long cancelledOrders) { this.cancelledOrders = cancelledOrders; }
    public Long getTotalBooks() { return totalBooks; }
    public void setTotalBooks(Long totalBooks) { this.totalBooks = totalBooks; }
    public Long getLowStockBooks() { return lowStockBooks; }
    public void setLowStockBooks(Long lowStockBooks) { this.lowStockBooks = lowStockBooks; }
    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }
    public List<AdminOrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<AdminOrderDto> recentOrders) { this.recentOrders = recentOrders; }
    public Map<String, Long> getCategoryBookCounts() { return categoryBookCounts; }
    public void setCategoryBookCounts(Map<String, Long> categoryBookCounts) { this.categoryBookCounts = categoryBookCounts; }

    public static AdminStatsDtoBuilder builder() {
        return new AdminStatsDtoBuilder();
    }

    public static class AdminStatsDtoBuilder {
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

        public AdminStatsDtoBuilder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public AdminStatsDtoBuilder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public AdminStatsDtoBuilder pendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; return this; }
        public AdminStatsDtoBuilder confirmedOrders(Long confirmedOrders) { this.confirmedOrders = confirmedOrders; return this; }
        public AdminStatsDtoBuilder shippingOrders(Long shippingOrders) { this.shippingOrders = shippingOrders; return this; }
        public AdminStatsDtoBuilder deliveredOrders(Long deliveredOrders) { this.deliveredOrders = deliveredOrders; return this; }
        public AdminStatsDtoBuilder cancelledOrders(Long cancelledOrders) { this.cancelledOrders = cancelledOrders; return this; }
        public AdminStatsDtoBuilder totalBooks(Long totalBooks) { this.totalBooks = totalBooks; return this; }
        public AdminStatsDtoBuilder lowStockBooks(Long lowStockBooks) { this.lowStockBooks = lowStockBooks; return this; }
        public AdminStatsDtoBuilder totalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; return this; }
        public AdminStatsDtoBuilder recentOrders(List<AdminOrderDto> recentOrders) { this.recentOrders = recentOrders; return this; }
        public AdminStatsDtoBuilder categoryBookCounts(Map<String, Long> categoryBookCounts) { this.categoryBookCounts = categoryBookCounts; return this; }

        public AdminStatsDto build() {
            AdminStatsDto dto = new AdminStatsDto();
            dto.totalRevenue = this.totalRevenue;
            dto.totalOrders = this.totalOrders;
            dto.pendingOrders = this.pendingOrders;
            dto.confirmedOrders = this.confirmedOrders;
            dto.shippingOrders = this.shippingOrders;
            dto.deliveredOrders = this.deliveredOrders;
            dto.cancelledOrders = this.cancelledOrders;
            dto.totalBooks = this.totalBooks;
            dto.lowStockBooks = this.lowStockBooks;
            dto.totalCustomers = this.totalCustomers;
            dto.recentOrders = this.recentOrders;
            dto.categoryBookCounts = this.categoryBookCounts;
            return dto;
        }
    }
}
