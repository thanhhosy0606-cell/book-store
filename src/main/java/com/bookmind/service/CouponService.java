package com.bookmind.service;

import com.bookmind.dto.CouponDto;
import com.bookmind.entity.Book;
import com.bookmind.entity.Coupon;
import com.bookmind.repository.BookRepository;
import com.bookmind.repository.CouponRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    private static final Logger log = LoggerFactory.getLogger(CouponService.class);

    private final CouponRepository couponRepository;
    private final BookRepository bookRepository;

    public CouponService(CouponRepository couponRepository, BookRepository bookRepository) {
        this.couponRepository = couponRepository;
        this.bookRepository = bookRepository;
    }

    @PostConstruct
    @Transactional
    public void initDefaultCoupons() {
        if (couponRepository.count() == 0) {
            log.info("Khởi tạo danh sách mã khuyến mãi mặc định...");
            couponRepository.save(Coupon.builder()
                    .code("AI10")
                    .title("Giảm 10% Toàn Đơn")
                    .description("Áp dụng cho mọi giá trị đơn hàng, giảm tối đa 50.000đ")
                    .discountType("PERCENT")
                    .discountValue(10.0)
                    .minOrderAmount(0.0)
                    .maxDiscountAmount(50000.0)
                    .badgeText("HOT 🔥")
                    .badgeColor("danger")
                    .isActive(true)
                    .build());

            couponRepository.save(Coupon.builder()
                    .code("BOOK20K")
                    .title("Giảm 20.000đ")
                    .description("Áp dụng cho đơn hàng từ 200.000đ trở lên")
                    .discountType("FIXED")
                    .discountValue(20000.0)
                    .minOrderAmount(200000.0)
                    .maxDiscountAmount(20000.0)
                    .badgeText("PHỔ BIẾN ⭐")
                    .badgeColor("primary")
                    .isActive(true)
                    .build());

            couponRepository.save(Coupon.builder()
                    .code("NEWBIE")
                    .title("Giảm 15.000đ Bạn Mới")
                    .description("Áp dụng đơn hàng từ 100.000đ cho độc giả mới")
                    .discountType("FIXED")
                    .discountValue(15000.0)
                    .minOrderAmount(100000.0)
                    .maxDiscountAmount(15000.0)
                    .badgeText("QUÀ TẶNG 🎁")
                    .badgeColor("success")
                    .isActive(true)
                    .build());

            couponRepository.save(Coupon.builder()
                    .code("VIP50K")
                    .title("Giảm 50.000đ Đơn Lớn")
                    .description("Áp dụng cho đơn hàng từ 400.000đ trở lên")
                    .discountType("FIXED")
                    .discountValue(50000.0)
                    .minOrderAmount(400000.0)
                    .maxDiscountAmount(50000.0)
                    .badgeText("TIẾT KIỆM 💰")
                    .badgeColor("warning")
                    .isActive(true)
                    .build());
            log.info("Khởi tạo mã khuyến mãi mặc định thành công!");
        }
    }

    @Transactional(readOnly = true)
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAllByOrderByIdDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CouponDto> getActiveCoupons() {
        return couponRepository.findByIsActiveTrueOrderByIdDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CouponDto createCoupon(CouponDto dto) {
        String cleanCode = dto.getCode().trim().toUpperCase();
        if (couponRepository.existsByCodeIgnoreCase(cleanCode)) {
            throw new IllegalArgumentException("Mã khuyến mãi \"" + cleanCode + "\" đã tồn tại trên hệ thống!");
        }

        Coupon coupon = Coupon.builder()
                .code(cleanCode)
                .title(dto.getTitle().trim())
                .description(dto.getDescription() != null ? dto.getDescription().trim() : "")
                .discountType(dto.getDiscountType() != null ? dto.getDiscountType() : "PERCENT")
                .discountValue(dto.getDiscountValue() != null ? dto.getDiscountValue() : 0.0)
                .minOrderAmount(dto.getMinOrderAmount() != null ? dto.getMinOrderAmount() : 0.0)
                .maxDiscountAmount(dto.getMaxDiscountAmount())
                .usageLimit(dto.getUsageLimit())
                .usedCount(0)
                .badgeText(dto.getBadgeText() != null && !dto.getBadgeText().isBlank() ? dto.getBadgeText().trim() : "ƯU ĐÃI ✨")
                .badgeColor(dto.getBadgeColor() != null && !dto.getBadgeColor().isBlank() ? dto.getBadgeColor().trim() : "danger")
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        Coupon saved = couponRepository.save(coupon);
        return mapToDto(saved);
    }

    @Transactional
    public CouponDto updateCoupon(Long id, CouponDto dto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy mã khuyến mãi #" + id));

        String cleanCode = dto.getCode().trim().toUpperCase();
        if (!cleanCode.equalsIgnoreCase(coupon.getCode()) && couponRepository.existsByCodeIgnoreCase(cleanCode)) {
            throw new IllegalArgumentException("Mã khuyến mãi \"" + cleanCode + "\" đã được sử dụng bởi mã khác!");
        }

        coupon.setCode(cleanCode);
        coupon.setTitle(dto.getTitle().trim());
        coupon.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        coupon.setDiscountType(dto.getDiscountType() != null ? dto.getDiscountType() : "PERCENT");
        coupon.setDiscountValue(dto.getDiscountValue() != null ? dto.getDiscountValue() : 0.0);
        coupon.setMinOrderAmount(dto.getMinOrderAmount() != null ? dto.getMinOrderAmount() : 0.0);
        coupon.setMaxDiscountAmount(dto.getMaxDiscountAmount());
        coupon.setUsageLimit(dto.getUsageLimit());
        if (dto.getBadgeText() != null && !dto.getBadgeText().isBlank()) {
            coupon.setBadgeText(dto.getBadgeText().trim());
        }
        if (dto.getBadgeColor() != null && !dto.getBadgeColor().isBlank()) {
            coupon.setBadgeColor(dto.getBadgeColor().trim());
        }
        if (dto.getIsActive() != null) {
            coupon.setIsActive(dto.getIsActive());
        }

        Coupon saved = couponRepository.save(coupon);
        return mapToDto(saved);
    }

    @Transactional
    public CouponDto toggleStatus(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy mã khuyến mãi #" + id));

        coupon.setIsActive(!coupon.getIsActive());
        Coupon saved = couponRepository.save(coupon);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy mã khuyến mãi #" + id));
        couponRepository.delete(coupon);
    }

    /**
     * Áp dụng chiết khấu % giảm giá hàng loạt cho sách
     */
    @Transactional
    public int applyBatchBookDiscount(Long categoryId, int discountPercent) {
        if (discountPercent < 0 || discountPercent > 90) {
            throw new IllegalArgumentException("Phần trăm giảm giá phải từ 0% đến 90%!");
        }

        List<Book> books;
        if (categoryId != null && categoryId > 0) {
            books = bookRepository.findByCategoryId(categoryId);
        } else {
            books = bookRepository.findAll();
        }

        int count = 0;
        for (Book book : books) {
            java.math.BigDecimal basePrice = book.getOriginalPrice();
            if (basePrice == null || basePrice.compareTo(java.math.BigDecimal.ZERO) <= 0) {
                basePrice = book.getSalePrice();
                book.setOriginalPrice(basePrice);
            }

            if (basePrice != null && basePrice.compareTo(java.math.BigDecimal.ZERO) > 0) {
                double rawSale = Math.round(basePrice.doubleValue() * (1.0 - (discountPercent / 100.0)));
                book.setSalePrice(java.math.BigDecimal.valueOf(rawSale));
                bookRepository.save(book);
                count++;
            }
        }
        return count;
    }

    /**
     * Khôi phục giá gốc cho sách (bỏ giảm giá)
     */
    @Transactional
    public int resetBookDiscount(Long categoryId) {
        List<Book> books;
        if (categoryId != null && categoryId > 0) {
            books = bookRepository.findByCategoryId(categoryId);
        } else {
            books = bookRepository.findAll();
        }

        int count = 0;
        for (Book book : books) {
            if (book.getOriginalPrice() != null && book.getOriginalPrice().compareTo(java.math.BigDecimal.ZERO) > 0) {
                book.setSalePrice(book.getOriginalPrice());
                bookRepository.save(book);
                count++;
            }
        }
        return count;
    }

    /**
     * Áp dụng giảm giá cho một cuốn sách riêng lẻ
     */
    @Transactional
    public Book applySingleBookDiscount(Long bookId, Integer discountPercent, Double customSalePrice) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách có ID #" + bookId));

        java.math.BigDecimal basePrice = book.getOriginalPrice();
        if (basePrice == null || basePrice.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            basePrice = book.getSalePrice();
            book.setOriginalPrice(basePrice);
        }

        if (customSalePrice != null && customSalePrice > 0) {
            book.setSalePrice(java.math.BigDecimal.valueOf(Math.round(customSalePrice)));
        } else if (discountPercent != null && discountPercent >= 0 && discountPercent <= 90) {
            if (basePrice != null && basePrice.compareTo(java.math.BigDecimal.ZERO) > 0) {
                double rawSale = Math.round(basePrice.doubleValue() * (1.0 - (discountPercent / 100.0)));
                book.setSalePrice(java.math.BigDecimal.valueOf(rawSale));
            }
        } else {
            throw new IllegalArgumentException("Vui lòng cung cấp % giảm giá (1-90%) hoặc giá bán mới hợp lệ!");
        }

        return bookRepository.save(book);
    }

    /**
     * Khôi phục giá gốc cho một cuốn sách riêng lẻ
     */
    @Transactional
    public Book resetSingleBookDiscount(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách có ID #" + bookId));

        if (book.getOriginalPrice() != null && book.getOriginalPrice().compareTo(java.math.BigDecimal.ZERO) > 0) {
            book.setSalePrice(book.getOriginalPrice());
            return bookRepository.save(book);
        }
        return book;
    }

    private CouponDto mapToDto(Coupon c) {
        return CouponDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .title(c.getTitle())
                .description(c.getDescription())
                .discountType(c.getDiscountType())
                .discountValue(c.getDiscountValue())
                .minOrderAmount(c.getMinOrderAmount())
                .maxDiscountAmount(c.getMaxDiscountAmount())
                .usageLimit(c.getUsageLimit())
                .usedCount(c.getUsedCount())
                .badgeText(c.getBadgeText())
                .badgeColor(c.getBadgeColor())
                .isActive(c.getIsActive())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
