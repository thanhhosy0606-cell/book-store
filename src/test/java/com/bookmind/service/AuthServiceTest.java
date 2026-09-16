package com.bookmind.service;

import com.bookmind.dto.LoginRequest;
import com.bookmind.dto.UserResponseDto;
import com.bookmind.entity.Role;
import com.bookmind.entity.User;
import com.bookmind.entity.enums.UserStatus;
import com.bookmind.repository.CartRepository;
import com.bookmind.repository.RoleRepository;
import com.bookmind.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("user@example.com");
        sampleUser.setFullName("Nguyen Van A");
        sampleUser.setPassword("$2a$10$encodedHash");
        sampleUser.setStatus(UserStatus.ACTIVE);
        sampleUser.setRoles(new HashSet<>(Collections.singletonList(new Role("ROLE_USER"))));
    }

    @Test
    void testLogin_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@example.com");
        req.setPassword("password123");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "$2a$10$encodedHash")).thenReturn(true);

        UserResponseDto res = authService.login(req);

        assertNotNull(res);
        assertEquals("user@example.com", res.getEmail());
        assertEquals("ACTIVE", res.getStatus());
    }

    @Test
    void testLogin_AccountLocked_ThrowsException() {
        sampleUser.setStatus(UserStatus.LOCKED);
        LoginRequest req = new LoginRequest();
        req.setEmail("user@example.com");
        req.setPassword("password123");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "$2a$10$encodedHash")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().contains("khóa"));
    }

    @Test
    void testLogin_WrongPassword_ThrowsException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@example.com");
        req.setPassword("wrongpassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", "$2a$10$encodedHash")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().contains("không chính xác"));
    }

    @Test
    void testGetCurrentUser_AccountLocked_ThrowsException() {
        sampleUser.setStatus(UserStatus.LOCKED);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.getCurrentUser(1L));
        assertTrue(ex.getMessage().contains("khóa"));
    }
}
