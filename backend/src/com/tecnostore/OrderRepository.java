package com.tecnostore;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

final class OrderRepository {
    private final ProductRepository productRepository = new ProductRepository();
    private final UserRepository userRepository = new UserRepository();

    List<StoreOrder> findAll() {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM sales_orders ORDER BY created_at DESC");
             ResultSet resultSet = statement.executeQuery()) {
            List<StoreOrder> orders = new ArrayList<>();
            while (resultSet.next()) {
                orders.add(toOrder(connection, resultSet));
            }
            return orders;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudieron obtener los pedidos", exception);
        }
    }

    List<StoreOrder> findByEmail(String email) {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     SELECT * FROM sales_orders
                     WHERE LOWER(customer_email) = LOWER(?)
                     ORDER BY created_at DESC
                     """)) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                List<StoreOrder> orders = new ArrayList<>();
                while (resultSet.next()) {
                    orders.add(toOrder(connection, resultSet));
                }
                return orders;
            }
        } catch (Exception exception) {
            throw new RepositoryException("No se pudieron obtener los pedidos del usuario", exception);
        }
    }

    Optional<StoreOrder> findByOrderNumber(String orderNumber) {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM sales_orders WHERE order_number = ?")) {
            statement.setString(1, orderNumber);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return Optional.of(toOrder(connection, resultSet));
                }
                return Optional.empty();
            }
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo obtener el pedido", exception);
        }
    }

    StoreOrder create(long userId, List<Map<String, Object>> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("El pedido debe tener productos");
        }

        try (Connection connection = Database.getConnection()) {
            connection.setAutoCommit(false);
            try {
                AppUser user = userRepository.findById(connection, userId)
                        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

                List<OrderLine> lines = new ArrayList<>();
                BigDecimal subtotal = BigDecimal.ZERO;
                for (Map<String, Object> item : items) {
                    long productId = longValue(item.get("productId"));
                    int quantity = intValue(item.get("quantity"));
                    if (quantity <= 0) {
                        throw new IllegalArgumentException("Cantidad invalida");
                    }
                    Product product = productRepository.findById(connection, productId)
                            .filter(Product::active)
                            .orElseThrow(() -> new IllegalArgumentException("Producto no disponible: " + productId));
                    if (product.stock() < quantity) {
                        throw new IllegalArgumentException("Stock insuficiente para " + product.name());
                    }
                    BigDecimal lineSubtotal = product.price().multiply(BigDecimal.valueOf(quantity));
                    subtotal = subtotal.add(lineSubtotal);
                    lines.add(new OrderLine(product, quantity, lineSubtotal));
                }

                BigDecimal shipping = subtotal.compareTo(new BigDecimal("500.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("20.00");
                BigDecimal total = subtotal.add(shipping);
                String orderNumber = generateOrderNumber();
                long orderId;

                try (PreparedStatement statement = connection.prepareStatement("""
                        INSERT INTO sales_orders (order_number, user_id, customer_name, customer_email, status, subtotal, shipping, total)
                        VALUES (?, ?, ?, ?, 'Procesando', ?, ?, ?)
                        """, Statement.RETURN_GENERATED_KEYS)) {
                    statement.setString(1, orderNumber);
                    statement.setLong(2, user.id());
                    statement.setString(3, user.fullName());
                    statement.setString(4, user.email());
                    statement.setBigDecimal(5, subtotal);
                    statement.setBigDecimal(6, shipping);
                    statement.setBigDecimal(7, total);
                    statement.executeUpdate();
                    try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                        generatedKeys.next();
                        orderId = generatedKeys.getLong(1);
                    }
                }

                for (OrderLine line : lines) {
                    insertOrderItem(connection, orderId, line);
                    productRepository.decreaseStock(connection, line.product().id(), line.quantity());
                }

                connection.commit();
                return findByOrderNumber(orderNumber).orElseThrow();
            } catch (RuntimeException exception) {
                connection.rollback();
                throw exception;
            } catch (Exception exception) {
                connection.rollback();
                throw new RepositoryException("No se pudo crear el pedido", exception);
            } finally {
                connection.setAutoCommit(true);
            }
        } catch (IllegalArgumentException | RepositoryException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo crear el pedido", exception);
        }
    }

    boolean updateStatus(String orderNumber, String status) {
        if (!List.of("Procesando", "Enviado", "Entregado", "Cancelado").contains(status)) {
            throw new IllegalArgumentException("Estado no permitido");
        }
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("UPDATE sales_orders SET status = ? WHERE order_number = ?")) {
            statement.setString(1, status);
            statement.setString(2, orderNumber);
            return statement.executeUpdate() > 0;
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo actualizar el pedido", exception);
        }
    }

    private void insertOrderItem(Connection connection, long orderId, OrderLine line) throws Exception {
        try (PreparedStatement statement = connection.prepareStatement("""
                INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)
                """)) {
            statement.setLong(1, orderId);
            statement.setLong(2, line.product().id());
            statement.setString(3, line.product().name());
            statement.setBigDecimal(4, line.product().price());
            statement.setInt(5, line.quantity());
            statement.setBigDecimal(6, line.subtotal());
            statement.executeUpdate();
        }
    }

    private StoreOrder toOrder(Connection connection, ResultSet resultSet) throws Exception {
        long orderId = resultSet.getLong("id");
        Timestamp createdAt = resultSet.getTimestamp("created_at");
        return new StoreOrder(
                orderId,
                resultSet.getString("order_number"),
                resultSet.getLong("user_id"),
                resultSet.getString("customer_name"),
                resultSet.getString("customer_email"),
                resultSet.getString("status"),
                resultSet.getBigDecimal("subtotal"),
                resultSet.getBigDecimal("shipping"),
                resultSet.getBigDecimal("total"),
                createdAt == null ? "" : createdAt.toInstant().toString(),
                findItems(connection, orderId)
        );
    }

    private List<OrderItem> findItems(Connection connection, long orderId) throws Exception {
        try (PreparedStatement statement = connection.prepareStatement("SELECT * FROM order_items WHERE order_id = ? ORDER BY id")) {
            statement.setLong(1, orderId);
            try (ResultSet resultSet = statement.executeQuery()) {
                List<OrderItem> items = new ArrayList<>();
                while (resultSet.next()) {
                    items.add(new OrderItem(
                            resultSet.getLong("id"),
                            resultSet.getLong("product_id"),
                            resultSet.getString("product_name"),
                            resultSet.getBigDecimal("unit_price"),
                            resultSet.getInt("quantity"),
                            resultSet.getBigDecimal("subtotal")
                    ));
                }
                return items;
            }
        }
    }

    private String generateOrderNumber() {
        int random = ThreadLocalRandom.current().nextInt(100, 1000);
        return "PED-" + System.currentTimeMillis() + "-" + random;
    }

    private long longValue(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return Long.parseLong(String.valueOf(value));
    }

    private int intValue(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return Integer.parseInt(String.valueOf(value));
    }

    private record OrderLine(Product product, int quantity, BigDecimal subtotal) {
    }
}
