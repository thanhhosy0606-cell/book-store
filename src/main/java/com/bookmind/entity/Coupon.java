package com.bookmind.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code;

    @Column(name = "title", length = 150, nullable = false)
    private String title;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "discount_type", length = 20, nullable = false)
    @Builder.Default
    private String discountType = "PERCENT"; // "PERCENT" hoặc "FIXED"

    @Column(name = "discount_value", nullable = false)
    private Double discountValue; // Giá trị % (VD: 10) hoặc số tiền cố định (VD: 20000)

    @Column(name = "min_order_amount")
    @Builder.Default
    private Double minOrderAmount = 0.0;

    @Column(name = "max_discount_amount")
    private Double maxDiscountAmount;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count")
    @Builder.Default
    private Integer usedCount = 0;

    @Column(name = "badge_text", length = 50)
    @Builder.Default
    private String badgeText = "HOT 🔥";

    @Column(name = "badge_color", length = 50)
    @Builder.Default
    private String badgeColor = "danger"; // danger, primary, success, warning, info

    @Column(name = "applicable_type", length = 30)
    @Builder.Default
    private String applicableType = "ALL"; // "ALL", "CATEGORY", "BOOK"

    @Column(name = "applicable_category_id")
    private Long applicableCategoryId;

    @Column(name = "applicable_category_name", length = 150)
    private String applicableCategoryName;

    @Column(name = "applicable_book_id")
    private Long applicableBookId;

    @Column(name = "applicable_book_title", length = 255)
    private String applicableBookTitle;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.usedCount == null) this.usedCount = 0;
        if (this.isActive == null) this.isActive = true;
        if (this.minOrderAmount == null) this.minOrderAmount = 0.0;
        if (this.discountType == null) this.discountType = "PERCENT";
        if (this.applicableType == null) this.applicableType = "ALL";
        if (this.badgeText == null) this.badgeText = "HOT 🔥";
        if (this.badgeColor == null) this.badgeColor = "danger";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDiscountType() { return discountType != null ? discountType : "PERCENT"; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public Double getMinOrderAmount() { return minOrderAmount != null ? minOrderAmount : 0.0; }
    public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public Double getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getUsedCount() { return usedCount != null ? usedCount : 0; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }

    public String getBadgeText() { return badgeText != null ? badgeText : "HOT 🔥"; }
    public void setBadgeText(String badgeText) { this.badgeText = badgeText; }

    public String getBadgeColor() { return badgeColor != null ? badgeColor : "danger"; }
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

    public Boolean getIsActive() { return isActive != null ? isActive : true; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
