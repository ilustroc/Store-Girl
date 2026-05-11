package com.tecnostore.service;

import com.tecnostore.dto.AdminDashboardResponse;
import com.tecnostore.model.Order;
import com.tecnostore.model.Product;
import com.tecnostore.repository.CategoryRepository;
import com.tecnostore.repository.OrderRepository;
import com.tecnostore.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminDashboardService {
    private static final int LOW_STOCK_LIMIT = 5;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            OrderRepository orderRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
    }

    public AdminDashboardResponse getSummary() {
        long activeProducts = productRepository.countByActiveTrue();
        List<AdminDashboardResponse.OrderSummary> latestOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toOrderSummary)
                .toList();
        List<AdminDashboardResponse.ProductSummary> lowStockList = productRepository
                .findTop5ByActiveTrueAndStockLessThanEqualOrderByStockAscNameAsc(LOW_STOCK_LIMIT)
                .stream()
                .map(this::toProductSummary)
                .toList();

        return new AdminDashboardResponse(
                productRepository.count(),
                categoryRepository.count(),
                orderRepository.count(),
                productRepository.countByActiveTrueAndStockLessThanEqual(LOW_STOCK_LIMIT),
                activeProducts,
                latestOrders,
                lowStockList
        );
    }

    private AdminDashboardResponse.OrderSummary toOrderSummary(Order order) {
        int items = order.getItems().stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();
        return new AdminDashboardResponse.OrderSummary(
                order.getId(),
                order.getUser().getFullName(),
                order.getTotal(),
                order.getStatus(),
                order.getCreatedAt(),
                items
        );
    }

    private AdminDashboardResponse.ProductSummary toProductSummary(Product product) {
        return new AdminDashboardResponse.ProductSummary(
                product.getId(),
                product.getName(),
                product.getCategory().getName(),
                product.getStock(),
                product.getImage()
        );
    }
}
