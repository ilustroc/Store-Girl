package com.tecnostore.dto;

import java.math.BigDecimal;

public record AdminIndicatorsResponse(
        Summary summary,
        IndicatorCardDto inventoryRotation,
        IndicatorCardDto dailySalesDensity,
        IndicatorCardDto profitabilityRanking,
        IndicatorCardDto minimumStockEffectiveness,
        IndicatorCardDto conversionRate,
        IndicatorCardDto cartAbandonmentRate,
        IndicatorCardDto catalogLoadTime,
        IndicatorCardDto confirmedOrdersRate
) {
    public record Summary(
            long totalProducts,
            long totalCategories,
            long totalOrders,
            BigDecimal accumulatedSales,
            long lowStockProducts
    ) {
    }
}
