package com.tecnostore.service;

import com.tecnostore.dto.LoginRequest;
import com.tecnostore.dto.LoginResponse;
import com.tecnostore.dto.RegisterRequest;
import com.tecnostore.model.Role;
import com.tecnostore.model.User;
import com.tecnostore.repository.UserRepository;
import com.tecnostore.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService = mock(JwtService.class);
    private final AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

    @Test
    void loginCorrectoRetornaToken() {
        User user = user("admin@gmail.com", passwordEncoder.encode("Admin@123"), Role.ADMIN);
        when(userRepository.findByEmailIgnoreCaseAndActiveTrue("admin@gmail.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        LoginResponse response = authService.login(new LoginRequest("admin@gmail.com", "Admin@123"));

        assertEquals("admin@gmail.com", response.email());
        assertEquals(Role.ADMIN, response.role());
        assertEquals("jwt-token", response.token());
    }

    @Test
    void loginIncorrectoRechazaCredenciales() {
        User user = user("usuario@gmail.com", passwordEncoder.encode("Usuario@123"), Role.USER);
        when(userRepository.findByEmailIgnoreCaseAndActiveTrue("usuario@gmail.com")).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> authService.login(new LoginRequest("usuario@gmail.com", "mala")));
    }

    @Test
    void registroCifraPasswordYAsignaRolUser() {
        when(userRepository.existsByEmailIgnoreCase("nuevo@gmail.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        LoginResponse response = authService.register(new RegisterRequest("Nuevo Usuario", "nuevo@gmail.com", "Nuevo@123", "955123456"));

        assertEquals(Role.USER, response.role());
        verify(userRepository).save(argThat(user -> passwordEncoder.matches("Nuevo@123", user.getPassword())));
    }

    private User user(String email, String password, Role role) {
        User user = new User();
        user.setId(1L);
        user.setFullName("Usuario Prueba");
        user.setEmail(email);
        user.setPassword(password);
        user.setPhone("955123456");
        user.setRole(role);
        user.setActive(true);
        return user;
    }
}
