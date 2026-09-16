package com.bookmind.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private String discountType;
    private Double discountValue;
    private Double minOrderAmount;
    private Double maxDiscountAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private String badgeText;
    private String badgeColor;
    private String applicableType; // "ALL", "CATEGORY", "BOOK"
    private Long applicableCategoryId;
    private String applicableCategoryName;
    private Long applicableBookId;
    private String applicableBookTitle;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public Double getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public Double getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }

    public String getBadgeText() { return badgeText; }
    public void setBadgeText(String badgeText) { this.badgeText = badgeText; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public String getApplicableType() { return applicableType != null ? applicableType : "ALL"; }
    public void setApplicableType(String applicableType) { this.applicableType = applicableType; }

    public Long getApplicableCategoryId() { return applicableCategoryId; }
    public void setApplicableCategoryId(Long applicableCategoryId) { this.applicableCategoryId = applicableCategoryId; }

    public String getApplicableCategoryName() { return applicableCategoryName; }
    public void setApplicableCategoryName(String applicableCategoryName) { this.applicableCategoryName = applicableCategoryName; }

    public Long getApplicableBookId() { return applicableBookId; }
    public void setApplicableBookId(Long applicableBookId) { this.applicableBookId = applicableBookId; }

    public String getApplicableBookTitle() { return applicableBookTitle; }
    public void setApplicableBookTitle(String applicableBookTitle) { this.applicableBookTitle = applicableBookTitle; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static CouponDtoBuilder builder() {
        return new CouponDtoBuilder();
    }

    public static class CouponDtoBuilder {
        private Long id;
        private String code;
        private String title;
        private String description;
        private String discountType;
        private Double discountValue;
        private Double minOrderAmount;
        private Double maxDiscountAmount;
        private Integer usageLimit;
        private Integer usedCount;
        private String badgeText;
        private String badgeColor;
        private String applicableType;
        private Long applicableCategoryId;
        private String applicableCategoryName;
        private Long applicableBookId;
        private String applicableBookTitle;
        private Boolean isActive;
        private LocalDateTime createdAt;

        public CouponDtoBuilder id(Long id) { this.id = id; return this; }
        public CouponDtoBuilder code(String code) { this.code = code; return this; }
        public CouponDtoBuilder title(String title) { this.title = title; return this; }
        public CouponDtoBuilder description(String description) { this.description = description; return this; }
        public CouponDtoBuilder discountType(String discountType) { this.discountType = discountType; return this; }
        public CouponDtoBuilder discountValue(Double discountValue) { this.discountValue = discountValue; return this; }
        public CouponDtoBuilder minOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; return this; }
        public CouponDtoBuilder maxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; return this; }
        public CouponDtoBuilder usageLimit(Integer usageLimit) { this.usageLimit = usageLimit; return this; }
        public CouponDtoBuilder usedCount(Integer usedCount) { this.usedCount = usedCount; return this; }
        public CouponDtoBuilder badgeText(String badgeText) { this.badgeText = badgeText; return this; }
        public CouponDtoBuilder badgeColor(String badgeColor) { this.badgeColor = badgeColor; return this; }
        public CouponDtoBuilder applicableType(String applicableType) { this.applicableType = applicableType; return this; }
        public CouponDtoBuilder applicableCategoryId(Long applicableCategoryId) { this.applicableCategoryId = applicableCategoryId; return this; }
        public CouponDtoBuilder applicableCategoryName(String applicableCategoryName) { this.applicableCategoryName = applicableCategoryName; return this; }
        public CouponDtoBuilder applicableBookId(Long applicableBookId) { this.applicableBookId = applicableBookId; return this; }
        public CouponDtoBuilder applicableBookTitle(String applicableBookTitle) { this.applicableBookTitle = applicableBookTitle; return this; }
        public CouponDtoBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public CouponDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public CouponDto build() {
            CouponDto dto = new CouponDto();
            dto.setId(this.id);
            dto.setCode(this.code);
            dto.setTitle(this.title);
            dto.setDescription(this.description);
            dto.setDiscountType(this.discountType);
            dto.setDiscountValue(this.discountValue);
            dto.setMinOrderAmount(this.minOrderAmount);
            dto.setMaxDiscountAmount(this.maxDiscountAmount);
            dto.setUsageLimit(this.usageLimit);
            dto.setUsedCount(this.usedCount);
            dto.setBadgeText(this.badgeText);
            dto.setBadgeColor(this.badgeColor);
            dto.setApplicableType(this.applicableType);
            dto.setApplicableCategoryId(this.applicableCategoryId);
            dto.setApplicableCategoryName(this.applicableCategoryName);
            dto.setApplicableBookId(this.applicableBookId);
            dto.setApplicableBookTitle(this.applicableBookTitle);
            dto.setIsActive(this.isActive);
            dto.setCreatedAt(this.createdAt);
            return dto;
        }
    }
}
