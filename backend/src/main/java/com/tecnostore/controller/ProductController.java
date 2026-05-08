package com.tecnostore.controller;

import com.tecnostore.dto.ProductRequest;
import com.tecnostore.model.Product;
import com.tecnostore.model.Role;
import com.tecnostore.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> findAll() {
        return productService.findAll();
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
    public Product create(@RequestHeader(value = "X-User-Role", required = false) String role, @Valid @RequestBody ProductRequest request) {
        requireAdmin(role);
        return productService.create(request);
    }

    @PutMapping("/{id}")
    public Product update(@RequestHeader(value = "X-User-Role", required = false) String role, @PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        requireAdmin(role);
        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@RequestHeader(value = "X-User-Role", required = false) String role, @PathVariable Long id) {
        requireAdmin(role);
        productService.delete(id);
    }

    private void requireAdmin(String role) {
        if (!Role.ADMIN.name().equalsIgnoreCase(role)) {
            throw new SecurityException("Solo el administrador puede modificar productos");
        }
    }
}
