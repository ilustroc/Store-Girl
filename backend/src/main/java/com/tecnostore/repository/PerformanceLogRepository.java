package com.tecnostore.repository;

import com.tecnostore.model.PerformanceLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceLogRepository extends JpaRepository<PerformanceLog, Long> {
    List<PerformanceLog> findByPageOrderByCreatedAtDesc(String page);
}
