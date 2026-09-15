package com.bookmind.controller;

import com.bookmind.entity.Book;
import com.bookmind.entity.Category;
import com.bookmind.repository.BookRepository;
import com.bookmind.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

@Controller
public class ShopViewController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public ShopViewController(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/books")
    public String bookList(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Model model) {

        Sort sortOrder = switch (sort) {
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "salePrice");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "salePrice");
            case "rating" -> Sort.by(Sort.Direction.DESC, "avgRating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(Math.max(0, page), size, sortOrder);
        String cleanedKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        Page<Book> bookPage = bookRepository.filterBooks(categoryId, minPrice, maxPrice, cleanedKeyword, pageable);
        List<Category> categories = categoryRepository.findAll();

        Category selectedCategory = null;
        if (categoryId != null) {
            selectedCategory = categoryRepository.findById(categoryId).orElse(null);
        }

        model.addAttribute("bookPage", bookPage);
        model.addAttribute("books", bookPage.getContent());
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategory", selectedCategory);
        model.addAttribute("categoryId", categoryId);
        model.addAttribute("keyword", keyword);
        model.addAttribute("minPrice", minPrice);
        model.addAttribute("maxPrice", maxPrice);
        model.addAttribute("sort", sort);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", bookPage.getTotalPages());
        model.addAttribute("totalElements", bookPage.getTotalElements());
        model.addAttribute("pageTitle", selectedCategory != null ? selectedCategory.getName() + " - Nhã Nam Book Store" : "Kho Sách - Nhã Nam Book Store");

        return "shop/book-list";
    }

    @GetMapping("/books/{id}")
    public String bookDetail(@PathVariable Long id, Model model) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            return "redirect:/books";
        }

        List<Book> relatedBooks = List.of();
        if (book.getCategory() != null) {
            relatedBooks = bookRepository.findTop4ByCategoryIdAndIdNot(book.getCategory().getId(), book.getId());
        }

        List<Category> categories = categoryRepository.findAll();

        model.addAttribute("book", book);
        model.addAttribute("relatedBooks", relatedBooks);
        model.addAttribute("categories", categories);
        model.addAttribute("pageTitle", book.getTitle() + " - Nhã Nam Book Store");

        return "shop/book-detail";
    }

    @GetMapping("/categories/{slug}")
    public String categoryBySlug(@PathVariable String slug, Model model) {
        Category category = categoryRepository.findBySlug(slug).orElse(null);
        if (category != null) {
            return "redirect:/books?categoryId=" + category.getId();
        }
        return "redirect:/books";
    }
}
