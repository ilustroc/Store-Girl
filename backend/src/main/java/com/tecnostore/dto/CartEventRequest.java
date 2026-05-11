package com.tecnostore.dto;

import jakarta.validation.constraints.NotBlank;

public record CartEventRequest(
        Long userId,
        @NotBlank String sessionId,
        @NotBlank String status
) {
}
