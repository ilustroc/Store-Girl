package com.tecnostore.service;

import com.tecnostore.dto.AdminIndicatorsResponse;
import com.tecnostore.dto.DailySalesDto;
import com.tecnostore.dto.IndicatorCardDto;
import com.tecnostore.dto.InventoryRotationDto;
import com.tecnostore.dto.OrdersStatusDto;
import com.tecnostore.dto.ProductProfitabilityDto;
import com.tecnostore.model.Category;
import com.tecnostore.model.Cart;
import com.tecnostore.model.Order;
import com.tecnostore.model.OrderItem;
import com.tecnostore.model.OrderStatus;
import com.tecnostore.model.PerformanceLog;
import com.tecnostore.model.Product;
import com.tecnostore.repository.CartRepository;
import com.tecnostore.repository.CategoryRepository;
import com.tecnostore.repository.OrderRepository;
import com.tecnostore.repository.PerformanceLogRepository;
import com.tecnostore.repository.ProductRepository;
import com.tecnostore.repository.SiteVisitRepository;
import com.tecnostore.repository.StockAlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AdminIndicatorService {
    private static final int LOW_STOCK_LIMIT = 5;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final SiteVisitRepository siteVisitRepository;
    private final CartRepository cartRepository;
    private final PerformanceLogRepository performanceLogRepository;
    private final StockAlertRepository stockAlertRepository;

    public AdminIndicatorService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            OrderRepository orderRepository,
            SiteVisitRepository siteVisitRepository,
            CartRepository cartRepository,
            PerformanceLogRepository performanceLogRepository,
            StockAlertRepository stockAlertRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.siteVisitRepository = siteVisitRepository;
        this.cartRepository = cartRepository;
        this.performanceLogRepository = performanceLogRepository;
        this.stockAlertRepository = stockAlertRepository;
    }

    @Transactional(readOnly = true)
    public AdminIndicatorsResponse getIndicators() {
        List<Product> products = productRepository.findByActiveTrueOrderByIdDesc();
        List<Category> categories = categoryRepository.findAllByOrderByNameAsc();
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        List<Order> confirmedOrders = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.CONFIRMED)
                .toList();

        BigDecimal accumulatedSales = confirmedOrders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminIndicatorsResponse(
                new AdminIndicatorsResponse.Summary(
                        products.size(),
                        categories.size(),
                        orders.size(),
                        money(accumulatedSales),
                        products.stream().filter(product -> safeStock(product) <= LOW_STOCK_LIMIT).count()
                ),
                inventoryRotation(categories, products, confirmedOrders),
                dailySalesDensity(confirmedOrders),
                profitabilityRanking(products, confirmedOrders),
                minimumStockEffectiveness(products),
                conversionRate(confirmedOrders.size()),
                cartAbandonmentRate(),
                catalogLoadTime(),
                confirmedOrdersRate(orders)
        );
    }

    private IndicatorCardDto inventoryRotation(List<Category> categories, List<Product> products, List<Order> confirmedOrders) {
        Map<Long, Integer> unitsSoldByProduct = unitsSoldByProduct(confirmedOrders);
        List<InventoryRotationDto> rows = categories.stream()
                .map(category -> {
                    List<Product> categoryProducts = products.stream()
                            .filter(product -> product.getCategory().getId().equals(category.getId()))
                            .toList();
                    int unitsSold = categoryProducts.stream()
                            .mapToInt(product -> unitsSoldByProduct.getOrDefault(product.getId(), 0))
                            .sum();
                    BigDecimal averageStock = averageStock(categoryProducts);
                    BigDecimal rotation = averageStock.compareTo(BigDecimal.ZERO) > 0
                            ? BigDecimal.valueOf(unitsSold).divide(averageStock, 2, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;
                    return new InventoryRotationDto(category.getName(), unitsSold, averageStock, rotation);
                })
                .toList();
        BigDecimal averageRotation = rows.isEmpty()
                ? BigDecimal.ZERO
                : rows.stream().map(InventoryRotationDto::rotation).reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(rows.size()), 2, RoundingMode.HALF_UP);

        return new IndicatorCardDto(
                "Índice de Rotación de Inventario por Categoría",
                "Permite identificar qué categorías tienen mayor movimiento comercial.",
                "Rotación = Productos vendidos / Stock promedio",
                "Semanal",
                "Identificar el 20% de productos que generan el 80% del movimiento.",
                averageRotation.compareTo(BigDecimal.valueOf(0.5)) >= 0 ? "GOOD" : averageRotation.compareTo(BigDecimal.ZERO) > 0 ? "ATTENTION" : "CRITICAL",
                averageRotation,
                averageRotation + "x",
                rows.isEmpty() ? "No hay datos suficientes para calcular este indicador." : null,
                rows
        );
    }

    private IndicatorCardDto dailySalesDensity(List<Order> confirmedOrders) {
        Map<LocalDate, BigDecimal> salesByDate = confirmedOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().toLocalDate(),
                        LinkedHashMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotal, BigDecimal::add)
                ));
        List<DailySalesDto> rows = salesByDate.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new DailySalesDto(entry.getKey().toString(), money(entry.getValue())))
                .toList();
        BigDecimal total = rows.stream().map(DailySalesDto::revenue).reduce(BigDecimal.ZERO, BigDecimal::add);
        String bestDay = rows.stream()
                .max(Comparator.comparing(DailySalesDto::revenue))
                .map(DailySalesDto::date)
                .orElse("Sin datos");
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("series", rows);
        data.put("bestDay", bestDay);
        data.put("total", money(total));

        return new IndicatorCardDto(
                "Densidad de Ventas Diarias",
                "Mide el volumen de ingresos generados por día.",
                "Ingreso Diario = SUM(Precio de venta x Cantidad vendida por día)",
                "Diaria",
                "Identificar días de mayor flujo de caja.",
                total.compareTo(BigDecimal.ZERO) > 0 ? "GOOD" : "ATTENTION",
                money(total),
                "S/ " + money(total),
                rows.isEmpty() ? "No hay datos suficientes para calcular este indicador." : null,
                data
        );
    }

    private IndicatorCardDto profitabilityRanking(List<Product> products, List<Order> confirmedOrders) {
        Map<Long, Integer> unitsSoldByProduct = unitsSoldByProduct(confirmedOrders);
        Map<Long, Product> productsById = products.stream()
                .collect(Collectors.toMap(Product::getId, Function.identity(), (left, right) -> left));
        List<ProductProfitabilityDto> rows = unitsSoldByProduct.entrySet().stream()
                .map(entry -> {
                    Product product = productsById.get(entry.getKey());
                    if (product == null) return null;
                    BigDecimal salePrice = product.getPrice() == null ? BigDecimal.ZERO : product.getPrice();
                    BigDecimal costPrice = product.getCostPrice() == null ? BigDecimal.ZERO : product.getCostPrice();
                    BigDecimal margin = salePrice.subtract(costPrice).multiply(BigDecimal.valueOf(entry.getValue()));
                    return new ProductProfitabilityDto(
                            product.getId(),
                            product.getName(),
                            money(salePrice),
                            money(costPrice),
                            entry.getValue(),
                            money(margin),
                            costPrice.compareTo(BigDecimal.ZERO) > 0
                    );
                })
                .filter(row -> row != null)
                .sorted(Comparator.comparing(ProductProfitabilityDto::margin).reversed())
                .limit(5)
                .toList();
        BigDecimal totalMargin = rows.stream()
                .map(ProductProfitabilityDto::margin)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new IndicatorCardDto(
                "Ranking de Rentabilidad por Producto",
                "Identifica los productos con mayor margen de ganancia.",
                "Margen = (Precio venta - Precio costo) x Unidades vendidas",
                "Mensual",
                "Mantener stock mínimo en productos con mayor rentabilidad.",
                totalMargin.compareTo(BigDecimal.ZERO) > 0 ? "GOOD" : "ATTENTION",
                money(totalMargin),
                "S/ " + money(totalMargin),
                rows.isEmpty() ? "No hay datos suficientes para calcular este indicador." : null,
                rows
        );
    }

    private IndicatorCardDto minimumStockEffectiveness(List<Product> products) {
        long outOfStock = products.stream().filter(product -> safeStock(product) == 0).count();
        long lowStock = products.stream().filter(product -> safeStock(product) > 0 && safeStock(product) <= LOW_STOCK_LIMIT).count();
        long pendingAlerts = stockAlertRepository.countByStatusIgnoreCase("PENDING");
        long attendedAlerts = stockAlertRepository.countByStatusIgnoreCase("ATTENDED");
        BigDecimal effectiveness = outOfStock > 0
                ? percent(BigDecimal.valueOf(attendedAlerts), BigDecimal.valueOf(outOfStock))
                : BigDecimal.ZERO;
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("lowStockProducts", lowStock);
        data.put("outOfStockProducts", outOfStock);
        data.put("pendingAlerts", pendingAlerts);
        data.put("attendedAlerts", attendedAlerts);
        data.put("lowStockList", productRepository.findTop5ByActiveTrueAndStockLessThanEqualOrderByStockAscNameAsc(LOW_STOCK_LIMIT).stream().map(product -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("product", product.getName());
            row.put("category", product.getCategory() == null ? "Sin categoría" : product.getCategory().getName());
            row.put("stock", safeStock(product));
            return row;
        }).toList());
        data.put("latestAlerts", stockAlertRepository.findTop5ByOrderByCreatedAtDesc().stream().map(alert -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("product", alert.getProduct().getName());
            row.put("type", alert.getAlertType());
            row.put("stockAtAlert", alert.getStockAtAlert());
            row.put("status", alert.getStatus());
            return row;
        }).toList());

        return new IndicatorCardDto(
                "Tasa de Efectividad de Stock Mínimo",
                "Valida la eficiencia de las alertas de reabastecimiento.",
                "Efectividad = Alertas atendidas / Productos en stock cero x 100",
                "Quincenal",
                "Garantizar continuidad operativa.",
                outOfStock == 0 ? "ATTENTION" : effectiveness.compareTo(BigDecimal.valueOf(80)) >= 0 ? "GOOD" : effectiveness.compareTo(BigDecimal.valueOf(50)) >= 0 ? "ATTENTION" : "CRITICAL",
                effectiveness,
                outOfStock == 0 ? "Sin cálculo completo" : effectiveness + "%",
                outOfStock == 0 ? "No hay datos suficientes para calcular la efectividad completa." : null,
                data
        );
    }

    private IndicatorCardDto conversionRate(long confirmedOrders) {
        long visits = siteVisitRepository.count();
        BigDecimal rate = visits > 0 ? percent(BigDecimal.valueOf(confirmedOrders), BigDecimal.valueOf(visits)) : BigDecimal.ZERO;
        Map<String, Object> data = Map.of("visits", visits, "confirmedPurchases", confirmedOrders);
        return new IndicatorCardDto(
                "Tasa de Conversión de Ventas",
                "Mide la capacidad de convertir visitantes en compradores.",
                "Conversión = Compras realizadas / Visitantes x 100",
                "Mensual",
                "Alcanzar una tasa mínima de 3.5%.",
                visits == 0 ? "ATTENTION" : rate.compareTo(BigDecimal.valueOf(3.5)) >= 0 ? "GOOD" : rate.compareTo(BigDecimal.ZERO) > 0 ? "ATTENTION" : "CRITICAL",
                rate,
                visits == 0 ? "Sin datos" : rate + "%",
                visits == 0 ? "No hay datos suficientes para calcular este indicador." : null,
                data
        );
    }

    private IndicatorCardDto cartAbandonmentRate() {
        List<Cart> carts = cartRepository.findAll();
        long total = carts.size();
        long notCompleted = carts.stream().filter(cart -> !"COMPLETED".equalsIgnoreCase(cart.getStatus())).count();
        BigDecimal rate = total > 0 ? percent(BigDecimal.valueOf(notCompleted), BigDecimal.valueOf(total)) : BigDecimal.ZERO;
        Map<String, Object> data = Map.of("totalCarts", total, "notCompleted", notCompleted);
        return new IndicatorCardDto(
                "Tasa de Abandono del Carrito",
                "Mide cuántos usuarios abandonan el proceso antes de pagar.",
                "Abandono = Carritos no finalizados / Total de carritos x 100",
                "Semanal",
                "Reducir fricciones en el checkout.",
                total == 0 ? "ATTENTION" : rate.compareTo(BigDecimal.valueOf(30)) <= 0 ? "GOOD" : rate.compareTo(BigDecimal.valueOf(60)) <= 0 ? "ATTENTION" : "CRITICAL",
                rate,
                total == 0 ? "Sin datos" : rate + "%",
                total == 0 ? "No hay datos suficientes para calcular este indicador." : null,
                data
        );
    }

    private IndicatorCardDto catalogLoadTime() {
        List<PerformanceLog> logs = performanceLogRepository.findByPageOrderByCreatedAtDesc("catalogo");
        BigDecimal average = logs.isEmpty()
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(logs.stream().mapToLong(PerformanceLog::getLoadTimeMs).average().orElse(0)).setScale(0, RoundingMode.HALF_UP);
        Map<String, Object> data = Map.of("measurements", logs.size());
        return new IndicatorCardDto(
                "Tiempo Promedio de Carga del Catálogo",
                "Mide el rendimiento de carga del catálogo.",
                "Tiempo promedio = Suma de tiempos / Número de mediciones",
                "Diaria",
                "Mantener la carga por debajo de 3 segundos.",
                logs.isEmpty() ? "ATTENTION" : average.compareTo(BigDecimal.valueOf(3000)) <= 0 ? "GOOD" : average.compareTo(BigDecimal.valueOf(5000)) <= 0 ? "ATTENTION" : "CRITICAL",
                average,
                logs.isEmpty() ? "Sin datos" : average + " ms",
                logs.isEmpty() ? "No hay datos suficientes para calcular este indicador." : null,
                data
        );
    }

    private IndicatorCardDto confirmedOrdersRate(List<Order> orders) {
        long total = orders.size();
        long confirmed = orders.stream().filter(order -> order.getStatus() == OrderStatus.CONFIRMED).count();
        BigDecimal rate = total > 0 ? percent(BigDecimal.valueOf(confirmed), BigDecimal.valueOf(total)) : BigDecimal.ZERO;
        List<OrdersStatusDto> statusRows = new ArrayList<>();
        for (OrderStatus status : OrderStatus.values()) {
            long count = orders.stream().filter(order -> order.getStatus() == status).count();
            statusRows.add(new OrdersStatusDto(status.name(), count, total > 0 ? percent(BigDecimal.valueOf(count), BigDecimal.valueOf(total)) : BigDecimal.ZERO));
        }
        return new IndicatorCardDto(
                "Porcentaje de Pedidos Confirmados Correctamente",
                "Mide la confiabilidad del proceso de compra.",
                "Pedidos confirmados = Confirmados / Total de pedidos x 100",
                "Diaria",
                "Lograr al menos 98% de pedidos confirmados.",
                total == 0 ? "ATTENTION" : rate.compareTo(BigDecimal.valueOf(98)) >= 0 ? "GOOD" : rate.compareTo(BigDecimal.valueOf(80)) >= 0 ? "ATTENTION" : "CRITICAL",
                rate,
                total == 0 ? "Sin datos" : rate + "%",
                total == 0 ? "No hay datos suficientes para calcular este indicador." : null,
                statusRows
        );
    }

    private Map<Long, Integer> unitsSoldByProduct(List<Order> confirmedOrders) {
        Map<Long, Integer> result = new LinkedHashMap<>();
        for (Order order : confirmedOrders) {
            for (OrderItem item : order.getItems()) {
                Long productId = item.getProduct().getId();
                result.merge(productId, item.getQuantity(), Integer::sum);
            }
        }
        return result;
    }

    private BigDecimal averageStock(List<Product> products) {
        if (products.isEmpty()) {
            return BigDecimal.ZERO;
        }
        BigDecimal total = products.stream()
                .map(product -> BigDecimal.valueOf(safeStock(product)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.divide(BigDecimal.valueOf(products.size()), 2, RoundingMode.HALF_UP);
    }

    private int safeStock(Product product) {
        return product.getStock() == null ? 0 : product.getStock();
    }

    private BigDecimal percent(BigDecimal value, BigDecimal total) {
        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return value.multiply(BigDecimal.valueOf(100)).divide(total, 2, RoundingMode.HALF_UP);
    }

    private BigDecimal money(BigDecimal value) {
        return (value == null ? BigDecimal.ZERO : value).setScale(2, RoundingMode.HALF_UP);
    }
}
