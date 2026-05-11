package com.tecnostore.controller;

import com.tecnostore.dto.AdminDashboardResponse;
import com.tecnostore.model.Role;
import com.tecnostore.service.AdminDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminDashboardService adminDashboardService;

    public AdminController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard(@RequestHeader(value = "X-User-Role", required = false) String role) {
        requireAdmin(role);
        return adminDashboardService.getSummary();
    }

    private void requireAdmin(String role) {
        if (!Role.ADMIN.name().equalsIgnoreCase(role)) {
            throw new SecurityException("Solo el administrador puede ver el panel de control");
        }
    }
}
