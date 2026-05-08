package com.tecnostore;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

record Product(
        long id,
        String name,
        String description,
        String category,
        BigDecimal price,
        int stock,
        String imageUrl,
        boolean active
) {
    Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("description", description);
        map.put("category", category);
        map.put("price", price);
        map.put("stock", stock);
        map.put("imageUrl", imageUrl);
        map.put("active", active);
        return map;
    }
}

record ProductInput(
        String name,
        String description,
        String category,
        BigDecimal price,
        int stock,
        String imageUrl
) {
}

record AppUser(
        long id,
        String fullName,
        String email,
        String password,
        String role,
        String phone,
        String createdAt
) {
    Map<String, Object> toSafeMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("fullName", fullName);
        map.put("email", email);
        map.put("role", role);
        map.put("phone", phone);
        map.put("createdAt", createdAt);
        return map;
    }
}

record OrderItem(
        long id,
        long productId,
        String productName,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal subtotal
) {
    Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("productId", productId);
        map.put("productName", productName);
        map.put("unitPrice", unitPrice);
        map.put("quantity", quantity);
        map.put("subtotal", subtotal);
        return map;
    }
}

record StoreOrder(
        long id,
        String orderNumber,
        long userId,
        String customerName,
        String customerEmail,
        String status,
        BigDecimal subtotal,
        BigDecimal shipping,
        BigDecimal total,
        String createdAt,
        List<OrderItem> items
) {
    Map<String, Object> toMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("orderNumber", orderNumber);
        map.put("userId", userId);
        map.put("customerName", customerName);
        map.put("customerEmail", customerEmail);
        map.put("status", status);
        map.put("subtotal", subtotal);
        map.put("shipping", shipping);
        map.put("total", total);
        map.put("createdAt", createdAt);
        map.put("items", items.stream().map(OrderItem::toMap).toList());
        return map;
    }
}
