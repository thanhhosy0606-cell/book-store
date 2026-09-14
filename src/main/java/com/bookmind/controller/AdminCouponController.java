package com.bookmind.controller;

import com.bookmind.dto.CouponDto;
import com.bookmind.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/coupons")
@CrossOrigin(origins = "*")
public class AdminCouponController {

    private final CouponService couponService;

    public AdminCouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    public ResponseEntity<List<CouponDto>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping
    public ResponseEntity<?> createCoupon(@RequestBody CouponDto dto) {
        try {
            CouponDto created = couponService.createCoupon(dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Tạo mã khuyến mãi \"" + created.getCode() + "\" thành công!",
                    "data", created
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCoupon(@PathVariable Long id, @RequestBody CouponDto dto) {
        try {
            CouponDto updated = couponService.updateCoupon(id, dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Cập nhật mã khuyến mãi \"" + updated.getCode() + "\" thành công!",
                    "data", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        try {
            CouponDto toggled = couponService.toggleStatus(id);
            String statusText = Boolean.TRUE.equals(toggled.getIsActive()) ? "kích hoạt" : "tạm dừng";
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã " + statusText + " mã khuyến mãi \"" + toggled.getCode() + "\"!",
                    "data", toggled
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã xóa mã khuyến mãi #" + id + " thành công!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/batch-discount")
    public ResponseEntity<?> applyBatchDiscount(@RequestBody Map<String, Object> payload) {
        try {
            Long categoryId = null;
            if (payload.get("categoryId") != null && !payload.get("categoryId").toString().isBlank()) {
                categoryId = Long.valueOf(payload.get("categoryId").toString());
            }

            int discountPercent = 0;
            if (payload.get("discountPercent") != null) {
                discountPercent = Integer.parseInt(payload.get("discountPercent").toString());
            }

            int affected = couponService.applyBatchBookDiscount(categoryId, discountPercent);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã áp dụng mức chiết khấu giảm " + discountPercent + "% cho " + affected + " cuốn sách thành công!",
                    "affectedCount", affected
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi áp dụng giảm giá: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/reset-discount")
    public ResponseEntity<?> resetDiscount(@RequestBody Map<String, Object> payload) {
        try {
            Long categoryId = null;
            if (payload.get("categoryId") != null && !payload.get("categoryId").toString().isBlank()) {
                categoryId = Long.valueOf(payload.get("categoryId").toString());
            }

            int affected = couponService.resetBookDiscount(categoryId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã khôi phục giá gốc thành công cho " + affected + " cuốn sách!",
                    "affectedCount", affected
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi khôi phục giá: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/single-book-discount")
    public ResponseEntity<?> applySingleBookDiscount(@RequestBody Map<String, Object> payload) {
        try {
            if (payload.get("bookId") == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Thiếu ID cuốn sách!"));
            }
            Long bookId = Long.valueOf(payload.get("bookId").toString());

            Integer discountPercent = null;
            if (payload.get("discountPercent") != null && !payload.get("discountPercent").toString().isBlank()) {
                discountPercent = Integer.parseInt(payload.get("discountPercent").toString());
            }

            Double customSalePrice = null;
            if (payload.get("customSalePrice") != null && !payload.get("customSalePrice").toString().isBlank()) {
                customSalePrice = Double.parseDouble(payload.get("customSalePrice").toString());
            }

            com.bookmind.entity.Book book = couponService.applySingleBookDiscount(bookId, discountPercent, customSalePrice);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã cập nhật giảm giá cho cuốn sách \"" + book.getTitle() + "\" thành công!",
                    "bookId", book.getId(),
                    "originalPrice", book.getOriginalPrice(),
                    "salePrice", book.getSalePrice()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi giảm giá sách: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/single-book-reset")
    public ResponseEntity<?> resetSingleBookDiscount(@RequestBody Map<String, Object> payload) {
        try {
            if (payload.get("bookId") == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Thiếu ID cuốn sách!"));
            }
            Long bookId = Long.valueOf(payload.get("bookId").toString());

            com.bookmind.entity.Book book = couponService.resetSingleBookDiscount(bookId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã khôi phục giá gốc cho cuốn sách \"" + book.getTitle() + "\"!",
                    "bookId", book.getId(),
                    "originalPrice", book.getOriginalPrice(),
                    "salePrice", book.getSalePrice()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi khôi phục giá sách: " + e.getMessage()
            ));
        }
    }
}
