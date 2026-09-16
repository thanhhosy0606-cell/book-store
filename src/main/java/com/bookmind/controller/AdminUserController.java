package com.bookmind.controller;

import com.bookmind.dto.AdminUserDto;
import com.bookmind.entity.Cart;
import com.bookmind.entity.Role;
import com.bookmind.entity.User;
import com.bookmind.entity.enums.UserStatus;
import com.bookmind.repository.CartRepository;
import com.bookmind.repository.OrderRepository;
import com.bookmind.repository.RoleRepository;
import com.bookmind.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private static final Logger log = LoggerFactory.getLogger(AdminUserController.class);
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    public AdminUserController(UserRepository userRepository,
                               RoleRepository roleRepository,
                               CartRepository cartRepository,
                               OrderRepository orderRepository,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<AdminUserDto> dtos = users.stream().map(u -> {
            Set<String> roles = u.getRoles() != null
                    ? u.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                    : Collections.emptySet();

            long totalOrders = orderRepository.countByUserId(u.getId());

            return AdminUserDto.builder()
                    .id(u.getId())
                    .email(u.getEmail())
                    .fullName(u.getFullName())
                    .phone(u.getPhone())
                    .avatarUrl(u.getAvatarUrl())
                    .status(u.getStatus() != null ? u.getStatus() : UserStatus.ACTIVE)
                    .emailVerified(u.getEmailVerified())
                    .roles(roles)
                    .createdAt(u.getCreatedAt())
                    .totalOrders(totalOrders)
                    .deleteRequested(u.getDeleteRequested())
                    .deleteRequestedAt(u.getDeleteRequestedAt())
                    .deleteRequestReason(u.getDeleteRequestReason())
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{id}/toggle-status")
    @Transactional
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản #" + id));

            boolean currentlyActive = (user.getStatus() == null || user.getStatus() == UserStatus.ACTIVE);
            UserStatus newStatus = currentlyActive ? UserStatus.LOCKED : UserStatus.ACTIVE;
            user.setStatus(newStatus);
            userRepository.save(user);

            String statusLabel = (newStatus == UserStatus.ACTIVE) ? "mở khóa (Hoạt động)" : "khóa tài khoản";
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã " + statusLabel + " cho tài khoản \"" + (user.getFullName() != null ? user.getFullName() : user.getEmail()) + "\" thành công!",
                    "newStatus", newStatus.name(),
                    "userId", id
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi cập nhật trạng thái: " + e.getMessage()
            ));
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createAdminUser(@RequestBody Map<String, String> body) {
        try {
            String fullName = body.get("fullName");
            String email = body.get("email");
            String password = body.get("password");
            String phone = body.get("phone");

            if (fullName == null || fullName.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Họ và tên không được để trống!"));
            }
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email không được để trống!"));
            }
            String cleanEmail = email.trim().toLowerCase();
            if (userRepository.existsByEmail(cleanEmail)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email này đã được sử dụng!"));
            }

            if (password == null || password.trim().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Mật khẩu phải có ít nhất 6 ký tự!"));
            }

            String cleanPhone = (phone != null && !phone.isBlank()) ? phone.trim() : null;
            if (cleanPhone != null && userRepository.existsByPhone(cleanPhone)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Số điện thoại này đã được đăng ký!"));
            }

            // Gán quyền ROLE_ADMIN cho tài khoản mới
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

            String encodedName = URLEncoder.encode(fullName.trim(), StandardCharsets.UTF_8);
            String avatarUrl = "https://ui-avatars.com/api/?name=" + encodedName + "&background=4f46e5&color=fff";

            User newUser = new User();
            newUser.setFullName(fullName.trim());
            newUser.setEmail(cleanEmail);
            newUser.setPhone(cleanPhone);
            newUser.setPassword(passwordEncoder.encode(password.trim()));
            newUser.setAvatarUrl(avatarUrl);
            newUser.setStatus(UserStatus.ACTIVE);
            newUser.setEmailVerified(true);
            newUser.setRoles(new HashSet<>(Collections.singletonList(adminRole)));

            User savedUser = userRepository.save(newUser);

            // Khởi tạo giỏ hàng rỗng
            Cart cart = new Cart(savedUser);
            cartRepository.save(cart);

            log.info("Admin created new ADMIN account #{}: {}", savedUser.getId(), savedUser.getEmail());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã tạo tài khoản Quản Trị Viên thành công!",
                    "userId", savedUser.getId()
            ));

        } catch (Exception e) {
            log.error("Failed to create admin user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Lỗi tạo tài khoản: " + e.getMessage()));
        }
    }

    @RequestMapping(value = {"/{id}", "/{id}/delete"}, method = {RequestMethod.DELETE, RequestMethod.POST})
    @Transactional
    public ResponseEntity<?> deleteUserPermanently(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            String userEmail = user.getEmail();
            String userName = user.getFullName();

            // Dọn dẹp tất cả các bảng liên quan trước khi xóa tài khoản
            try {
                // 1. Xóa giỏ hàng
                entityManager.createNativeQuery("DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = :uid)")
                        .setParameter("uid", id).executeUpdate();
                entityManager.createNativeQuery("DELETE FROM carts WHERE user_id = :uid")
                        .setParameter("uid", id).executeUpdate();
            } catch (Exception ignored) {}

            try {
                // 2. Xóa đánh giá
                entityManager.createNativeQuery("DELETE FROM reviews WHERE user_id = :uid")
                        .setParameter("uid", id).executeUpdate();
            } catch (Exception ignored) {}

            try {
                // 3. Xóa tin nhắn AI chat
                entityManager.createNativeQuery("DELETE FROM ai_chat_messages WHERE session_id IN (SELECT id FROM ai_chat_sessions WHERE user_id = :uid)")
                        .setParameter("uid", id).executeUpdate();
                entityManager.createNativeQuery("DELETE FROM ai_chat_sessions WHERE user_id = :uid")
                        .setParameter("uid", id).executeUpdate();
            } catch (Exception ignored) {}

            try {
                // 4. Xóa thanh toán và chi tiết đơn hàng
                entityManager.createNativeQuery("DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE user_id = :uid)")
                        .setParameter("uid", id).executeUpdate();
                entityManager.createNativeQuery("DELETE FROM order_details WHERE order_id IN (SELECT id FROM orders WHERE user_id = :uid)")
                        .setParameter("uid", id).executeUpdate();
                entityManager.createNativeQuery("DELETE FROM orders WHERE user_id = :uid")
                        .setParameter("uid", id).executeUpdate();
            } catch (Exception ignored) {}

            try {
                // 5. Xóa chi tiết phiếu nhập kho (nếu có)
                entityManager.createNativeQuery("DELETE FROM inventory_receipt_details WHERE receipt_id IN (SELECT id FROM inventory_receipts WHERE user_id = :uid)")
                        .setParameter("uid", id).executeUpdate();
                entityManager.createNativeQuery("DELETE FROM inventory_receipts WHERE user_id = :uid")
                        .setParameter("uid", id).executeUpdate();
            } catch (Exception ignored) {}

            try {
                // 6. Xóa bảng phân quyền user_roles
                entityManager.createNativeQuery("DELETE FROM user_roles WHERE user_id = :uid")
                        .setParameter("uid", id).executeUpdate();
            } catch (Exception ignored) {}

            // 7. Xóa hoàn toàn người dùng
            userRepository.delete(user);
            log.info("Admin permanently deleted user #{}: {} ({})", id, userName, userEmail);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã xóa hoàn toàn tài khoản \"" + (userName != null ? userName : userEmail) + "\" khỏi hệ thống!"
            ));

        } catch (Exception e) {
            log.error("Failed to delete user #{}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xóa tài khoản: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{id}/reject-delete-request")
    @Transactional
    public ResponseEntity<?> rejectDeleteRequest(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng #" + id));

        user.setDeleteRequested(false);
        user.setDeleteRequestedAt(null);
        user.setDeleteRequestReason(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đã hủy / từ chối yêu cầu xóa tài khoản của \"" + user.getFullName() + "\"."
        ));
    }
}
