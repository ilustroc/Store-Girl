package com.tecnostore.service;

import com.tecnostore.dto.ProductRequest;
import com.tecnostore.model.Category;
import com.tecnostore.model.Product;
import com.tecnostore.repository.CategoryRepository;
import com.tecnostore.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AuditService auditService;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, AuditService auditService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.auditService = auditService;
    }

    public List<Product> findAll(boolean includeInactive) {
        return includeInactive
                ? productRepository.findAllByOrderByIdDesc()
                : productRepository.findByActiveTrueOrderByIdDesc();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .filter(Product::getActive)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
    }

    public List<Product> findByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrueOrderByIdDesc(categoryId);
    }

    public Product create(ProductRequest request) {
        String name = normalizeName(request.name());
        if (productRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Ya existe un producto con ese nombre");
        }
        Product product = new Product();
        fillProduct(product, request, name);
        product.setActive(true);
        Product saved = productRepository.save(product);
        auditService.log("PRODUCT_CREATED", "Product", saved.getId(), "Producto creado: " + saved.getName());
        return saved;
    }

    public Product update(Long id, ProductRequest request) {
        Product product = findExisting(id);
        String name = normalizeName(request.name());
        if (productRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new IllegalArgumentException("Ya existe un producto con ese nombre");
        }
        fillProduct(product, request, name);
        Product saved = productRepository.save(product);
        auditService.log("PRODUCT_UPDATED", "Product", saved.getId(), "Producto actualizado: " + saved.getName());
        return saved;
    }

    public void delete(Long id) {
        Product product = findExisting(id);
        product.setActive(false);
        productRepository.save(product);
        auditService.log("PRODUCT_DISABLED", "Product", product.getId(), "Producto desactivado: " + product.getName());
    }

    public Product updateStatus(Long id, boolean active) {
        Product product = findExisting(id);
        product.setActive(active);
        Product saved = productRepository.save(product);
        auditService.log(active ? "PRODUCT_ENABLED" : "PRODUCT_DISABLED", "Product", saved.getId(), "Cambio de estado: " + saved.getName());
        return saved;
    }

    private Product findExisting(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
    }

    private void fillProduct(Product product, ProductRequest request, String name) {
        Category category = categoryRepository.findById(request.categoryId())
                .filter(Category::getActive)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada o inactiva"));
        product.setName(name);
        product.setDescription(request.description().trim());
        product.setCategory(category);
        product.setPrice(request.price());
        product.setCostPrice(request.costPrice() == null ? BigDecimal.ZERO : request.costPrice());
        product.setStock(request.stock());
        product.setImage(request.image() == null || request.image().isBlank() ? null : request.image().trim());
    }

    private String normalizeName(String value) {
        return value == null ? "" : value.trim();
    }
}
