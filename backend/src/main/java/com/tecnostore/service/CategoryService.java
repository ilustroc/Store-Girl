package com.tecnostore.service;

import com.tecnostore.dto.CategoryRequest;
import com.tecnostore.model.Category;
import com.tecnostore.repository.CategoryRepository;
import com.tecnostore.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AuditService auditService;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository, AuditService auditService) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.auditService = auditService;
    }

    public List<Category> findAll(boolean includeInactive) {
        return includeInactive
                ? categoryRepository.findAllByOrderByNameAsc()
                : categoryRepository.findByActiveTrueOrderByNameAsc();
    }

    public Category create(CategoryRequest request) {
        String name = normalizeName(request.name());
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Ya existe una categoria con ese nombre");
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(normalizeDescription(request.description()));
        category.setActive(true);
        Category saved = categoryRepository.save(category);
        auditService.log("CATEGORY_CREATED", "Category", saved.getId(), "Categoria creada: " + saved.getName());
        return saved;
    }

    public Category update(Long id, CategoryRequest request) {
        Category category = findExisting(id);
        String name = normalizeName(request.name());
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new IllegalArgumentException("Ya existe una categoria con ese nombre");
        }

        category.setName(name);
        category.setDescription(normalizeDescription(request.description()));
        Category saved = categoryRepository.save(category);
        auditService.log("CATEGORY_UPDATED", "Category", saved.getId(), "Categoria actualizada: " + saved.getName());
        return saved;
    }

    public Category updateStatus(Long id, boolean active) {
        Category category = findExisting(id);
        if (!active && productRepository.countByCategoryIdAndActiveTrue(id) > 0) {
            throw new IllegalArgumentException("No se puede desactivar una categoria con productos activos");
        }
        category.setActive(active);
        Category saved = categoryRepository.save(category);
        auditService.log(active ? "CATEGORY_ENABLED" : "CATEGORY_DISABLED", "Category", saved.getId(), "Cambio de estado: " + saved.getName());
        return saved;
    }

    public void delete(Long id) {
        updateStatus(id, false);
    }

    private Category findExisting(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada"));
    }

    private String normalizeName(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeDescription(String value) {
        String description = value == null ? "" : value.trim();
        return description.isBlank() ? null : description;
    }
}
