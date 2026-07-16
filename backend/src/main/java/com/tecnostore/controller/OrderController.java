package com.tecnostore.controller;

import com.tecnostore.dto.OrderRequest;
import com.tecnostore.model.Order;
import com.tecnostore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order create(@Valid @RequestBody OrderRequest request, Authentication authentication) {
        return orderService.create(request, authentication.getName(), isAdmin(authentication));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> findAll() {
        return orderService.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Order> findByUser(@PathVariable Long userId, Authentication authentication) {
        return orderService.findByUser(userId, authentication.getName(), isAdmin(authentication));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }
}
