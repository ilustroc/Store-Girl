package com.tecnostore.repository;

import com.tecnostore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrueOrderByIdDesc();

    List<Product> findByCategoryIdAndActiveTrueOrderByIdDesc(Long categoryId);

    long countByActiveTrue();

    long countByActiveTrueAndStockLessThanEqual(Integer stock);

    List<Product> findTop5ByActiveTrueAndStockLessThanEqualOrderByStockAscNameAsc(Integer stock);
}
