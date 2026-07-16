package com.tecnostore.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.tecnostore.model.*;
import com.tecnostore.repository.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockAlertRepository stockAlertRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditService auditService;

    public ReportService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            StockAlertRepository stockAlertRepository,
            AuditLogRepository auditLogRepository,
            AuditService auditService
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.stockAlertRepository = stockAlertRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> build(String type, Map<String, String> filters) {
        String normalized = normalizeType(type);
        return switch (normalized) {
            case "sales" -> salesReport(filters);
            case "orders" -> ordersReport(filters);
            case "inventory", "products" -> inventoryReport(filters, normalized);
            case "profitability" -> profitabilityReport(filters);
            case "low-stock" -> lowStockReport(filters);
            case "categories" -> categoriesReport(filters);
            case "stock-alerts" -> stockAlertsReport(filters);
            case "audit" -> auditReport();
            default -> throw new IllegalArgumentException("Tipo de reporte no soportado");
        };
    }

    @Transactional
    public byte[] exportXlsx(String type, Map<String, String> filters) {
        Map<String, Object> report = build(type, filters);
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte");
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            int rowIndex = 0;
            Row title = sheet.createRow(rowIndex++);
            title.createCell(0).setCellValue(String.valueOf(report.get("title")));
            Row generated = sheet.createRow(rowIndex++);
            generated.createCell(0).setCellValue("Generado: " + LocalDateTime.now().format(DATE_TIME_FORMAT));
            Row filtersRow = sheet.createRow(rowIndex++);
            filtersRow.createCell(0).setCellValue("Filtros: " + filterLabel(filters));
            rowIndex++;

            @SuppressWarnings("unchecked")
            List<Map<String, String>> columns = (List<Map<String, String>>) report.get("columns");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> rows = (List<Map<String, Object>>) report.get("rows");

            Row header = sheet.createRow(rowIndex++);
            for (int i = 0; i < columns.size(); i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns.get(i).get("label"));
                cell.setCellStyle(headerStyle);
            }
            for (Map<String, Object> data : rows) {
                Row row = sheet.createRow(rowIndex++);
                for (int i = 0; i < columns.size(); i++) {
                    Object value = data.get(columns.get(i).get("key"));
                    writeCell(row.createCell(i), value);
                }
            }

            rowIndex++;
            Row summaryTitle = sheet.createRow(rowIndex++);
            summaryTitle.createCell(0).setCellValue("Resumen");
            @SuppressWarnings("unchecked")
            Map<String, Object> summary = (Map<String, Object>) report.get("summary");
            for (Map.Entry<String, Object> entry : summary.entrySet()) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(entry.getKey());
                writeCell(row.createCell(1), entry.getValue());
            }

            for (int i = 0; i < Math.max(columns.size(), 2); i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(out);
            auditService.log("REPORT_EXPORTED", "Report", null, "Exportacion XLSX: " + type);
            return out.toByteArray();
        } catch (Exception exception) {
            throw new IllegalStateException("No se pudo generar el archivo XLSX");
        }
    }

    @Transactional
    public byte[] exportPdf(String type, Map<String, String> filters) {
        Map<String, Object> report = build(type, filters);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font smallFont = new Font(Font.HELVETICA, 9);
            Paragraph title = new Paragraph("TecnoStore - " + report.get("title"), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("Generado: " + LocalDateTime.now().format(DATE_TIME_FORMAT), smallFont));
            document.add(new Paragraph("Filtros: " + filterLabel(filters), smallFont));
            document.add(new Paragraph(" "));

            @SuppressWarnings("unchecked")
            List<Map<String, String>> columns = (List<Map<String, String>>) report.get("columns");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> rows = (List<Map<String, Object>>) report.get("rows");

            PdfPTable table = new PdfPTable(columns.size());
            table.setWidthPercentage(100);
            columns.forEach(column -> table.addCell(headerCell(column.get("label"))));
            rows.forEach(row -> columns.forEach(column -> table.addCell(String.valueOf(row.getOrDefault(column.get("key"), "")))));
            document.add(table);

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Resumen", new Font(Font.HELVETICA, 12, Font.BOLD)));
            @SuppressWarnings("unchecked")
            Map<String, Object> summary = (Map<String, Object>) report.get("summary");
            for (Map.Entry<String, Object> entry : summary.entrySet()) {
                document.add(new Paragraph(entry.getKey() + ": " + entry.getValue(), smallFont));
            }
            document.close();
            auditService.log("REPORT_EXPORTED", "Report", null, "Exportacion PDF: " + type);
            return out.toByteArray();
        } catch (Exception exception) {
            throw new IllegalStateException("No se pudo generar el archivo PDF");
        }
    }

    public String filename(String type, Map<String, String> filters, String extension) {
        String start = filters.getOrDefault("dateFrom", LocalDate.now().toString());
        String end = filters.getOrDefault("dateTo", LocalDate.now().toString());
        return "reporte_" + normalizeType(type).replace("-", "_") + "_" + start + "_" + end + "." + extension;
    }

    private Map<String, Object> salesReport(Map<String, String> filters) {
        List<Map<String, Object>> rows = new ArrayList<>();
        Set<Long> orderIds = new HashSet<>();
        int units = 0;
        BigDecimal total = BigDecimal.ZERO;
        for (Order order : filteredOrders(filters)) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (!matchesProductFilters(product, filters)) continue;
                if (!contains(order.getUser().getFullName(), filters.get("client"))) continue;
                rows.add(row(
                        "orderId", order.getId(),
                        "date", format(order.getCreatedAt()),
                        "client", order.getUser().getFullName(),
                        "email", order.getUser().getEmail(),
                        "product", product.getName(),
                        "category", product.getCategory().getName(),
                        "quantity", item.getQuantity(),
                        "unitPrice", item.getUnitPrice(),
                        "subtotal", item.getSubtotal(),
                        "orderTotal", order.getTotal(),
                        "status", order.getStatus().name()
                ));
                orderIds.add(order.getId());
                units += item.getQuantity();
                total = total.add(item.getSubtotal());
            }
        }
        BigDecimal average = orderIds.isEmpty() ? BigDecimal.ZERO : total.divide(BigDecimal.valueOf(orderIds.size()), 2, RoundingMode.HALF_UP);
        Map<String, Object> summary = row(
                "Pedidos", orderIds.size(),
                "Unidades vendidas", units,
                "Ingresos totales", total,
                "Venta minima", rows.stream().map(row -> asBig(row.get("subtotal"))).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO),
                "Venta maxima", rows.stream().map(row -> asBig(row.get("subtotal"))).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO),
                "Venta promedio", average
        );
        return report("Reporte de ventas", columns(
                col("orderId", "ID pedido"), col("date", "Fecha"), col("client", "Cliente"), col("email", "Correo"),
                col("product", "Producto"), col("category", "Categoria"), col("quantity", "Cantidad"), col("unitPrice", "Precio unitario"),
                col("subtotal", "Subtotal"), col("orderTotal", "Total pedido"), col("status", "Estado")
        ), rows, summary);
    }

    private Map<String, Object> ordersReport(Map<String, String> filters) {
        List<Map<String, Object>> rows = filteredOrders(filters).stream()
                .filter(order -> contains(order.getUser().getFullName(), filters.get("client")))
                .map(order -> row(
                        "id", order.getId(),
                        "date", format(order.getCreatedAt()),
                        "client", order.getUser().getFullName(),
                        "email", order.getUser().getEmail(),
                        "items", order.getItems().stream().mapToInt(OrderItem::getQuantity).sum(),
                        "total", order.getTotal(),
                        "status", order.getStatus().name()
                ))
                .toList();
        return report("Reporte de pedidos", columns(
                col("id", "ID"), col("date", "Fecha"), col("client", "Cliente"), col("email", "Correo"),
                col("items", "Productos"), col("total", "Total"), col("status", "Estado")
        ), rows, row("Pedidos", rows.size(), "Total", sum(rows, "total")));
    }

    private Map<String, Object> inventoryReport(Map<String, String> filters, String type) {
        List<StockAlert> alerts = stockAlertRepository.findAll();
        Map<Long, List<StockAlert>> alertsByProduct = alerts.stream().collect(Collectors.groupingBy(alert -> alert.getProduct().getId()));
        List<Map<String, Object>> rows = filteredProducts(filters).stream()
                .map(product -> {
                    List<StockAlert> productAlerts = alertsByProduct.getOrDefault(product.getId(), List.of());
                    return row(
                            "id", product.getId(),
                            "name", product.getName(),
                            "category", product.getCategory().getName(),
                            "price", product.getPrice(),
                            "costPrice", product.getCostPrice(),
                            "stock", product.getStock(),
                            "status", product.getActive() ? "Activo" : "Inactivo",
                            "createdAt", format(product.getCreatedAt()),
                            "alerts", productAlerts.size(),
                            "lastAlert", productAlerts.stream().map(StockAlert::getCreatedAt).max(LocalDateTime::compareTo).map(this::format).orElse("-")
                    );
                })
                .toList();
        long outOfStock = rows.stream().filter(row -> ((Number) row.get("stock")).intValue() == 0).count();
        long lowStock = rows.stream().filter(row -> ((Number) row.get("stock")).intValue() > 0 && ((Number) row.get("stock")).intValue() <= 5).count();
        return report(type.equals("products") ? "Reporte de productos" : "Reporte de inventario", columns(
                col("id", "ID producto"), col("name", "Nombre"), col("category", "Categoria"), col("price", "Precio"),
                col("costPrice", "Costo"), col("stock", "Stock"), col("status", "Estado"), col("createdAt", "Fecha registro"),
                col("alerts", "Alertas"), col("lastAlert", "Ultima alerta")
        ), rows, row(
                "Total productos", rows.size(),
                "Total unidades", rows.stream().mapToInt(row -> ((Number) row.get("stock")).intValue()).sum(),
                "Agotados", outOfStock,
                "Stock bajo", lowStock,
                "Stock minimo", rows.stream().mapToInt(row -> ((Number) row.get("stock")).intValue()).min().orElse(0),
                "Stock maximo", rows.stream().mapToInt(row -> ((Number) row.get("stock")).intValue()).max().orElse(0)
        ));
    }

    private Map<String, Object> profitabilityReport(Map<String, String> filters) {
        Map<Long, ProfitAccumulator> accumulator = new LinkedHashMap<>();
        for (Order order : filteredOrders(filters)) {
            if (order.getStatus() != OrderStatus.CONFIRMED) continue;
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (!matchesProductFilters(product, filters)) continue;
                ProfitAccumulator current = accumulator.computeIfAbsent(product.getId(), id -> new ProfitAccumulator(product));
                current.units += item.getQuantity();
                current.revenue = current.revenue.add(item.getSubtotal());
                current.cost = current.cost.add(product.getCostPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
        }
        List<Map<String, Object>> rows = accumulator.values().stream()
                .map(ProfitAccumulator::toRow)
                .sorted((a, b) -> asBig(b.get("margin")).compareTo(asBig(a.get("margin"))))
                .toList();
        return report("Reporte de rentabilidad", columns(
                col("product", "Producto"), col("category", "Categoria"), col("salePrice", "Precio venta"),
                col("costPrice", "Precio costo"), col("unitsSold", "Unidades vendidas"), col("revenue", "Ingreso total"),
                col("totalCost", "Costo total"), col("margin", "Margen total"), col("marginPercent", "% margen")
        ), rows, row(
                "Productos", rows.size(),
                "Ingresos", sum(rows, "revenue"),
                "Costo total", sum(rows, "totalCost"),
                "Margen total", sum(rows, "margin"),
                "Top 5", rows.stream().limit(5).map(row -> row.get("product")).toList()
        ));
    }

    private Map<String, Object> lowStockReport(Map<String, String> filters) {
        int limit = intFilter(filters, "stockMax", 5);
        List<Map<String, Object>> rows = filteredProducts(filters).stream()
                .filter(product -> product.getStock() <= limit)
                .map(product -> row("id", product.getId(), "name", product.getName(), "category", product.getCategory().getName(),
                        "stock", product.getStock(), "status", product.getStock() == 0 ? "Agotado" : "Stock bajo"))
                .toList();
        return report("Reporte de stock bajo", columns(
                col("id", "ID producto"), col("name", "Producto"), col("category", "Categoria"), col("stock", "Stock"), col("status", "Estado")
        ), rows, row("Productos criticos", rows.size(), "Limite aplicado", limit));
    }

    private Map<String, Object> categoriesReport(Map<String, String> filters) {
        List<Map<String, Object>> rows = categoryRepository.findAllByOrderByNameAsc().stream()
                .filter(category -> contains(category.getName(), filters.get("categoryName")))
                .filter(category -> activeFilterMatches(category.getActive(), filters.get("active")))
                .map(category -> row("id", category.getId(), "name", category.getName(), "description", category.getDescription(),
                        "active", category.getActive() ? "Activa" : "Inactiva",
                        "products", productRepository.countByCategoryIdAndActiveTrue(category.getId())))
                .toList();
        return report("Reporte de categorias", columns(
                col("id", "ID"), col("name", "Nombre"), col("description", "Descripcion"), col("active", "Estado"), col("products", "Productos activos")
        ), rows, row("Categorias", rows.size()));
    }

    private Map<String, Object> stockAlertsReport(Map<String, String> filters) {
        List<Map<String, Object>> rows = stockAlertRepository.findAll().stream()
                .filter(alert -> matchesProductFilters(alert.getProduct(), filters))
                .map(alert -> row(
                        "id", alert.getId(),
                        "product", alert.getProduct().getName(),
                        "category", alert.getProduct().getCategory().getName(),
                        "type", alert.getAlertType(),
                        "stock", alert.getStockAtAlert(),
                        "status", alert.getStatus(),
                        "createdAt", format(alert.getCreatedAt()),
                        "attendedAt", alert.getAttendedAt() == null ? "-" : format(alert.getAttendedAt())
                ))
                .toList();
        return report("Reporte de alertas de stock", columns(
                col("id", "ID"), col("product", "Producto"), col("category", "Categoria"), col("type", "Tipo"),
                col("stock", "Stock alerta"), col("status", "Estado"), col("createdAt", "Creada"), col("attendedAt", "Atendida")
        ), rows, row("Alertas", rows.size()));
    }

    private Map<String, Object> auditReport() {
        List<Map<String, Object>> rows = auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(log -> row("date", format(log.getCreatedAt()), "user", log.getUser() == null ? "Sistema" : log.getUser().getEmail(),
                        "action", log.getAction(), "entity", log.getEntity(), "entityId", log.getEntityId(), "description", log.getDescription()))
                .toList();
        return report("Reporte de auditoria", columns(
                col("date", "Fecha"), col("user", "Usuario"), col("action", "Accion"), col("entity", "Entidad"),
                col("entityId", "ID entidad"), col("description", "Descripcion")
        ), rows, row("Registros", rows.size()));
    }

    private List<Order> filteredOrders(Map<String, String> filters) {
        LocalDateTime from = dateFrom(filters);
        LocalDateTime to = dateTo(filters);
        String status = filters.get("status");
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(order -> from == null || !order.getCreatedAt().isBefore(from))
                .filter(order -> to == null || !order.getCreatedAt().isAfter(to))
                .filter(order -> status == null || status.isBlank() || order.getStatus().name().equalsIgnoreCase(status))
                .toList();
    }

    private List<Product> filteredProducts(Map<String, String> filters) {
        BigDecimal priceMin = decimalFilter(filters, "priceMin");
        BigDecimal priceMax = decimalFilter(filters, "priceMax");
        Integer stockMin = optionalInt(filters, "stockMin");
        Integer stockMax = optionalInt(filters, "stockMax");
        return productRepository.findAllByOrderByIdDesc().stream()
                .filter(product -> matchesProductFilters(product, filters))
                .filter(product -> priceMin == null || product.getPrice().compareTo(priceMin) >= 0)
                .filter(product -> priceMax == null || product.getPrice().compareTo(priceMax) <= 0)
                .filter(product -> stockMin == null || product.getStock() >= stockMin)
                .filter(product -> stockMax == null || product.getStock() <= stockMax)
                .filter(product -> activeFilterMatches(product.getActive(), filters.get("active")))
                .toList();
    }

    private boolean matchesProductFilters(Product product, Map<String, String> filters) {
        Long categoryId = longFilter(filters, "categoryId");
        return (categoryId == null || Objects.equals(product.getCategory().getId(), categoryId))
                && contains(product.getName(), filters.get("productName"));
    }

    private boolean activeFilterMatches(Boolean active, String value) {
        if (value == null || value.isBlank() || "all".equalsIgnoreCase(value)) return true;
        return Boolean.parseBoolean(value) == Boolean.TRUE.equals(active);
    }

    private Map<String, Object> report(String title, List<Map<String, String>> columns, List<Map<String, Object>> rows, Map<String, Object> summary) {
        return row("title", title, "columns", columns, "rows", rows, "summary", summary, "totalRecords", rows.size());
    }

    private List<Map<String, String>> columns(Map<String, String>... columns) {
        return Arrays.asList(columns);
    }

    private Map<String, String> col(String key, String label) {
        return Map.of("key", key, "label", label);
    }

    private Map<String, Object> row(Object... values) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < values.length; i += 2) {
            map.put(String.valueOf(values[i]), values[i + 1]);
        }
        return map;
    }

    private boolean contains(String value, String term) {
        return term == null || term.isBlank() || (value != null && value.toLowerCase(Locale.ROOT).contains(term.toLowerCase(Locale.ROOT)));
    }

    private LocalDateTime dateFrom(Map<String, String> filters) {
        return parseDate(filters.get("dateFrom"), true);
    }

    private LocalDateTime dateTo(Map<String, String> filters) {
        return parseDate(filters.get("dateTo"), false);
    }

    private LocalDateTime parseDate(String value, boolean startOfDay) {
        if (value == null || value.isBlank()) return null;
        LocalDate date = LocalDate.parse(value);
        return startOfDay ? date.atStartOfDay() : date.atTime(23, 59, 59);
    }

    private Long longFilter(Map<String, String> filters, String key) {
        String value = filters.get(key);
        return value == null || value.isBlank() ? null : Long.valueOf(value);
    }

    private Integer optionalInt(Map<String, String> filters, String key) {
        String value = filters.get(key);
        return value == null || value.isBlank() ? null : Integer.valueOf(value);
    }

    private int intFilter(Map<String, String> filters, String key, int defaultValue) {
        Integer value = optionalInt(filters, key);
        return value == null ? defaultValue : value;
    }

    private BigDecimal decimalFilter(Map<String, String> filters, String key) {
        String value = filters.get(key);
        return value == null || value.isBlank() ? null : new BigDecimal(value);
    }

    private String format(LocalDateTime value) {
        return value == null ? "-" : value.format(DATE_TIME_FORMAT);
    }

    private String filterLabel(Map<String, String> filters) {
        if (filters.isEmpty()) return "Sin filtros";
        return filters.entrySet().stream()
                .filter(entry -> entry.getValue() != null && !entry.getValue().isBlank())
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining(", "));
    }

    private void writeCell(Cell cell, Object value) {
        if (value instanceof Number number) {
            cell.setCellValue(number.doubleValue());
        } else if (value instanceof BigDecimal decimal) {
            cell.setCellValue(decimal.doubleValue());
        } else {
            cell.setCellValue(value == null ? "" : String.valueOf(value));
        }
    }

    private PdfPCell headerCell(String value) {
        PdfPCell cell = new PdfPCell(new Phrase(value));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

    private BigDecimal sum(List<Map<String, Object>> rows, String key) {
        return rows.stream().map(row -> asBig(row.get(key))).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal asBig(Object value) {
        if (value instanceof BigDecimal decimal) return decimal;
        if (value instanceof Number number) return BigDecimal.valueOf(number.doubleValue());
        return BigDecimal.ZERO;
    }

    private String normalizeType(String type) {
        return type == null ? "" : type.trim().toLowerCase(Locale.ROOT);
    }

    private static class ProfitAccumulator {
        private final Product product;
        private int units;
        private BigDecimal revenue = BigDecimal.ZERO;
        private BigDecimal cost = BigDecimal.ZERO;

        private ProfitAccumulator(Product product) {
            this.product = product;
        }

        private Map<String, Object> toRow() {
            BigDecimal margin = revenue.subtract(cost);
            BigDecimal marginPercent = revenue.compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.ZERO
                    : margin.multiply(BigDecimal.valueOf(100)).divide(revenue, 2, RoundingMode.HALF_UP);
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("product", product.getName());
            map.put("category", product.getCategory().getName());
            map.put("salePrice", product.getPrice());
            map.put("costPrice", product.getCostPrice());
            map.put("unitsSold", units);
            map.put("revenue", revenue);
            map.put("totalCost", cost);
            map.put("margin", margin);
            map.put("marginPercent", marginPercent);
            return map;
        }
    }
}
