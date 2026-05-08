package com.tecnostore;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

final class ProductRepository {
    List<Product> findAll(boolean includeInactive) {
        String sql = includeInactive
                ? "SELECT * FROM products ORDER BY id DESC"
                : "SELECT * FROM products WHERE active = TRUE ORDER BY id DESC";
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            List<Product> products = new ArrayList<>();
            while (resultSet.next()) {
                products.add(toProduct(resultSet));
            }
            return products;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudieron obtener los productos", exception);
        }
    }

    Optional<Product> findById(long id) {
        try (Connection connection = Database.getConnection()) {
            return findById(connection, id);
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo obtener el producto", exception);
        }
    }

    Optional<Product> findById(Connection connection, long id) {
        try (PreparedStatement statement = connection.prepareStatement("SELECT * FROM products WHERE id = ?")) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return Optional.of(toProduct(resultSet));
                }
                return Optional.empty();
            }
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo obtener el producto", exception);
        }
    }

    Product create(ProductInput input) {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     INSERT INTO products (name, description, category, price, stock, image_url, active)
                     VALUES (?, ?, ?, ?, ?, ?, TRUE)
                     """, Statement.RETURN_GENERATED_KEYS)) {
            bindInput(statement, input);
            statement.executeUpdate();
            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                generatedKeys.next();
                return findById(generatedKeys.getLong(1)).orElseThrow();
            }
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo crear el producto", exception);
        }
    }

    Optional<Product> update(long id, ProductInput input) {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     UPDATE products
                     SET name = ?, description = ?, category = ?, price = ?, stock = ?, image_url = ?
                     WHERE id = ?
                     """)) {
            bindInput(statement, input);
            statement.setLong(7, id);
            int updated = statement.executeUpdate();
            if (updated == 0) {
                return Optional.empty();
            }
            return findById(id);
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo actualizar el producto", exception);
        }
    }

    boolean softDelete(long id) {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("UPDATE products SET active = FALSE WHERE id = ?")) {
            statement.setLong(1, id);
            return statement.executeUpdate() > 0;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo eliminar el producto", exception);
        }
    }

    void decreaseStock(Connection connection, long productId, int quantity) {
        try (PreparedStatement statement = connection.prepareStatement("""
                UPDATE products
                SET stock = stock - ?
                WHERE id = ? AND stock >= ?
                """)) {
            statement.setInt(1, quantity);
            statement.setLong(2, productId);
            statement.setInt(3, quantity);
            if (statement.executeUpdate() == 0) {
                throw new IllegalArgumentException("Stock insuficiente para el producto " + productId);
            }
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo actualizar el stock", exception);
        }
    }

    private void bindInput(PreparedStatement statement, ProductInput input) throws Exception {
        statement.setString(1, input.name());
        statement.setString(2, input.description());
        statement.setString(3, input.category());
        statement.setBigDecimal(4, input.price());
        statement.setInt(5, input.stock());
        statement.setString(6, input.imageUrl());
    }

    private Product toProduct(ResultSet resultSet) throws Exception {
        return new Product(
                resultSet.getLong("id"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getString("category"),
                resultSet.getBigDecimal("price"),
                resultSet.getInt("stock"),
                resultSet.getString("image_url"),
                resultSet.getBoolean("active")
        );
    }
}
