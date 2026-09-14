package com.bookmind.controller;

import com.bookmind.dto.AdminBookDto;
import com.bookmind.entity.Book;
import com.bookmind.entity.BookImage;
import com.bookmind.entity.Category;
import com.bookmind.entity.enums.BookStatus;
import com.bookmind.repository.BookImageRepository;
import com.bookmind.repository.BookRepository;
import com.bookmind.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/books")
@CrossOrigin(origins = "*")
public class AdminBookController {

    private static final Logger log = LoggerFactory.getLogger(AdminBookController.class);

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookImageRepository bookImageRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public AdminBookController(BookRepository bookRepository,
                               CategoryRepository categoryRepository,
                               BookImageRepository bookImageRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.bookImageRepository = bookImageRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminBookDto>> getAllBooks(
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
    public ResponseEntity<AdminBookDto> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(b -> ResponseEntity.ok(toDto(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createBook(@RequestBody AdminBookDto dto) {
        try {
            if (dto.getTitle() == null || dto.getTitle().isBlank()) {
                return ResponseEntity.badRequest().body("Tiêu đề sách không được để trống!");
            }
            if (dto.getSalePrice() == null) {
                return ResponseEntity.badRequest().body("Giá bán không được để trống!");
            }

            Category category = null;
            if (dto.getCategoryId() != null) {
                category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            }

            String slug = generateSlug(dto.getTitle());
            // Ensure unique slug
            String baseSlug = slug;
            int counter = 1;
            while (bookRepository.findBySlug(slug).isPresent()) {
                slug = baseSlug + "-" + counter++;
            }

            Book book = new Book();
            book.setTitle(dto.getTitle().trim());
            book.setSlug(slug);
            book.setAuthor(dto.getAuthor() != null ? dto.getAuthor().trim() : "");
            book.setPublisher(dto.getPublisher() != null ? dto.getPublisher().trim() : "");
            book.setPublicationYear(dto.getPublicationYear());
            book.setPages(dto.getPages());
            book.setIsbn(dto.getIsbn() != null && !dto.getIsbn().isBlank() ? dto.getIsbn().trim() : null);
            book.setCategory(category);
            book.setDescription(dto.getDescription());
            book.setOriginalPrice(dto.getOriginalPrice() != null ? dto.getOriginalPrice() : dto.getSalePrice());
            book.setSalePrice(dto.getSalePrice());
            book.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : Integer.valueOf(0));
            book.setAvgRating(BigDecimal.valueOf(5.0));
            book.setStatus(dto.getStatus() != null ? dto.getStatus() : BookStatus.AVAILABLE);

            Book savedBook = bookRepository.save(book);

            if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
                BookImage img = new BookImage();
                img.setBook(savedBook);
                img.setImageUrl(dto.getImageUrl().trim());
                img.setIsThumbnail(true);
                bookImageRepository.save(img);
            }

            log.info("Admin created new book #{}: {}", savedBook.getId(), savedBook.getTitle());
            return ResponseEntity.ok(toDto(savedBook));

        } catch (Exception e) {
            log.error("Failed to create book: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Lỗi tạo sách: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody AdminBookDto dto) {
        try {
            Book book = bookRepository.findById(id)
                    .orElse(null);
            if (book == null) {
                return ResponseEntity.notFound().build();
            }

            if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
                book.setTitle(dto.getTitle().trim());
            }
            if (dto.getAuthor() != null) {
                book.setAuthor(dto.getAuthor().trim());
            }
            if (dto.getPublisher() != null) {
                book.setPublisher(dto.getPublisher().trim());
            }
            if (dto.getPublicationYear() != null) {
                book.setPublicationYear(dto.getPublicationYear());
            }
            if (dto.getPages() != null) {
                book.setPages(dto.getPages());
            }
            if (dto.getIsbn() != null) {
                book.setIsbn(dto.getIsbn().trim());
            }
            if (dto.getDescription() != null) {
                book.setDescription(dto.getDescription());
            }
            if (dto.getOriginalPrice() != null) {
                book.setOriginalPrice(dto.getOriginalPrice());
            }
            if (dto.getSalePrice() != null) {
                book.setSalePrice(dto.getSalePrice());
            }
            if (dto.getStockQuantity() != null) {
                book.setStockQuantity(dto.getStockQuantity());
            }
            if (dto.getStatus() != null) {
                book.setStatus(dto.getStatus());
            }

            if (dto.getCategoryId() != null) {
                categoryRepository.findById(dto.getCategoryId()).ifPresent(book::setCategory);
            }

            // Update or add thumbnail image
            if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
                List<BookImage> images = bookImageRepository.findByBookId(book.getId());
                if (!images.isEmpty()) {
                    BookImage thumb = images.stream().filter(BookImage::getIsThumbnail).findFirst().orElse(images.get(0));
                    thumb.setImageUrl(dto.getImageUrl().trim());
                    bookImageRepository.save(thumb);
                } else {
                    BookImage img = new BookImage();
                    img.setBook(book);
                    img.setImageUrl(dto.getImageUrl().trim());
                    img.setIsThumbnail(true);
                    bookImageRepository.save(img);
                }
            }

            Book updated = bookRepository.save(book);
            log.info("Admin updated book #{}: {}", updated.getId(), updated.getTitle());
            return ResponseEntity.ok(toDto(updated));

        } catch (Exception e) {
            log.error("Failed to update book: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Lỗi cập nhật sách: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            Book book = bookRepository.findById(id).orElse(null);
            if (book == null) {
                return ResponseEntity.notFound().build();
            }

            // Kiểm tra xem sách đã có đơn hàng chưa
            try {
                Number orderCount = (Number) entityManager.createNativeQuery(
                        "SELECT COUNT(*) FROM order_details WHERE book_id = :bookId")
                        .setParameter("bookId", id)
                        .getSingleResult();

                if (orderCount != null && orderCount.longValue() > 0) {
                    book.setStatus(BookStatus.STOPPED);
                    bookRepository.save(book);
                    log.info("Book #{} has {} order details. Switched to STOPPED instead of hard delete.", id, orderCount);
                    return ResponseEntity.ok(java.util.Map.of(
                            "success", true,
                            "warning", true,
                            "message", "Cuốn sách \"" + book.getTitle() + "\" đã có trong lịch sử đơn hàng của khách hàng. Để bảo đảm dữ liệu đơn hàng và doanh thu, hệ thống đã chuyển trạng thái sang 'Ngưng kinh doanh' thay vì xóa vật lý."
                    ));
                }
            } catch (Exception e) {
                log.warn("Could not check order_details count: {}", e.getMessage());
            }

            // Xóa các liên kết trong cart_items
            try {
                entityManager.createNativeQuery("DELETE FROM cart_items WHERE book_id = :bookId")
                        .setParameter("bookId", id)
                        .executeUpdate();
            } catch (Exception ignored) {}

            // Xóa các đánh giá (reviews)
            try {
                entityManager.createNativeQuery("DELETE FROM reviews WHERE book_id = :bookId")
                        .setParameter("bookId", id)
                        .executeUpdate();
            } catch (Exception ignored) {}

            // Xóa chi tiết phiếu nhập (nếu có)
            try {
                entityManager.createNativeQuery("DELETE FROM inventory_receipt_details WHERE book_id = :bookId")
                        .setParameter("bookId", id)
                        .executeUpdate();
            } catch (Exception ignored) {}

            String title = book.getTitle();
            bookRepository.delete(book);
            log.info("Admin permanently deleted book #{}: {}", id, title);

            return ResponseEntity.ok(java.util.Map.of(
                    "success", true,
                    "message", "Đã xóa hoàn toàn cuốn sách: " + title
            ));
        } catch (Exception e) {
            log.error("Error deleting book #{}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(java.util.Map.of("success", false, "message", "Lỗi xóa sách: " + e.getMessage()));
        }
    }

    @RequestMapping(value = "/{id}/toggle-status", method = {RequestMethod.POST, RequestMethod.PATCH})
    @Transactional
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        try {
            return bookRepository.findById(id)
                    .map(b -> {
                        BookStatus currentStatus = b.getStatus() != null ? b.getStatus() : BookStatus.AVAILABLE;
                        BookStatus newStatus = (currentStatus == BookStatus.STOPPED) ? BookStatus.AVAILABLE : BookStatus.STOPPED;
                        b.setStatus(newStatus);
                        bookRepository.save(b);
                        log.info("Admin toggled book #{} status to {}", id, newStatus);
                        return ResponseEntity.ok(java.util.Map.of(
                                "success", true,
                                "message", (newStatus == BookStatus.STOPPED ? "Đã ngưng kinh doanh sách #" : "Đã mở bán lại sách #") + id,
                                "status", newStatus.name()
                        ));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("success", false, "message", "Lỗi: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> updateBookStatus(@PathVariable Long id, @RequestParam BookStatus status) {
        try {
            return bookRepository.findById(id)
                    .map(b -> {
                        b.setStatus(status);
                        bookRepository.save(b);
                        log.info("Admin changed book #{} status to {}", id, status);
                        return ResponseEntity.ok(toDto(b));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("success", false, "message", "Lỗi: " + e.getMessage()));
        }
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

    private String generateSlug(String input) {
        if (input == null) return "";
        String str = input.toLowerCase(Locale.ENGLISH).trim();
        str = str.replace("đ", "d").replace("Đ", "d");
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        String noAccents = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("");
        String slug = Pattern.compile("[^a-z0-9\\s-]").matcher(noAccents).replaceAll("");
        slug = Pattern.compile("[\\s]+").matcher(slug).replaceAll("-");
        slug = Pattern.compile("-+").matcher(slug).replaceAll("-");
        return slug.replaceAll("^-|-$", "");
    }
}
