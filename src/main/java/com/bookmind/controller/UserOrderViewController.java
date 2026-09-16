package com.bookmind.controller;

import com.bookmind.entity.Category;
import com.bookmind.entity.Order;
import com.bookmind.repository.CategoryRepository;
import com.bookmind.repository.OrderRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class UserOrderViewController {

    private final OrderRepository orderRepository;
    private final com.bookmind.service.OrderService orderService;
    private final CategoryRepository categoryRepository;

    public UserOrderViewController(OrderRepository orderRepository,
                                   com.bookmind.service.OrderService orderService,
                                   CategoryRepository categoryRepository) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/orders/{orderCode}")
    public String orderDetail(@PathVariable String orderCode, Model model) {
        com.bookmind.dto.OrderDto orderDto = null;
        if (orderCode != null && !orderCode.trim().isEmpty()) {
            String trimmedCode = orderCode.trim();
            try {
                orderDto = orderService.getOrderByTrackingNumber(trimmedCode);
            } catch (Exception e) {
                try {
                    Long numericId = Long.parseLong(trimmedCode);
                    Order o = orderRepository.findById(numericId).orElse(null);
                    if (o != null) {
                        orderDto = orderService.getOrderByTrackingNumber(o.getTrackingNumber());
                    }
                } catch (Exception ignored) { }
            }
        }

        List<Category> categories = categoryRepository.findAll();

        model.addAttribute("order", orderDto);
        model.addAttribute("categories", categories);
        model.addAttribute("pageTitle", (orderDto != null ? "Đơn hàng #" + orderDto.getTrackingNumber() : "Chi tiết đơn hàng") + " - Nhã Nam Book Store");

        return "shop/order-detail";
    }

    @GetMapping("/payment-result")
    public String paymentResult(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String id,
            @RequestParam(required = false) Boolean cancel,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long orderCode,
            Model model) {

        List<Category> categories = categoryRepository.findAll();
        model.addAttribute("categories", categories);
        model.addAttribute("code", code);
        model.addAttribute("id", id);
        model.addAttribute("cancel", cancel);
        model.addAttribute("status", status);
        model.addAttribute("orderCode", orderCode);
        model.addAttribute("pageTitle", "Kết quả thanh toán - Nhã Nam Book Store");

        return "shop/payment-result";
    }

    @GetMapping("/my-orders")
    public String myOrders(Model model) {
        List<Category> categories = categoryRepository.findAll();
        model.addAttribute("categories", categories);
        model.addAttribute("pageTitle", "Lịch Sử Đơn Hàng - Nhã Nam Book Store");
        return "shop/my-orders";
    }
}
