package com.tecnostore.dto;

import java.math.BigDecimal;

public record InventoryRotationDto(
        String category,
        Integer unitsSold,
        BigDecimal averageStock,
        BigDecimal rotation
) {
}
