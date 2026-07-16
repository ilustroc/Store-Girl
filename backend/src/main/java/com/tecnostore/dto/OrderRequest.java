package com.tecnostore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record OrderRequest(
        @NotNull Long userId,
        @NotBlank String fullName,
        @NotBlank
        @Pattern(regexp = "^9\\d{8}$", message = "El teléfono debe contener 9 dígitos y comenzar con 9.")
        String phone,
        @NotBlank String address,
        String comment,
        @Valid @NotEmpty List<OrderItemRequest> items
) {
}
