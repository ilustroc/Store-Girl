package com.tecnostore.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String name,
        @NotBlank String description,
        @NotNull Long categoryId,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @DecimalMin("0.00") BigDecimal costPrice,
        @NotNull @Min(0) Integer stock,
        String image
) {
}
