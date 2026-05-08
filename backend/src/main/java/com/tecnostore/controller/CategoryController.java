package com.tecnostore.controller;

import com.tecnostore.dto.CategoryRequest;
import com.tecnostore.model.Category;
import com.tecnostore.model.Role;
import com.tecnostore.service.CategoryService;
import jakarta.validation.Valid;
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
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> findAll() {
        return categoryService.findAll();
    }

    @PostMapping
    public Category create(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @Valid @RequestBody CategoryRequest request
    ) {
        requireAdmin(role);
        return categoryService.create(request);
    }

    @PutMapping("/{id}")
    public Category update(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        requireAdmin(role);
        return categoryService.update(id, request);
    }

    private void requireAdmin(String role) {
        if (!Role.ADMIN.name().equalsIgnoreCase(role)) {
            throw new SecurityException("Solo el administrador puede modificar categorias");
        }
    }
}
