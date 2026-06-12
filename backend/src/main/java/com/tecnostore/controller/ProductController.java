package com.tecnostore.controller;

import com.tecnostore.dto.ProductRequest;
import com.tecnostore.model.Product;
import com.tecnostore.model.Role;
import com.tecnostore.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> findAll(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestParam(defaultValue = "false") boolean includeInactive
    ) {
        if (includeInactive) {
            requireAdmin(role);
        }
        return productService.findAll(includeInactive);
    }

    @GetMapping("/{id}")
    public Product findById(@PathVariable Long id) {
        return productService.findById(id);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> findByCategory(@PathVariable Long categoryId) {
        return productService.findByCategory(categoryId);
    }

    @PostMapping
    public Product create(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @Valid @RequestBody ProductRequest request
    ) {
        requireAdmin(role);
        return productService.create(request);
    }

    @PutMapping("/{id}")
    public Product update(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        requireAdmin(role);
        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id
    ) {
        requireAdmin(role);
        productService.delete(id);
    }

    @PutMapping("/{id}/status")
    public Product updateStatus(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request
    ) {
        requireAdmin(role);
        Boolean active = request.get("active");
        if (active == null) {
            throw new IllegalArgumentException("Indica el estado del producto");
        }
        return productService.updateStatus(id, active);
    }

    private void requireAdmin(String role) {
        if (!Role.ADMIN.name().equalsIgnoreCase(role)) {
            throw new SecurityException("Solo el administrador puede modificar productos");
        }
    }
}
