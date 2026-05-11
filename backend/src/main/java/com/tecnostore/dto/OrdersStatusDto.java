package com.tecnostore.dto;

import java.math.BigDecimal;

public record OrdersStatusDto(
        String status,
        Long count,
        BigDecimal percentage
) {
}
