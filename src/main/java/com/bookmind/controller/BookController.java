package com.bookmind.controller;

import com.bookmind.dto.AdminBookDto;
import com.bookmind.entity.Book;
import com.bookmind.entity.BookImage;
import com.bookmind.entity.enums.BookStatus;
import com.bookmind.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private static final Logger log = LoggerFactory.getLogger(BookController.class);

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminBookDto>> getStorefrontBooks(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BookStatus status) {

        List<Book> books = bookRepository.findAll();

        if (categoryId != null) {
            books = books.stream()
                    .filter(b -> b.getCategory() != null && b.getCategory().getId().equals(categoryId))
                    .collect(Collectors.toList());
        }

        if (status != null) {
            books = books.stream()
                    .filter(b -> (b.getStatus() != null ? b.getStatus() : BookStatus.AVAILABLE) == status)
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            books = books.stream()
                    .filter(b -> (b.getTitle() != null && b.getTitle().toLowerCase().contains(q)) ||
                                 (b.getAuthor() != null && b.getAuthor().toLowerCase().contains(q)) ||
                                 (b.getIsbn() != null && b.getIsbn().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        List<AdminBookDto> dtos = books.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminBookDto> getBookDetail(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(b -> ResponseEntity.ok(toDto(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    private AdminBookDto toDto(Book book) {
        String thumb = "";
        if (book.getImages() != null && !book.getImages().isEmpty()) {
            thumb = book.getImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsThumbnail()))
                    .map(BookImage::getImageUrl)
                    .findFirst()
                    .orElse(book.getImages().get(0).getImageUrl());
        }

        return AdminBookDto.builder()
                .id(book.getId())
                .categoryId(book.getCategory() != null ? book.getCategory().getId() : null)
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : "Chưa phân loại")
                .categorySlug(book.getCategory() != null ? book.getCategory().getSlug() : "")
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .slug(book.getSlug())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .publicationYear(book.getPublicationYear())
                .pages(book.getPages())
                .description(book.getDescription())
                .originalPrice(book.getOriginalPrice())
                .salePrice(book.getSalePrice())
                .stockQuantity(book.getStockQuantity())
                .avgRating(book.getAvgRating())
                .status(book.getStatus() != null ? book.getStatus() : BookStatus.AVAILABLE)
                .imageUrl(thumb)
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
