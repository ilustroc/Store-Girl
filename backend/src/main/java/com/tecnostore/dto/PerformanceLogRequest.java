package com.tecnostore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PerformanceLogRequest(
        @NotBlank String page,
        @NotNull @Min(0) Long loadTimeMs
) {
}
