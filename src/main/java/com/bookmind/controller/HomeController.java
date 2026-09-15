package com.bookmind.controller;

import com.bookmind.entity.Book;
import com.bookmind.entity.Category;
import com.bookmind.repository.BookRepository;
import com.bookmind.repository.CategoryRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public HomeController(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping({"/", "/home"})
    public String index(Model model) {
        List<Category> categories = categoryRepository.findAll();
        List<Book> featuredBooks = bookRepository.findTop8ByOrderByAvgRatingDesc();
        List<Book> newBooks = bookRepository.findTop8ByOrderByCreatedAtDesc();
        List<Book> allBooks = bookRepository.findAll();

        model.addAttribute("categories", categories);
        model.addAttribute("featuredBooks", featuredBooks.isEmpty() ? allBooks : featuredBooks);
        model.addAttribute("newBooks", newBooks.isEmpty() ? allBooks : newBooks);
        model.addAttribute("allBooks", allBooks);
        model.addAttribute("pageTitle", "Nhã Nam Book Store - Hiệu Sách & Trợ Lý Tư Vấn AI");

        return "shop/index";
    }
}
