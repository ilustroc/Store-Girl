package com.tecnostore.service;

import com.tecnostore.dto.LoginRequest;
import com.tecnostore.dto.LoginResponse;
import com.tecnostore.dto.RegisterRequest;
import com.tecnostore.model.Role;
import com.tecnostore.model.User;
import com.tecnostore.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCaseAndActiveTrue(request.email())
                .filter(candidate -> candidate.getPassword().equals(request.password()))
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
        user.setPassword(request.password());
        user.setPhone(request.phone());
        user.setRole(Role.USER);
        user.setActive(true);
        return toResponse(userRepository.save(user));
    }

    private LoginResponse toResponse(User user) {
        return new LoginResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getPhone());
    }
}
