package com.tecnostore.dto;

import com.tecnostore.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AdminDashboardResponse(
        long totalProducts,
        long totalCategories,
        long totalOrders,
        long lowStockProducts,
        long activeProducts,
        List<OrderSummary> latestOrders,
        List<ProductSummary> lowStockList
) {
    public record OrderSummary(
            Long id,
            String customer,
            BigDecimal total,
            OrderStatus status,
            LocalDateTime createdAt,
            Integer items
    ) {
    }

    public record ProductSummary(
            Long id,
            String name,
            String category,
            Integer stock,
            String image
    ) {
    }
}
