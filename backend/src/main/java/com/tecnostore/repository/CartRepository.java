package com.tecnostore.repository;

import com.tecnostore.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findFirstBySessionIdOrderByUpdatedAtDesc(String sessionId);
}
