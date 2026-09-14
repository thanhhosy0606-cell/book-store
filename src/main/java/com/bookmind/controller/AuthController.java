package com.bookmind.controller;

import com.bookmind.dto.ApiResponse;
import com.bookmind.dto.LoginRequest;
import com.bookmind.dto.RegisterRequest;
import com.bookmind.dto.UserResponseDto;
import com.bookmind.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponseDto>> login(@Valid @RequestBody LoginRequest request) {
        UserResponseDto user = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công!", user));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponseDto user = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký tài khoản thành công!", user));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUser(@RequestParam Long userId) {
        UserResponseDto user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công!", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateProfile(@Valid @RequestBody com.bookmind.dto.UpdateProfileRequest request) {
        UserResponseDto updatedUser = authService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin cá nhân thành công!", updatedUser));
    }

    @PostMapping("/request-delete")
    public ResponseEntity<ApiResponse<UserResponseDto>> requestDelete(@RequestBody java.util.Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String reason = body.get("reason") != null ? body.get("reason").toString() : "";
        UserResponseDto updatedUser = authService.requestDeleteAccount(userId, reason);
        return ResponseEntity.ok(ApiResponse.success("Đã gửi yêu cầu xóa tài khoản đến Quản trị viên!", updatedUser));
    }

    @PostMapping("/cancel-delete-request")
    public ResponseEntity<ApiResponse<UserResponseDto>> cancelDeleteRequest(@RequestBody java.util.Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        UserResponseDto updatedUser = authService.cancelDeleteRequest(userId);
        return ResponseEntity.ok(ApiResponse.success("Đã hủy yêu cầu xóa tài khoản thành công!", updatedUser));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công!", null));
    }
}
