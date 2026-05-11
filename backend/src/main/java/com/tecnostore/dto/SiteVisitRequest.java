package com.tecnostore.dto;

import jakarta.validation.constraints.NotBlank;

public record SiteVisitRequest(
        @NotBlank String sessionId,
        @NotBlank String page,
        String source
) {
}
