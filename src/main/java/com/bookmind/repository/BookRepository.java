package com.bookmind.repository;

import com.bookmind.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findBySlug(String slug);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByCategoryId(Long categoryId);
    List<Book> findTop8ByOrderByAvgRatingDesc();
    List<Book> findTop8ByOrderByCreatedAtDesc();
    List<Book> findTop4ByCategoryIdAndIdNot(Long categoryId, Long id);

    @Query("SELECT b FROM Book b WHERE " +
           "(:categoryId IS NULL OR b.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR b.salePrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR b.salePrice <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Book> filterBooks(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}

