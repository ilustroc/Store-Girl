package com.tecnostore.service;

import com.tecnostore.dto.CartEventRequest;
import com.tecnostore.dto.PerformanceLogRequest;
import com.tecnostore.dto.SiteVisitRequest;
import com.tecnostore.model.Cart;
import com.tecnostore.model.PerformanceLog;
import com.tecnostore.model.SiteVisit;
import com.tecnostore.repository.CartRepository;
import com.tecnostore.repository.PerformanceLogRepository;
import com.tecnostore.repository.SiteVisitRepository;
import com.tecnostore.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
public class AnalyticsService {
    private static final Set<String> CART_STATUSES = Set.of("ACTIVE", "COMPLETED", "ABANDONED");

    private final SiteVisitRepository siteVisitRepository;
    private final PerformanceLogRepository performanceLogRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public AnalyticsService(
            SiteVisitRepository siteVisitRepository,
            PerformanceLogRepository performanceLogRepository,
            CartRepository cartRepository,
            UserRepository userRepository
    ) {
        this.siteVisitRepository = siteVisitRepository;
        this.performanceLogRepository = performanceLogRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    public void registerVisit(SiteVisitRequest request) {
        SiteVisit visit = new SiteVisit();
        visit.setSessionId(request.sessionId().trim());
        visit.setPage(request.page().trim());
        visit.setSource(request.source() == null || request.source().isBlank() ? "web" : request.source().trim());
        visit.setVisitedAt(LocalDateTime.now());
        siteVisitRepository.save(visit);
    }

    public void registerPerformance(PerformanceLogRequest request) {
        PerformanceLog log = new PerformanceLog();
        log.setPage(request.page().trim());
        log.setLoadTimeMs(request.loadTimeMs());
        log.setCreatedAt(LocalDateTime.now());
        performanceLogRepository.save(log);
    }

    public void registerCart(CartEventRequest request) {
        String status = request.status().trim().toUpperCase();
        if (!CART_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Estado de carrito no valido");
        }

        Cart cart = cartRepository.findFirstBySessionIdOrderByUpdatedAtDesc(request.sessionId())
                .orElseGet(Cart::new);
        cart.setSessionId(request.sessionId().trim());
        cart.setStatus(status);
        cart.setUpdatedAt(LocalDateTime.now());
        if (request.userId() != null) {
            userRepository.findById(request.userId()).ifPresent(cart::setUser);
        }
        cartRepository.save(cart);
    }
}
