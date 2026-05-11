package com.tecnostore.dto;

import java.math.BigDecimal;

public record DailySalesDto(
        String date,
        BigDecimal revenue
) {
}
