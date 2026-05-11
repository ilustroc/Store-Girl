package com.tecnostore.repository;

import com.tecnostore.model.StockAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {
    long countByStatusIgnoreCase(String status);

    List<StockAlert> findTop5ByOrderByCreatedAtDesc();
}
