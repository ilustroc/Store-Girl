package com.tecnostore;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

final class ApiServer {
    private final ProductRepository productRepository = new ProductRepository();
    private final UserRepository userRepository = new UserRepository();
    private final OrderRepository orderRepository = new OrderRepository();

    void start(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api", this::handle);
        server.setExecutor(null);
        server.start();
        System.out.println("Tecno Store API escuchando en http://localhost:" + port + "/api");
    }

    private void handle(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        try {
            String method = exchange.getRequestMethod().toUpperCase();
            List<String> parts = pathParts(exchange);
            if (parts.isEmpty()) {
                sendJson(exchange, 200, Map.of("message", "Tecno Store API"));
                return;
            }

            switch (parts.get(0)) {
                case "health" -> sendJson(exchange, 200, Map.of("status", "ok"));
                case "products" -> handleProducts(exchange, method, parts);
                case "auth" -> handleAuth(exchange, method, parts);
                case "users" -> handleUsers(exchange, method);
                case "orders" -> handleOrders(exchange, method, parts);
                default -> sendError(exchange, 404, "Ruta no encontrada");
            }
        } catch (IllegalArgumentException exception) {
            sendError(exchange, 400, exception.getMessage());
        } catch (RepositoryException exception) {
            sendError(exchange, 500, exception.getMessage());
        } catch (IOException exception) {
            // El navegador puede cerrar conexiones keep-alive durante recargas.
        } catch (Exception exception) {
            exception.printStackTrace();
            sendError(exchange, 500, "Error interno del servidor");
        }
    }

    private void handleProducts(HttpExchange exchange, String method, List<String> parts) throws IOException {
        if ("GET".equals(method) && parts.size() == 1) {
            List<Map<String, Object>> products = productRepository.findAll(false).stream()
                    .map(Product::toMap)
                    .toList();
            sendJson(exchange, 200, Map.of("data", products));
            return;
        }

        if ("POST".equals(method) && parts.size() == 1) {
            requireAdmin(exchange);
            Product created = productRepository.create(productInput(readJson(exchange)));
            sendJson(exchange, 201, Map.of("data", created.toMap()));
            return;
        }

        if (parts.size() == 2) {
            long id = parseId(parts.get(1));
            switch (method) {
                case "GET" -> productRepository.findById(id)
                        .filter(Product::active)
                        .map(Product::toMap)
                        .ifPresentOrElse(
                                product -> sendJsonUnchecked(exchange, 200, Map.of("data", product)),
                                () -> sendErrorUnchecked(exchange, 404, "Producto no encontrado")
                        );
                case "PUT" -> {
                    requireAdmin(exchange);
                    productRepository.update(id, productInput(readJson(exchange)))
                            .map(Product::toMap)
                            .ifPresentOrElse(
                                    product -> sendJsonUnchecked(exchange, 200, Map.of("data", product)),
                                    () -> sendErrorUnchecked(exchange, 404, "Producto no encontrado")
                            );
                }
                case "DELETE" -> {
                    requireAdmin(exchange);
                    if (productRepository.softDelete(id)) {
                        sendJson(exchange, 200, Map.of("message", "Producto eliminado"));
                    } else {
                        sendError(exchange, 404, "Producto no encontrado");
                    }
                }
                default -> sendError(exchange, 405, "Metodo no permitido");
            }
            return;
        }

        sendError(exchange, 404, "Ruta de productos no encontrada");
    }

    private void handleAuth(HttpExchange exchange, String method, List<String> parts) throws IOException {
        if (!"POST".equals(method) || parts.size() != 2) {
            sendError(exchange, 405, "Metodo no permitido");
            return;
        }

        Map<String, Object> body = readJson(exchange);
        switch (parts.get(1)) {
            case "login" -> {
                String email = requiredText(body, "email");
                String password = requiredText(body, "password");
                userRepository.login(email, password)
                        .map(AppUser::toSafeMap)
                        .ifPresentOrElse(
                                user -> sendJsonUnchecked(exchange, 200, Map.of("user", user, "message", "Sesion iniciada")),
                                () -> sendErrorUnchecked(exchange, 401, "Credenciales incorrectas")
                        );
            }
            case "register" -> {
                AppUser created = userRepository.create(
                        requiredText(body, "fullName"),
                        requiredText(body, "email"),
                        requiredText(body, "password"),
                        optionalText(body, "phone")
                );
                sendJson(exchange, 201, Map.of("user", created.toSafeMap(), "message", "Usuario registrado"));
            }
            default -> sendError(exchange, 404, "Ruta de autenticacion no encontrada");
        }
    }

    private void handleUsers(HttpExchange exchange, String method) throws IOException {
        if (!"GET".equals(method)) {
            sendError(exchange, 405, "Metodo no permitido");
            return;
        }
        requireAdmin(exchange);
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(AppUser::toSafeMap)
                .toList();
        sendJson(exchange, 200, Map.of("data", users));
    }

    @SuppressWarnings("unchecked")
    private void handleOrders(HttpExchange exchange, String method, List<String> parts) throws IOException {
        if ("GET".equals(method) && parts.size() == 1) {
            Map<String, String> query = queryParams(exchange);
            boolean admin = isAdmin(exchange);
            String email = query.get("email");
            List<StoreOrder> orders = admin && (email == null || email.isBlank())
                    ? orderRepository.findAll()
                    : orderRepository.findByEmail(required(email, "email"));
            sendJson(exchange, 200, Map.of("data", orders.stream().map(StoreOrder::toMap).toList()));
            return;
        }

        if ("POST".equals(method) && parts.size() == 1) {
            Map<String, Object> body = readJson(exchange);
            long userId = longValue(body.get("userId"));
            Object rawItems = body.get("items");
            if (!(rawItems instanceof List<?> list)) {
                throw new IllegalArgumentException("items es obligatorio");
            }
            StoreOrder created = orderRepository.create(userId, (List<Map<String, Object>>) (List<?>) list);
            sendJson(exchange, 201, Map.of("data", created.toMap()));
            return;
        }

        if ("PATCH".equals(method) && parts.size() == 3 && "status".equals(parts.get(2))) {
            requireAdmin(exchange);
            String orderNumber = parts.get(1);
            String status = requiredText(readJson(exchange), "status");
            if (orderRepository.updateStatus(orderNumber, status)) {
                sendJson(exchange, 200, Map.of("message", "Estado actualizado"));
            } else {
                sendError(exchange, 404, "Pedido no encontrado");
            }
            return;
        }

        sendError(exchange, 404, "Ruta de pedidos no encontrada");
    }

    private ProductInput productInput(Map<String, Object> body) {
        return new ProductInput(
                requiredText(body, "name"),
                requiredText(body, "description"),
                requiredText(body, "category"),
                bigDecimal(body.get("price")),
                intValue(body.getOrDefault("stock", 0)),
                optionalText(body, "imageUrl")
        );
    }

    private void requireAdmin(HttpExchange exchange) {
        if (!isAdmin(exchange)) {
            throw new IllegalArgumentException("Acceso permitido solo para administrador");
        }
    }

    private boolean isAdmin(HttpExchange exchange) {
        String role = exchange.getRequestHeaders().getFirst("X-User-Role");
        return "admin".equalsIgnoreCase(role);
    }

    private Map<String, Object> readJson(HttpExchange exchange) throws IOException {
        String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        if (body.isBlank()) {
            return new LinkedHashMap<>();
        }
        return Json.parseObject(body);
    }

    private List<String> pathParts(HttpExchange exchange) {
        String path = exchange.getRequestURI().getPath();
        String relative = path.replaceFirst("^/api/?", "");
        if (relative.isBlank()) {
            return List.of();
        }
        return Arrays.stream(relative.split("/"))
                .filter(part -> !part.isBlank())
                .map(this::decode)
                .toList();
    }

    private Map<String, String> queryParams(HttpExchange exchange) {
        Map<String, String> params = new LinkedHashMap<>();
        String rawQuery = exchange.getRequestURI().getRawQuery();
        if (rawQuery == null || rawQuery.isBlank()) {
            return params;
        }
        for (String pair : rawQuery.split("&")) {
            String[] pieces = pair.split("=", 2);
            String key = decode(pieces[0]);
            String value = pieces.length > 1 ? decode(pieces[1]) : "";
            params.put(key, value);
        }
        return params;
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type,X-User-Role");
    }

    private void sendJson(HttpExchange exchange, int status, Object body) throws IOException {
        byte[] bytes = Json.stringify(body).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }

    private void sendError(HttpExchange exchange, int status, String message) throws IOException {
        sendJson(exchange, status, Map.of("error", message));
    }

    private void sendJsonUnchecked(HttpExchange exchange, int status, Object body) {
        try {
            sendJson(exchange, status, body);
        } catch (IOException exception) {
            throw new RepositoryException("No se pudo enviar la respuesta", exception);
        }
    }

    private void sendErrorUnchecked(HttpExchange exchange, int status, String message) {
        try {
            sendError(exchange, status, message);
        } catch (IOException exception) {
            throw new RepositoryException("No se pudo enviar la respuesta", exception);
        }
    }

    private String requiredText(Map<String, Object> body, String key) {
        Object value = body.get(key);
        if (value == null || String.valueOf(value).isBlank()) {
            throw new IllegalArgumentException(key + " es obligatorio");
        }
        return String.valueOf(value).trim();
    }

    private String optionalText(Map<String, Object> body, String key) {
        Object value = body.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String required(String value, String key) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(key + " es obligatorio");
        }
        return value;
    }

    private long parseId(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("ID invalido");
        }
    }

    private BigDecimal bigDecimal(Object value) {
        if (value == null || String.valueOf(value).isBlank()) {
            throw new IllegalArgumentException("price es obligatorio");
        }
        return value instanceof BigDecimal decimal ? decimal : new BigDecimal(String.valueOf(value));
    }

    private int intValue(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return Integer.parseInt(String.valueOf(value));
    }

    private long longValue(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return Long.parseLong(String.valueOf(value));
    }
}
