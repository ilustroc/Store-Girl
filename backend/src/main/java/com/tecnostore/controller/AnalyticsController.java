package com.tecnostore.controller;

import com.tecnostore.dto.CartEventRequest;
import com.tecnostore.dto.PerformanceLogRequest;
import com.tecnostore.dto.SiteVisitRequest;
import com.tecnostore.service.AnalyticsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping("/visit")
    public Map<String, String> visit(@Valid @RequestBody SiteVisitRequest request) {
        analyticsService.registerVisit(request);
        return Map.of("status", "ok");
    }

    @PostMapping("/performance")
    public Map<String, String> performance(@Valid @RequestBody PerformanceLogRequest request) {
        analyticsService.registerPerformance(request);
        return Map.of("status", "ok");
    }

    @PostMapping("/cart")
    public Map<String, String> cart(@Valid @RequestBody CartEventRequest request) {
        analyticsService.registerCart(request);
        return Map.of("status", "ok");
    }
}
