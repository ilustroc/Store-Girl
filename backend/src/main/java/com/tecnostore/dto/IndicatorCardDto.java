package com.tecnostore.dto;

import java.math.BigDecimal;

public record IndicatorCardDto(
        String title,
        String description,
        String formula,
        String frequency,
        String goal,
        String status,
        BigDecimal value,
        String valueLabel,
        String message,
        Object data
) {
}
