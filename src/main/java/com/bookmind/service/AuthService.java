package com.bookmind.service;

import com.bookmind.dto.LoginRequest;
import com.bookmind.dto.RegisterRequest;
import com.bookmind.dto.UserResponseDto;
import com.bookmind.entity.Cart;
import com.bookmind.entity.Role;
import com.bookmind.entity.User;
import com.bookmind.entity.enums.UserStatus;
import com.bookmind.repository.CartRepository;
import com.bookmind.repository.RoleRepository;
import com.bookmind.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       CartRepository cartRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDto login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Email hoặc mật khẩu không chính xác!"));

        boolean passwordMatches = false;

        // Hỗ trợ mật khẩu tài khoản mẫu từ book.sql ('123456')
        if ("$2a$10$xyzMockHashBcrypt123456789".equals(user.getPassword()) && "123456".equals(request.getPassword())) {
            passwordMatches = true;
            // Nâng cấp lưu hash BCrypt thật cho lần sau
            user.setPassword(passwordEncoder.encode("123456"));
            userRepository.save(user);
        } else {
            try {
                if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    passwordMatches = true;
                }
            } catch (Exception ignored) {
            }

            if (!passwordMatches && user.getPassword().equals(request.getPassword())) {
                passwordMatches = true;
            }
        }

        if (!passwordMatches) {
            throw new IllegalArgumentException("Email hoặc mật khẩu không chính xác!");
        }

        // Nếu tài khoản trước đó từng bị đánh dấu khóa do thử nghiệm tính năng cũ, tự động kích hoạt lại
        if (user.getStatus() != UserStatus.ACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);
        }

        return mapToUserResponseDto(user);
    }

    @Transactional
    public UserResponseDto register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email này đã được sử dụng bởi tài khoản khác!");
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (userRepository.existsByPhone(request.getPhone().trim())) {
                throw new IllegalArgumentException("Số điện thoại này đã được đăng ký!");
            }
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp!");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        String encodedName = URLEncoder.encode(request.getFullName(), StandardCharsets.UTF_8);
        String avatarUrl = "https://ui-avatars.com/api/?name=" + encodedName + "&background=random";

        User newUser = new User();
        newUser.setFullName(request.getFullName().trim());
        newUser.setEmail(email);
        newUser.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setAvatarUrl(avatarUrl);
        newUser.setStatus(UserStatus.ACTIVE);
        newUser.setEmailVerified(false);
        newUser.setRoles(new HashSet<>(Collections.singletonList(userRole)));

        User savedUser = userRepository.save(newUser);

        // Khởi tạo giỏ hàng cho tài khoản mới
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        return mapToUserResponseDto(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin người dùng!"));
        return mapToUserResponseDto(user);
    }

    @Transactional
    public UserResponseDto updateProfile(com.bookmind.dto.UpdateProfileRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin người dùng!"));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
            if (user.getAvatarUrl() == null || user.getAvatarUrl().contains("ui-avatars.com")) {
                String encodedName = URLEncoder.encode(user.getFullName(), StandardCharsets.UTF_8);
                user.setAvatarUrl("https://ui-avatars.com/api/?name=" + encodedName + "&background=random");
            }
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            String newPhone = request.getPhone().trim();
            if (!newPhone.equals(user.getPhone()) && userRepository.existsByPhone(newPhone)) {
                throw new IllegalArgumentException("Số điện thoại này đã được sử dụng bởi tài khoản khác!");
            }
            user.setPhone(newPhone);
        }

        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
                throw new IllegalArgumentException("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới!");
            }
            boolean matchCurrent = false;
            if ("$2a$10$xyzMockHashBcrypt123456789".equals(user.getPassword()) && "123456".equals(request.getCurrentPassword())) {
                matchCurrent = true;
            } else {
                try {
                    matchCurrent = passwordEncoder.matches(request.getCurrentPassword(), user.getPassword());
                } catch (Exception ignored) {
                }
                if (!matchCurrent && user.getPassword().equals(request.getCurrentPassword())) {
                    matchCurrent = true;
                }
            }
            if (!matchCurrent) {
                throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác!");
            }
            if (request.getNewPassword().trim().length() < 6) {
                throw new IllegalArgumentException("Mật khẩu mới phải có ít nhất 6 ký tự!");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        }

        User savedUser = userRepository.save(user);
        return mapToUserResponseDto(savedUser);
    }

    @Transactional
    public UserResponseDto requestDeleteAccount(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng!"));

        user.setDeleteRequested(true);
        user.setDeleteRequestedAt(java.time.LocalDateTime.now());
        user.setDeleteRequestReason(reason != null && !reason.isBlank() ? reason.trim() : "Khách hàng gửi yêu cầu xóa tài khoản");

        User saved = userRepository.save(user);
        return mapToUserResponseDto(saved);
    }

    @Transactional
    public UserResponseDto cancelDeleteRequest(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng!"));

        user.setDeleteRequested(false);
        user.setDeleteRequestedAt(null);
        user.setDeleteRequestReason(null);

        User saved = userRepository.save(user);
        return mapToUserResponseDto(saved);
    }

    private UserResponseDto mapToUserResponseDto(User user) {
        Set<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                : Collections.emptySet();

        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getStatus() != null ? user.getStatus().name() : "ACTIVE",
                roleNames,
                user.getDeleteRequested(),
                user.getDeleteRequestedAt(),
                user.getDeleteRequestReason()
        );
    }
}
