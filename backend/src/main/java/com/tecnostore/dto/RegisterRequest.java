package com.tecnostore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotBlank
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
                message = "La contraseña debe contener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
        )
        String password,
        @NotBlank
        @Pattern(regexp = "^9\\d{8}$", message = "El teléfono debe contener 9 dígitos y comenzar con 9.")
        String phone
) {
}
