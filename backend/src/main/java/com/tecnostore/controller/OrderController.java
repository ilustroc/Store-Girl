package com.tecnostore.controller;

import com.tecnostore.dto.OrderRequest;
import com.tecnostore.model.Order;
import com.tecnostore.model.Role;
import com.tecnostore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order create(@Valid @RequestBody OrderRequest request) {
        return orderService.create(request);
    }

    @GetMapping
    public List<Order> findAll(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!Role.ADMIN.name().equalsIgnoreCase(role)) {
            throw new SecurityException("Solo el administrador puede ver todos los pedidos");
        }
        return orderService.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Order> findByUser(@PathVariable Long userId) {
        return orderService.findByUser(userId);
    }
}
