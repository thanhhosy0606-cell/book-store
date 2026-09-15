package com.bookmind.controller;

import com.bookmind.entity.Category;
import com.bookmind.repository.CategoryRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class CartViewController {

    private final CategoryRepository categoryRepository;

    public CartViewController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/cart")
    public String viewCart(Model model) {
        List<Category> categories = categoryRepository.findAll();
        model.addAttribute("categories", categories);
        model.addAttribute("pageTitle", "Giỏ Hàng - Nhã Nam Book Store");
        return "shop/cart";
    }

    @GetMapping("/checkout")
    public String viewCheckout(Model model) {
        List<Category> categories = categoryRepository.findAll();
        model.addAttribute("categories", categories);
        model.addAttribute("pageTitle", "Thanh Toán Đơn Hàng - Nhã Nam Book Store");
        return "shop/checkout";
    }
}
