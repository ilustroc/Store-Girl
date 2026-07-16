package com.tecnostore.controller;

import com.tecnostore.dto.AdminIndicatorsResponse;
import com.tecnostore.service.AdminIndicatorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminIndicatorController {
    private final AdminIndicatorService adminIndicatorService;

    public AdminIndicatorController(AdminIndicatorService adminIndicatorService) {
        this.adminIndicatorService = adminIndicatorService;
    }

    @GetMapping("/indicators")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminIndicatorsResponse indicators() {
        return adminIndicatorService.getIndicators();
    }
}
