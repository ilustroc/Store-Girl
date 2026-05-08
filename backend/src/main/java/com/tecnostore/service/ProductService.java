package com.tecnostore.service;

import com.tecnostore.dto.ProductRequest;
import com.tecnostore.model.Category;
import com.tecnostore.model.Product;
import com.tecnostore.repository.CategoryRepository;
import com.tecnostore.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> findAll() {
        return productRepository.findByActiveTrueOrderByIdDesc();
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
        Product product = new Product();
        fillProduct(product, request);
        product.setActive(true);
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest request) {
        Product product = findById(id);
        fillProduct(product, request);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = findById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    private void fillProduct(Product product, ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada"));
        product.setName(request.name());
        product.setDescription(request.description());
        product.setCategory(category);
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setImage(request.image());
    }
}
