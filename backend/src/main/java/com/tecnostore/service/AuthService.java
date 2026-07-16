package com.tecnostore.service;

import com.tecnostore.dto.LoginRequest;
import com.tecnostore.dto.LoginResponse;
import com.tecnostore.dto.RegisterRequest;
import com.tecnostore.model.Role;
import com.tecnostore.model.User;
import com.tecnostore.repository.UserRepository;
import com.tecnostore.security.JwtService;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCaseAndActiveTrue(request.email())
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPassword()))
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));
        return toResponse(user);
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("El correo ya esta registrado");
        }
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setRole(Role.USER);
        user.setActive(true);
        return toResponse(userRepository.save(user));
    }

    @PostConstruct
    public void encodeLegacyPlainPasswords() {
        userRepository.findAll().stream()
                .filter(user -> !isBcrypt(user.getPassword()))
                .forEach(user -> {
                    String replacement = switch (user.getPassword()) {
                        case "admin" -> "Admin@123";
                        case "usuario" -> "Usuario@123";
                        default -> user.getPassword();
                    };
                    user.setPassword(passwordEncoder.encode(replacement));
                    userRepository.save(user);
                });
    }

    private boolean isBcrypt(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
    }

    private LoginResponse toResponse(User user) {
        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                jwtService.generateToken(user)
        );
    }
}
