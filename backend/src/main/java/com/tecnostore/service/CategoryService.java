package com.tecnostore.service;

import com.tecnostore.dto.CategoryRequest;
import com.tecnostore.model.Category;
import com.tecnostore.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAllByOrderByNameAsc();
    }

    public Category create(CategoryRequest request) {
        String name = normalizeName(request.name());
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Ya existe una categoria con ese nombre");
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(normalizeDescription(request.description()));
        return categoryRepository.save(category);
    }

    public Category update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada"));
        String name = normalizeName(request.name());
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new IllegalArgumentException("Ya existe una categoria con ese nombre");
        }

        category.setName(name);
        category.setDescription(normalizeDescription(request.description()));
        return categoryRepository.save(category);
    }

    private String normalizeName(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeDescription(String value) {
        String description = value == null ? "" : value.trim();
        return description.isBlank() ? null : description;
    }
}
