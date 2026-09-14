package com.bookmind.dto;

import com.bookmind.entity.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private UserStatus status;
    private Boolean emailVerified;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private Long totalOrders;
    private Boolean deleteRequested;
    private LocalDateTime deleteRequestedAt;
    private String deleteRequestReason;

    // Explicit Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Boolean getDeleteRequested() {
        return deleteRequested != null ? deleteRequested : false;
    }

    public void setDeleteRequested(Boolean deleteRequested) {
        this.deleteRequested = deleteRequested;
    }

    public LocalDateTime getDeleteRequestedAt() {
        return deleteRequestedAt;
    }

    public void setDeleteRequestedAt(LocalDateTime deleteRequestedAt) {
        this.deleteRequestedAt = deleteRequestedAt;
    }

    public String getDeleteRequestReason() {
        return deleteRequestReason;
    }

    public void setDeleteRequestReason(String deleteRequestReason) {
        this.deleteRequestReason = deleteRequestReason;
    }

    public static AdminUserDtoBuilder builder() {
        return new AdminUserDtoBuilder();
    }

    public static class AdminUserDtoBuilder {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String avatarUrl;
        private UserStatus status;
        private Boolean emailVerified;
        private Set<String> roles;
        private LocalDateTime createdAt;
        private Long totalOrders;
        private Boolean deleteRequested;
        private LocalDateTime deleteRequestedAt;
        private String deleteRequestReason;

        public AdminUserDtoBuilder id(Long id) { this.id = id; return this; }
        public AdminUserDtoBuilder email(String email) { this.email = email; return this; }
        public AdminUserDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AdminUserDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public AdminUserDtoBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public AdminUserDtoBuilder status(UserStatus status) { this.status = status; return this; }
        public AdminUserDtoBuilder emailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public AdminUserDtoBuilder roles(Set<String> roles) { this.roles = roles; return this; }
        public AdminUserDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AdminUserDtoBuilder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public AdminUserDtoBuilder deleteRequested(Boolean deleteRequested) { this.deleteRequested = deleteRequested; return this; }
        public AdminUserDtoBuilder deleteRequestedAt(LocalDateTime deleteRequestedAt) { this.deleteRequestedAt = deleteRequestedAt; return this; }
        public AdminUserDtoBuilder deleteRequestReason(String deleteRequestReason) { this.deleteRequestReason = deleteRequestReason; return this; }

        public AdminUserDto build() {
            AdminUserDto dto = new AdminUserDto();
            dto.setId(this.id);
            dto.setEmail(this.email);
            dto.setFullName(this.fullName);
            dto.setPhone(this.phone);
            dto.setAvatarUrl(this.avatarUrl);
            dto.setStatus(this.status);
            dto.setEmailVerified(this.emailVerified);
            dto.setRoles(this.roles);
            dto.setCreatedAt(this.createdAt);
            dto.setTotalOrders(this.totalOrders);
            dto.setDeleteRequested(this.deleteRequested);
            dto.setDeleteRequestedAt(this.deleteRequestedAt);
            dto.setDeleteRequestReason(this.deleteRequestReason);
            return dto;
        }
    }
}
