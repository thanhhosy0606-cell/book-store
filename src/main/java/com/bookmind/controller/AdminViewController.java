package com.bookmind.controller;

import com.bookmind.repository.BookRepository;
import com.bookmind.repository.CategoryRepository;
import com.bookmind.repository.CouponRepository;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminViewController {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    public AdminViewController(
            BookRepository bookRepository,
            CategoryRepository categoryRepository,
            OrderRepository orderRepository,
            CouponRepository couponRepository,
            UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.couponRepository = couponRepository;
        this.userRepository = userRepository;
    }

    @GetMapping({"", "/", "/dashboard"})
    public String dashboard(Model model) {
        model.addAttribute("activeTab", "dashboard");
        model.addAttribute("totalBooks", bookRepository.count());
        model.addAttribute("totalOrders", orderRepository.count());
        model.addAttribute("totalUsers", userRepository.count());
        model.addAttribute("totalCategories", categoryRepository.count());
        model.addAttribute("pageTitle", "Tổng Quan Quản Trị - Nhã Nam Book Store");
        return "admin/dashboard";
    }

    @GetMapping("/books")
    public String books(Model model) {
        model.addAttribute("activeTab", "books");
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("books", bookRepository.findAll());
        model.addAttribute("pageTitle", "Quản Lý Sách - Nhã Nam Book Store");
        return "admin/books";
    }

    @GetMapping("/categories")
    public String categories(Model model) {
        model.addAttribute("activeTab", "categories");
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("pageTitle", "Quản Lý Thể Loại - Nhã Nam Book Store");
        return "admin/categories";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        model.addAttribute("activeTab", "orders");
        model.addAttribute("orders", orderRepository.findAllByOrderByCreatedAtDesc());
        model.addAttribute("pageTitle", "Quản Lý Đơn Hàng - Nhã Nam Book Store");
        return "admin/orders";
    }

    @GetMapping("/coupons")
    public String coupons(Model model) {
        model.addAttribute("activeTab", "coupons");
        model.addAttribute("coupons", couponRepository.findAll());
        model.addAttribute("pageTitle", "Quản Lý Mã Giảm Giá - Nhã Nam Book Store");
        return "admin/coupons";
    }

    @GetMapping("/users")
    public String users(Model model) {
        model.addAttribute("activeTab", "users");
        model.addAttribute("users", userRepository.findAll());
        model.addAttribute("pageTitle", "Quản Lý Khách Hàng - Nhã Nam Book Store");
        return "admin/users";
    }
}
