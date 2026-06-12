package com.tecnostore.dto;

import jakarta.validation.constraints.*;

public record PerformanceLogRequest(
        @NotBlank String page,
        @NotNull @Min(0) Long loadTimeMs
) {
}
