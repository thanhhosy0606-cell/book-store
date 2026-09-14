package com.bookmind.dto;

import com.bookmind.entity.enums.BookStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminBookDto {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private String isbn;
    private String title;
    private String slug;
    private String author;
    private String publisher;
    private Integer publicationYear;
    private Integer pages;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private BigDecimal avgRating;
    private BookStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Explicit Getters and Setters to satisfy IDE Language Server when Lombok is disabled/bypassed
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }

    public Integer getPages() { return pages; }
    public void setPages(Integer pages) { this.pages = pages; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public BigDecimal getAvgRating() { return avgRating; }
    public void setAvgRating(BigDecimal avgRating) { this.avgRating = avgRating; }

    public BookStatus getStatus() { return status; }
    public void setStatus(BookStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static AdminBookDtoBuilder builder() {
        return new AdminBookDtoBuilder();
    }

    public static class AdminBookDtoBuilder {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String categorySlug;
        private String isbn;
        private String title;
        private String slug;
        private String author;
        private String publisher;
        private Integer publicationYear;
        private Integer pages;
        private String description;
        private BigDecimal originalPrice;
        private BigDecimal salePrice;
        private Integer stockQuantity;
        private BigDecimal avgRating;
        private BookStatus status;
        private String imageUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public AdminBookDtoBuilder id(Long id) { this.id = id; return this; }
        public AdminBookDtoBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public AdminBookDtoBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public AdminBookDtoBuilder categorySlug(String categorySlug) { this.categorySlug = categorySlug; return this; }
        public AdminBookDtoBuilder isbn(String isbn) { this.isbn = isbn; return this; }
        public AdminBookDtoBuilder title(String title) { this.title = title; return this; }
        public AdminBookDtoBuilder slug(String slug) { this.slug = slug; return this; }
        public AdminBookDtoBuilder author(String author) { this.author = author; return this; }
        public AdminBookDtoBuilder publisher(String publisher) { this.publisher = publisher; return this; }
        public AdminBookDtoBuilder publicationYear(Integer publicationYear) { this.publicationYear = publicationYear; return this; }
        public AdminBookDtoBuilder pages(Integer pages) { this.pages = pages; return this; }
        public AdminBookDtoBuilder description(String description) { this.description = description; return this; }
        public AdminBookDtoBuilder originalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; return this; }
        public AdminBookDtoBuilder salePrice(BigDecimal salePrice) { this.salePrice = salePrice; return this; }
        public AdminBookDtoBuilder stockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; return this; }
        public AdminBookDtoBuilder avgRating(BigDecimal avgRating) { this.avgRating = avgRating; return this; }
        public AdminBookDtoBuilder status(BookStatus status) { this.status = status; return this; }
        public AdminBookDtoBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public AdminBookDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AdminBookDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public AdminBookDto build() {
            AdminBookDto dto = new AdminBookDto();
            dto.id = this.id;
            dto.categoryId = this.categoryId;
            dto.categoryName = this.categoryName;
            dto.categorySlug = this.categorySlug;
            dto.isbn = this.isbn;
            dto.title = this.title;
            dto.slug = this.slug;
            dto.author = this.author;
            dto.publisher = this.publisher;
            dto.publicationYear = this.publicationYear;
            dto.pages = this.pages;
            dto.description = this.description;
            dto.originalPrice = this.originalPrice;
            dto.salePrice = this.salePrice;
            dto.stockQuantity = this.stockQuantity;
            dto.avgRating = this.avgRating;
            dto.status = this.status;
            dto.imageUrl = this.imageUrl;
            dto.createdAt = this.createdAt;
            dto.updatedAt = this.updatedAt;
            return dto;
        }
    }
}
