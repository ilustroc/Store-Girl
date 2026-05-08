package com.tecnostore;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

final class UserRepository {
    Optional<AppUser> login(String email, String password) {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?
                     """)) {
            statement.setString(1, email);
            statement.setString(2, password);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return Optional.of(toUser(resultSet));
                }
                return Optional.empty();
            }
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo iniciar sesion", exception);
        }
    }

    Optional<AppUser> findById(Connection connection, long id) {
        try (PreparedStatement statement = connection.prepareStatement("SELECT * FROM users WHERE id = ?")) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return Optional.of(toUser(resultSet));
                }
                return Optional.empty();
            }
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo obtener el usuario", exception);
        }
    }

    List<AppUser> findAll() {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM users ORDER BY created_at DESC");
             ResultSet resultSet = statement.executeQuery()) {
            List<AppUser> users = new ArrayList<>();
            while (resultSet.next()) {
                users.add(toUser(resultSet));
            }
            return users;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudieron obtener los usuarios", exception);
        }
    }

    AppUser create(String fullName, String email, String password, String phone) {
        if (existsByEmail(email)) {
            throw new IllegalArgumentException("El correo ya esta registrado");
        }
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("""
                     INSERT INTO users (full_name, email, password, role, phone)
                     VALUES (?, ?, ?, 'usuario', ?)
                     """, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, fullName);
            statement.setString(2, email);
            statement.setString(3, password);
            statement.setString(4, phone);
            statement.executeUpdate();
            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                generatedKeys.next();
                long id = generatedKeys.getLong(1);
                try (Connection lookup = Database.getConnection()) {
                    return findById(lookup, id).orElseThrow();
                }
            }
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo registrar el usuario", exception);
        }
    }

    private boolean existsByEmail(String email) {
        try (Connection connection = Database.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT COUNT(*) FROM users WHERE LOWER(email) = LOWER(?)")) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                resultSet.next();
                return resultSet.getInt(1) > 0;
            }
        } catch (Exception exception) {
            throw new RepositoryException("No se pudo validar el correo", exception);
        }
    }

    private AppUser toUser(ResultSet resultSet) throws Exception {
        Timestamp createdAt = resultSet.getTimestamp("created_at");
        return new AppUser(
                resultSet.getLong("id"),
                resultSet.getString("full_name"),
                resultSet.getString("email"),
                resultSet.getString("password"),
                resultSet.getString("role"),
                resultSet.getString("phone"),
                createdAt == null ? "" : createdAt.toInstant().toString()
        );
    }
}
