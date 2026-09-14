package com.bookmind.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateProfileRequest {

    @NotNull(message = "User ID không được để trống")
    private Long userId;

    private String fullName;

    private String phone;

    private String currentPassword;

    private String newPassword;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(Long userId, String fullName, String phone, String currentPassword, String newPassword) {
        this.userId = userId;
        this.fullName = fullName;
        this.phone = phone;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
