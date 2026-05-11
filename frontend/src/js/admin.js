const Admin = (() => {
    let productModal;
    let categoryModal;
    let currentProductId = null;
    let currentCategoryId = null;
    let imageUploading = false;
    let indicatorCharts = [];

    function init() {
        productModal = new bootstrap.Modal(document.getElementById("productModal"));
        categoryModal = new bootstrap.Modal(document.getElementById("categoryModal"));
        document.getElementById("product-form")?.addEventListener("submit", saveProduct);
        document.getElementById("category-form")?.addEventListener("submit", saveCategory);
        document.getElementById("product-image-file")?.addEventListener("change", handleProductImageSelected);
    }

    async function mountDashboard() {
        Auth.refreshUi();
        await Store.refresh();
        bindDashboardButtons();
        try {
            const indicators = await Api.getAdminIndicators();
            renderIndicators(indicators);
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
            renderIndicators(null);
        }
    }

    async function mountProducts() {
        if (!Auth.requireAdmin()) return;
        await Store.refresh();
        bindAdminButtons();
        renderCategories();
        renderProducts();
    }

    function bindAdminButtons() {
        ["btn-new-product", "btn-new-product-inline"].forEach(id => {
            document.getElementById(id)?.addEventListener("click", () => openProductModal());
        });
        ["btn-new-category", "btn-new-category-inline"].forEach(id => {
            document.getElementById(id)?.addEventListener("click", () => openCategoryModal());
        });
    }

    function bindDashboardButtons() {
        ["dashboard-new-product"].forEach(id => {
            document.getElementById(id)?.addEventListener("click", () => openProductModal());
        });
        ["dashboard-new-category"].forEach(id => {
            document.getElementById(id)?.addEventListener("click", () => openCategoryModal());
        });
    }

    function renderIndicators(payload) {
        destroyCharts();
        const data = payload || emptyIndicators();
        setText("ind-summary-products", data.summary.totalProducts);
        setText("ind-summary-categories", data.summary.totalCategories);
        setText("ind-summary-orders", data.summary.totalOrders);
        setText("ind-summary-sales", StoreUtils.money(data.summary.accumulatedSales));
        setText("ind-summary-low-stock", data.summary.lowStockProducts);

        renderIndicatorBlock("indicator-inventoryRotation", data.inventoryRotation);
        renderInventoryRotation(data.inventoryRotation);
        renderIndicatorBlock("indicator-minimumStockEffectiveness", data.minimumStockEffectiveness);
        renderStockEffectiveness(data.minimumStockEffectiveness);

        renderIndicatorBlock("indicator-dailySalesDensity", data.dailySalesDensity);
        renderDailySales(data.dailySalesDensity);
        renderIndicatorBlock("indicator-profitabilityRanking", data.profitabilityRanking);
        renderProfitability(data.profitabilityRanking);
        renderIndicatorBlock("indicator-confirmedOrdersRate", data.confirmedOrdersRate);
        renderOrdersStatus(data.confirmedOrdersRate);

        renderIndicatorBlock("indicator-conversionRate", data.conversionRate);
        renderIndicatorBlock("indicator-cartAbandonmentRate", data.cartAbandonmentRate);
        renderIndicatorBlock("indicator-catalogLoadTime", data.catalogLoadTime);
    }

    function renderIndicatorBlock(id, indicator) {
        const element = document.getElementById(id);
        if (!element || !indicator) return;
        element.innerHTML = `
            <div class="indicator-heading">
                <div>
                    <h3>${StoreUtils.escapeHtml(indicator.title)}</h3>
                    <p>${StoreUtils.escapeHtml(indicator.description)}</p>
                </div>
                <span class="indicator-status ${statusClass(indicator.status)}">${statusLabel(indicator.status)}</span>
            </div>
            <div class="indicator-value">${StoreUtils.escapeHtml(indicator.valueLabel || "Sin datos")}</div>
            ${indicator.message ? `<div class="indicator-message">${StoreUtils.escapeHtml(indicator.message)}</div>` : ""}
            <div class="indicator-meta">
                <div><span>Fórmula</span><strong>${StoreUtils.escapeHtml(indicator.formula)}</strong></div>
                <div><span>Frecuencia</span><strong>${StoreUtils.escapeHtml(indicator.frequency)}</strong></div>
                <div><span>Meta</span><strong>${StoreUtils.escapeHtml(indicator.goal)}</strong></div>
            </div>
        `;
    }

    function renderInventoryRotation(indicator) {
        const rows = Array.isArray(indicator?.data) ? indicator.data : [];
        const table = document.getElementById("table-inventory-rotation");
        table.innerHTML = rows.length ? rows.map(row => `
            <tr>
                <td>${StoreUtils.escapeHtml(row.category)}</td>
                <td>${row.unitsSold}</td>
                <td>${formatDecimal(row.averageStock)}</td>
                <td>${formatDecimal(row.rotation)}x</td>
            </tr>
        `).join("") : emptyRow(4);
        renderChart("chart-inventory-rotation", {
            type: "bar",
            data: {
                labels: rows.map(row => row.category),
                datasets: [{ label: "Rotación", data: rows.map(row => Number(row.rotation || 0)), backgroundColor: "#0D0000" }]
            },
            options: baseChartOptions()
        });
    }

    function renderDailySales(indicator) {
        const series = Array.isArray(indicator?.data?.series) ? indicator.data.series : [];
        const details = document.getElementById("daily-sales-details");
        details.innerHTML = `
            <div><span>Día con mayor ingreso</span><strong>${StoreUtils.escapeHtml(indicator?.data?.bestDay || "Sin datos")}</strong></div>
            <div><span>Total acumulado</span><strong>${StoreUtils.money(indicator?.data?.total || 0)}</strong></div>
        `;
        renderChart("chart-daily-sales", {
            type: "line",
            data: {
                labels: series.map(row => row.date),
                datasets: [{
                    label: "Ingresos diarios",
                    data: series.map(row => Number(row.revenue || 0)),
                    borderColor: "#0D0000",
                    backgroundColor: "rgba(13, 0, 0, 0.12)",
                    tension: 0.32,
                    fill: true
                }]
            },
            options: baseChartOptions()
        });
    }

    function renderProfitability(indicator) {
        const rows = Array.isArray(indicator?.data) ? indicator.data : [];
        const table = document.getElementById("table-profitability");
        table.innerHTML = rows.length ? rows.map(row => `
            <tr>
                <td>${StoreUtils.escapeHtml(row.product)}</td>
                <td>${StoreUtils.money(row.salePrice)}</td>
                <td>${row.costRegistered ? StoreUtils.money(row.costPrice) : "Costo no registrado"}</td>
                <td>${row.unitsSold}</td>
                <td>${StoreUtils.money(row.margin)}</td>
            </tr>
        `).join("") : emptyRow(5);
        renderChart("chart-profitability", {
            type: "bar",
            data: {
                labels: rows.map(row => row.product),
                datasets: [{ label: "Margen", data: rows.map(row => Number(row.margin || 0)), backgroundColor: "#6B6B6B" }]
            },
            options: baseChartOptions("y")
        });
    }

    function renderOrdersStatus(indicator) {
        const rows = Array.isArray(indicator?.data) ? indicator.data : [];
        renderChart("chart-orders-status", {
            type: "doughnut",
            data: {
                labels: rows.map(row => row.status),
                datasets: [{ data: rows.map(row => Number(row.count || 0)), backgroundColor: ["#0D0000", "#6B6B6B", "#F5F5F5"], borderColor: "#FFFFFF" }]
            },
            options: {
                plugins: { legend: { position: "bottom", labels: { color: "#0D0000" } } },
                maintainAspectRatio: false
            }
        });
    }

    function renderStockEffectiveness(indicator) {
        const data = indicator?.data || {};
        const details = document.getElementById("stock-effectiveness-details");
        const lowStockRows = Array.isArray(data.lowStockList) ? data.lowStockList : [];
        details.innerHTML = `
            <div><span>Productos con stock bajo</span><strong>${data.lowStockProducts ?? 0}</strong></div>
            <div><span>Productos agotados</span><strong>${data.outOfStockProducts ?? 0}</strong></div>
            <div><span>Alertas pendientes</span><strong>${data.pendingAlerts ?? 0}</strong></div>
            <div><span>Alertas atendidas</span><strong>${data.attendedAlerts ?? 0}</strong></div>
            <div class="stock-watchlist">
                <h4>Productos con stock bajo</h4>
                <div class="table-responsive">
                    <table class="table table-sm align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th class="text-end">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lowStockRows.length ? lowStockRows.map(row => `
                                <tr>
                                    <td>${StoreUtils.escapeHtml(row.product)}</td>
                                    <td>${StoreUtils.escapeHtml(row.category)}</td>
                                    <td class="text-end">${row.stock}</td>
                                </tr>
                            `).join("") : `<tr><td colspan="3" class="text-center text-muted py-3">No hay productos críticos por ahora.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderChart(id, config) {
        const canvas = document.getElementById(id);
        if (!canvas || typeof Chart === "undefined") return;
        indicatorCharts.push(new Chart(canvas, config));
    }

    function destroyCharts() {
        indicatorCharts.forEach(chart => chart.destroy());
        indicatorCharts = [];
    }

    function baseChartOptions(indexAxis = "x") {
        return {
            indexAxis,
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: "#6B6B6B" }, grid: { color: "rgba(107, 107, 107, 0.14)" } },
                y: { ticks: { color: "#6B6B6B" }, grid: { color: "rgba(107, 107, 107, 0.14)" } }
            }
        };
    }

    function emptyIndicators() {
        const card = (title) => ({
            title,
            description: "Indicador pendiente de datos.",
            formula: "No disponible",
            frequency: "Según operación",
            goal: "Mantener control operativo.",
            status: "ATTENTION",
            valueLabel: "Sin datos",
            message: "No hay datos suficientes para calcular este indicador.",
            data: []
        });
        return {
            summary: { totalProducts: 0, totalCategories: 0, totalOrders: 0, accumulatedSales: 0, lowStockProducts: 0 },
            inventoryRotation: card("Índice de Rotación de Inventario por Categoría"),
            dailySalesDensity: { ...card("Densidad de Ventas Diarias"), data: { series: [] } },
            profitabilityRanking: card("Ranking de Rentabilidad por Producto"),
            minimumStockEffectiveness: { ...card("Tasa de Efectividad de Stock Mínimo"), data: {} },
            conversionRate: card("Tasa de Conversión de Ventas"),
            cartAbandonmentRate: card("Tasa de Abandono del Carrito"),
            catalogLoadTime: card("Tiempo Promedio de Carga del Catálogo"),
            confirmedOrdersRate: card("Porcentaje de Pedidos Confirmados Correctamente")
        };
    }

    function statusClass(status) {
        return { GOOD: "good", ATTENTION: "attention", CRITICAL: "critical" }[status] || "attention";
    }

    function statusLabel(status) {
        return { GOOD: "Bueno", ATTENTION: "Atención", CRITICAL: "Crítico" }[status] || "Atención";
    }

    function formatDecimal(value) {
        return Number(value || 0).toFixed(2);
    }

    function emptyRow(colspan) {
        return `<tr><td colspan="${colspan}" class="text-center text-muted py-4">No hay datos suficientes para calcular este indicador.</td></tr>`;
    }

    function renderCategories() {
        const list = document.getElementById("admin-categories-list");
        if (!list) return;
        const categories = Store.categories();
        list.innerHTML = categories.length
            ? categories.map(category => `
                <div class="category-chip">
                    <div>
                        <strong>${StoreUtils.escapeHtml(category.name)}</strong>
                        <span>${StoreUtils.escapeHtml(category.description || "Sin descripción")}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" data-admin-edit-category="${category.id}" title="Editar categoría">
                        <i class="bi bi-pencil"></i>
                    </button>
                </div>
            `).join("")
            : `<div class="empty-state compact"><p>No hay categorías registradas.</p></div>`;

        document.querySelectorAll("[data-admin-edit-category]").forEach(button => {
            button.onclick = () => {
                const category = categories.find(item => Number(item.id) === Number(button.dataset.adminEditCategory));
                openCategoryModal(category);
            };
        });
    }

    function renderProducts() {
        const table = document.getElementById("admin-products-table");
        if (!table) return;
        const products = Store.allProducts();
        table.innerHTML = products.length
            ? products.map(product => `
                <tr>
                    <td>
                        <div class="table-product">
                            <img src="${StoreUtils.escapeHtml(StoreUtils.productImage(product))}" alt="" ${StoreUtils.imageFallbackAttr()}>
                            <div>
                                <strong>${StoreUtils.escapeHtml(product.name)}</strong>
                                <span>${StoreUtils.escapeHtml(product.description).slice(0, 80)}</span>
                            </div>
                        </div>
                    </td>
                    <td>${StoreUtils.escapeHtml(StoreUtils.categoryName(product))}</td>
                    <td>${StoreUtils.money(product.price)}</td>
                    <td>${product.stock}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary" data-admin-edit="${product.id}" title="Editar"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" data-admin-delete="${product.id}" title="Eliminar"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="5" class="text-center text-muted py-4">No hay productos activos.</td></tr>`;

        document.querySelectorAll("[data-admin-edit]").forEach(button => {
            button.onclick = () => {
                const product = products.find(item => Number(item.id) === Number(button.dataset.adminEdit));
                openProductModal(product);
            };
        });

        document.querySelectorAll("[data-admin-delete]").forEach(button => {
            button.onclick = async () => {
                const product = products.find(item => Number(item.id) === Number(button.dataset.adminDelete));
                if (!confirm(`Desactivar "${product.name}"?`)) return;
                try {
                    await Api.deleteProduct(product.id);
                    await Store.refresh();
                    renderProducts();
                    StoreUtils.toast("Producto desactivado", "success");
                } catch (error) {
                    StoreUtils.toast(error.message, "danger");
                }
            };
        });
    }

    function fillCategorySelect(selectedId = "") {
        const select = document.getElementById("product-category");
        if (!select) return;
        select.innerHTML = Store.categories()
            .map(category => `<option value="${category.id}" ${String(category.id) === String(selectedId) ? "selected" : ""}>${StoreUtils.escapeHtml(category.name)}</option>`)
            .join("");
    }

    function openProductModal(product = null) {
        currentProductId = product?.id || null;
        imageUploading = false;
        document.getElementById("productModalLabel").textContent = product ? "Editar producto" : "Agregar producto";
        document.getElementById("product-id").value = product?.id || "";
        document.getElementById("product-name").value = product?.name || "";
        document.getElementById("product-price").value = product?.price || "";
        document.getElementById("product-cost-price").value = product?.costPrice || "";
        document.getElementById("product-stock").value = product?.stock ?? 10;
        document.getElementById("product-description").value = product?.description || "";
        document.getElementById("product-image").value = product?.image || "";
        document.getElementById("product-image-file").value = "";
        setImagePreview(product?.image || "", product ? "Imagen actual del producto." : "Usa PNG, JPG, JPEG o WEBP.");
        fillCategorySelect(product?.category?.id || "");
        productModal.show();
    }

    function openCategoryModal(category = null) {
        currentCategoryId = category?.id || null;
        document.getElementById("categoryModalLabel").textContent = category ? "Editar categoría" : "Agregar categoría";
        document.getElementById("category-id").value = category?.id || "";
        document.getElementById("category-name").value = category?.name || "";
        document.getElementById("category-description").value = category?.description || "";
        showCategoryAlert("");
        categoryModal.show();
    }

    async function handleProductImageSelected(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!isValidImageFile(file)) {
            event.target.value = "";
            StoreUtils.toast("Selecciona una imagen PNG, JPG, JPEG o WEBP", "danger");
            return;
        }

        imageUploading = true;
        const localUrl = URL.createObjectURL(file);
        document.getElementById("product-image-preview").src = localUrl;
        document.getElementById("product-image-status").textContent = "Subiendo imagen...";

        try {
            const result = await Api.uploadProductImage(file);
            document.getElementById("product-image").value = result.path;
            setImagePreview(result.path, "Imagen lista para guardar.");
            StoreUtils.toast("Imagen cargada correctamente", "success");
        } catch (error) {
            setImagePreview(document.getElementById("product-image").value, "No se pudo subir la imagen.");
            StoreUtils.toast(error.message, "danger");
        } finally {
            imageUploading = false;
            URL.revokeObjectURL(localUrl);
        }
    }

    function isValidImageFile(file) {
        const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
        const extension = file.name.split(".").pop().toLowerCase();
        return file.type.startsWith("image/") && allowedExtensions.includes(extension);
    }

    function setImagePreview(path, status) {
        const preview = document.getElementById("product-image-preview");
        const statusText = document.getElementById("product-image-status");
        preview.src = StoreUtils.productImage({ image: path });
        preview.onerror = () => {
            preview.onerror = null;
            preview.src = "assets/img/descarga.png";
        };
        statusText.textContent = status;
    }

    async function saveProduct(event) {
        event.preventDefault();
        if (imageUploading) {
            StoreUtils.toast("Espera a que termine la carga de la imagen", "warning");
            return;
        }

        const button = event.submitter || document.querySelector("#product-form button[type='submit']");
        button.disabled = true;
        const payload = {
            name: document.getElementById("product-name").value.trim(),
            description: document.getElementById("product-description").value.trim(),
            categoryId: Number(document.getElementById("product-category").value),
            price: Number(document.getElementById("product-price").value),
            costPrice: Number(document.getElementById("product-cost-price").value || 0),
            stock: Number(document.getElementById("product-stock").value),
            image: document.getElementById("product-image").value.trim()
        };

        try {
            if (currentProductId) {
                await Api.updateProduct(currentProductId, payload);
                StoreUtils.toast("Producto actualizado", "success");
            } else {
                await Api.createProduct(payload);
                StoreUtils.toast("Producto creado", "success");
            }
            productModal.hide();
            await Store.refresh();
            renderProducts();
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        } finally {
            button.disabled = false;
        }
    }

    async function saveCategory(event) {
        event.preventDefault();
        const button = event.submitter || document.querySelector("#category-form button[type='submit']");
        button.disabled = true;
        showCategoryAlert("");

        const payload = {
            name: document.getElementById("category-name").value.trim(),
            description: document.getElementById("category-description").value.trim()
        };

        try {
            if (currentCategoryId) {
                await Api.updateCategory(currentCategoryId, payload);
                StoreUtils.toast("Categoría actualizada", "success");
            } else {
                await Api.createCategory(payload);
                StoreUtils.toast("Categoría creada", "success");
            }
            categoryModal.hide();
            await Store.refresh();
            renderCategories();
            renderProducts();
            fillCategorySelect(currentCategoryId || "");
        } catch (error) {
            showCategoryAlert(error.message);
            StoreUtils.toast(error.message, "danger");
        } finally {
            button.disabled = false;
        }
    }

    function showCategoryAlert(message) {
        const alert = document.getElementById("category-alert");
        if (!alert) return;
        alert.textContent = message;
        alert.classList.toggle("d-none", !message);
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    return { init, mountDashboard, mountProducts };
})();
