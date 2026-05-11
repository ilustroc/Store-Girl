package com.tecnostore.dto;

import java.math.BigDecimal;

public record ProductProfitabilityDto(
        Long productId,
        String product,
        BigDecimal salePrice,
        BigDecimal costPrice,
        Integer unitsSold,
        BigDecimal margin,
        Boolean costRegistered
) {
}
