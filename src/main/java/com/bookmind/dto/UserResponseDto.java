package com.bookmind.dto;

import java.util.Set;

public class UserResponseDto {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String status;
    private Set<String> roles;
    private Boolean deleteRequested;
    private java.time.LocalDateTime deleteRequestedAt;
    private String deleteRequestReason;

    public UserResponseDto() {
    }

    public UserResponseDto(Long id, String email, String fullName, String phone, String avatarUrl, String status, Set<String> roles) {
        this(id, email, fullName, phone, avatarUrl, status, roles, false, null, null);
    }

    public UserResponseDto(Long id, String email, String fullName, String phone, String avatarUrl, String status, Set<String> roles, Boolean deleteRequested, java.time.LocalDateTime deleteRequestedAt, String deleteRequestReason) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.status = status;
        this.roles = roles;
        this.deleteRequested = deleteRequested != null ? deleteRequested : false;
        this.deleteRequestedAt = deleteRequestedAt;
        this.deleteRequestReason = deleteRequestReason;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Boolean getDeleteRequested() {
        return deleteRequested != null ? deleteRequested : false;
    }

    public void setDeleteRequested(Boolean deleteRequested) {
        this.deleteRequested = deleteRequested;
    }

    public java.time.LocalDateTime getDeleteRequestedAt() {
        return deleteRequestedAt;
    }

    public void setDeleteRequestedAt(java.time.LocalDateTime deleteRequestedAt) {
        this.deleteRequestedAt = deleteRequestedAt;
    }

    public String getDeleteRequestReason() {
        return deleteRequestReason;
    }

    public void setDeleteRequestReason(String deleteRequestReason) {
        this.deleteRequestReason = deleteRequestReason;
    }
}
