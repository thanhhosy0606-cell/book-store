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

    private Coupon createCouponEntity(String code, String title, String description,
                                     String discountType, Double discountValue,
                                     Double minOrderAmount, Double maxDiscountAmount,
                                     Integer usageLimit, String badgeText,
                                     String badgeColor, Boolean isActive) {
        Coupon c = new Coupon();
        c.setCode(code);
        c.setTitle(title);
        c.setDescription(description != null ? description : "");
        c.setDiscountType(discountType != null ? discountType : "PERCENT");
        c.setDiscountValue(discountValue != null ? discountValue : Double.valueOf(0.0));
        c.setMinOrderAmount(minOrderAmount != null ? minOrderAmount : Double.valueOf(0.0));
        c.setMaxDiscountAmount(maxDiscountAmount);
        c.setUsageLimit(usageLimit);
        c.setUsedCount(0);
        c.setBadgeText(badgeText != null && !badgeText.isBlank() ? badgeText : "ƯU ĐÃI ✨");
        c.setBadgeColor(badgeColor != null && !badgeColor.isBlank() ? badgeColor : "danger");
        c.setIsActive(isActive != null ? isActive : Boolean.TRUE);
        return c;
    }

    @PostConstruct
    @Transactional
    public void initDefaultCoupons() {
        if (couponRepository.count() == 0) {
            log.info("Khởi tạo danh sách mã khuyến mãi mặc định...");
            couponRepository.save(createCouponEntity(
                    "AI10",
                    "Giảm 10% Toàn Đơn",
                    "Áp dụng cho mọi giá trị đơn hàng, giảm tối đa 50.000đ",
                    "PERCENT",
                    Double.valueOf(10.0),
                    Double.valueOf(0.0),
                    Double.valueOf(50000.0),
                    null,
                    "HOT 🔥",
                    "danger",
                    Boolean.TRUE));

            couponRepository.save(createCouponEntity(
                    "BOOK20K",
                    "Giảm 20.000đ",
                    "Áp dụng cho đơn hàng từ 200.000đ trở lên",
                    "FIXED",
                    Double.valueOf(20000.0),
                    Double.valueOf(200000.0),
                    Double.valueOf(20000.0),
                    null,
                    "PHỔ BIẾN ⭐",
                    "primary",
                    Boolean.TRUE));

            couponRepository.save(createCouponEntity(
                    "NEWBIE",
                    "Giảm 15.000đ Bạn Mới",
                    "Áp dụng đơn hàng từ 100.000đ cho độc giả mới",
                    "FIXED",
                    Double.valueOf(15000.0),
                    Double.valueOf(100000.0),
                    Double.valueOf(15000.0),
                    null,
                    "QUÀ TẶNG 🎁",
                    "success",
                    Boolean.TRUE));

            couponRepository.save(createCouponEntity(
                    "VIP50K",
                    "Giảm 50.000đ Đơn Lớn",
                    "Áp dụng cho đơn hàng từ 400.000đ trở lên",
                    "FIXED",
                    Double.valueOf(50000.0),
                    Double.valueOf(400000.0),
                    Double.valueOf(50000.0),
                    null,
                    "TIẾT KIỆM 💰",
                    "warning",
                    Boolean.TRUE));
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

        Coupon coupon = createCouponEntity(
                cleanCode,
                dto.getTitle().trim(),
                dto.getDescription() != null ? dto.getDescription().trim() : "",
                dto.getDiscountType() != null ? dto.getDiscountType() : "PERCENT",
                dto.getDiscountValue() != null ? dto.getDiscountValue() : Double.valueOf(0.0),
                dto.getMinOrderAmount() != null ? dto.getMinOrderAmount() : Double.valueOf(0.0),
                dto.getMaxDiscountAmount(),
                dto.getUsageLimit(),
                dto.getBadgeText() != null && !dto.getBadgeText().isBlank() ? dto.getBadgeText().trim() : "ƯU ĐÃI ✨",
                dto.getBadgeColor() != null && !dto.getBadgeColor().isBlank() ? dto.getBadgeColor().trim() : "danger",
                dto.getIsActive() != null ? dto.getIsActive() : Boolean.TRUE
        );

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
        coupon.setDiscountValue(dto.getDiscountValue() != null ? dto.getDiscountValue() : Double.valueOf(0.0));
        coupon.setMinOrderAmount(dto.getMinOrderAmount() != null ? dto.getMinOrderAmount() : Double.valueOf(0.0));
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

        coupon.setIsActive(!Boolean.TRUE.equals(coupon.getIsActive()));
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
        CouponDto dto = new CouponDto();
        dto.setId(c.getId());
        dto.setCode(c.getCode());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setDiscountType(c.getDiscountType());
        dto.setDiscountValue(c.getDiscountValue());
        dto.setMinOrderAmount(c.getMinOrderAmount());
        dto.setMaxDiscountAmount(c.getMaxDiscountAmount());
        dto.setUsageLimit(c.getUsageLimit());
        dto.setUsedCount(c.getUsedCount());
        dto.setBadgeText(c.getBadgeText());
        dto.setBadgeColor(c.getBadgeColor());
        dto.setIsActive(c.getIsActive());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }
}
