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
}
