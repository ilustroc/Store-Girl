package com.tecnostore.controller;

import com.tecnostore.dto.AdminIndicatorsResponse;
import com.tecnostore.model.Role;
import com.tecnostore.service.AdminIndicatorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
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
    public AdminIndicatorsResponse indicators(@RequestHeader(value = "X-User-Role", required = false) String role) {
        requireAdmin(role);
        return adminIndicatorService.getIndicators();
    }

    private void requireAdmin(String role) {
        if (!Role.ADMIN.name().equalsIgnoreCase(role)) {
            throw new SecurityException("Solo el administrador puede ver los indicadores");
        }
    }
}
