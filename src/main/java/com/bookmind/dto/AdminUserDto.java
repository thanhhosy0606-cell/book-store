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
}
