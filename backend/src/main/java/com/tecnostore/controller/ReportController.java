package com.tecnostore.controller;

import com.tecnostore.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/{type}")
    public Map<String, Object> report(@PathVariable String type, @RequestParam Map<String, String> filters) {
        return reportService.build(type, filters);
    }

    @GetMapping("/{type}/xlsx")
    public ResponseEntity<byte[]> xlsx(@PathVariable String type, @RequestParam Map<String, String> filters) {
        byte[] file = reportService.exportXlsx(type, filters);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + reportService.filename(type, filters, "xlsx") + "\"")
                .body(file);
    }

    @GetMapping("/{type}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String type, @RequestParam Map<String, String> filters) {
        byte[] file = reportService.exportPdf(type, filters);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + reportService.filename(type, filters, "pdf") + "\"")
                .body(file);
    }
}
