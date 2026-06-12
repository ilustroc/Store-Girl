const Admin = (() => {
    const LOW_STOCK_LIMIT = 5;
    let productModal;
    let categoryModal;
    let currentProductId = null;
    let currentCategoryId = null;
    let imageUploading = false;
    let adminProducts = [];
    let adminCategories = [];
    let indicatorCharts = [];

    function init() {
        productModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
        categoryModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("categoryModal"));
        document.getElementById("product-form")?.addEventListener("submit", saveProduct);
        document.getElementById("category-form")?.addEventListener("submit", saveCategory);
        document.getElementById("product-image-file")?.addEventListener("change", event => handleProductImageUpload(event.target.files?.[0]));
    }

    async function mountDashboard() {
        if (!Auth.requireAdmin()) return;
        Auth.refreshUi();
        adminCategories = Store.categories();
        bindDashboardButtons();
        await loadIndicatorsDashboard();
    }

    async function mountProducts() {
        if (!Auth.requireAdmin()) return;
        bindAdminButtons();
        await loadCategories();
        await loadProducts();
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
        document.getElementById("dashboard-new-product")?.addEventListener("click", () => openProductModal());
        document.getElementById("dashboard-new-category")?.addEventListener("click", () => openCategoryModal());
    }

    async function loadProducts(showLoading = true) {
        const table = document.getElementById("admin-products-table");
        if (showLoading && table) {
            table.innerHTML = emptyRow(7, "Cargando productos...");
        }
        try {
            adminProducts = await Api.getAdminProducts();
            renderProductsTable(adminProducts);
        } catch (error) {
            if (table) table.innerHTML = emptyRow(7, "No se pudieron cargar los productos.");
            StoreUtils.showToast(error.message, "danger");
        }
    }

    async function loadCategories() {
        try {
            adminCategories = await Api.getCategories();
            renderCategoryOptions(adminCategories);
            renderCategories(adminCategories);
            updateDashboardCategoryCounter();
        } catch (error) {
            StoreUtils.showToast(error.message, "danger");
        }
    }

    function renderProductsTable(products) {
        const table = document.getElementById("admin-products-table");
        if (!table) return;
        table.innerHTML = products.length
            ? products.map(productRowTemplate).join("")
            : emptyRow(7, "No hay productos registrados.");
        bindProductActions();
    }

    function productRowTemplate(product) {
        const stock = stockState(product.stock);
        const active = product.active !== false;
        return `
            <tr class="${active ? "" : "table-light"}">
                <td>
                    <div class="table-product admin-product-cell">
                        <img src="${StoreUtils.escapeHtml(StoreUtils.productImage(product))}" alt="${StoreUtils.escapeHtml(product.name)}" ${StoreUtils.imageFallbackAttr()}>
                        <div>
                            <strong>${StoreUtils.escapeHtml(product.name)}</strong>
                            <span>${StoreUtils.escapeHtml(product.description || "").slice(0, 88)}</span>
                        </div>
                    </div>
                </td>
                <td>${StoreUtils.escapeHtml(StoreUtils.categoryName(product))}</td>
                <td>${StoreUtils.formatCurrency(product.price)}</td>
                <td>${StoreUtils.formatCurrency(product.costPrice || 0)}</td>
                <td><span class="stock-state ${stock.className}">${stock.label}</span></td>
                <td><span class="status-pill ${active ? "active" : "inactive"}">${active ? "Activo" : "Inactivo"}</span></td>
                <td class="text-end">
                    <div class="admin-row-actions">
                        <button class="btn btn-sm btn-outline-primary" data-admin-edit="${product.id}" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" data-admin-image="${product.id}" title="Cambiar imagen">
                            <i class="bi bi-image"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" data-admin-toggle="${product.id}" title="${active ? "Desactivar" : "Activar"}">
                            <i class="bi ${active ? "bi-eye-slash" : "bi-eye"}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    function bindProductActions() {
        document.querySelectorAll("[data-admin-edit], [data-admin-image]").forEach(button => {
            button.onclick = () => {
                const id = button.dataset.adminEdit || button.dataset.adminImage;
                const product = adminProducts.find(item => Number(item.id) === Number(id));
                openProductModal(product);
            };
        });
        document.querySelectorAll("[data-admin-toggle]").forEach(button => {
            button.onclick = () => toggleProductStatus(Number(button.dataset.adminToggle));
        });
    }

    function stockState(stockValue) {
        const stock = Number(stockValue || 0);
        if (stock <= 0) return { label: "Agotado", className: "empty" };
        if (stock <= LOW_STOCK_LIMIT) return { label: `Stock bajo (${stock})`, className: "low" };
        return { label: `Disponible (${stock})`, className: "ok" };
    }

    function renderCategories(categories) {
        const list = document.getElementById("admin-categories-list");
        if (!list) return;
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

    function renderCategoryOptions(categories, selectedId = "") {
        const select = document.getElementById("product-category");
        if (!select) return;
        select.innerHTML = `<option value="">Selecciona una categoría</option>` + categories
            .map(category => `<option value="${category.id}" ${String(category.id) === String(selectedId) ? "selected" : ""}>${StoreUtils.escapeHtml(category.name)}</option>`)
            .join("");
    }

    function openProductModal(product = null) {
        currentProductId = product?.id || null;
        imageUploading = false;
        resetProductForm();
        document.getElementById("productModalLabel").textContent = product ? "Editar producto" : "Agregar producto";
        document.getElementById("product-id").value = product?.id || "";
        document.getElementById("product-name").value = product?.name || "";
        document.getElementById("product-price").value = product?.price ?? "";
        document.getElementById("product-cost-price").value = product?.costPrice ?? "";
        document.getElementById("product-stock").value = product?.stock ?? 0;
        document.getElementById("product-description").value = product?.description || "";
        document.getElementById("product-image").value = product?.image || "";
        renderCategoryOptions(adminCategories.length ? adminCategories : Store.categories(), product?.category?.id || "");
        setImagePreview(product?.image || "", product ? "Imagen actual del producto." : "Usa PNG, JPG, JPEG o WEBP.");
        productModal.show();
    }

    function resetProductForm() {
        const form = document.getElementById("product-form");
        form?.reset();
        form?.querySelectorAll(".is-invalid").forEach(input => input.classList.remove("is-invalid"));
        StoreUtils.showAlert("#product-alert", "");
        document.getElementById("product-image-file").value = "";
        document.getElementById("product-image").value = "";
        setImagePreview("", "Usa PNG, JPG, JPEG o WEBP.");
    }

    function getProductFormData() {
        return {
            name: document.getElementById("product-name").value.trim(),
            description: document.getElementById("product-description").value.trim(),
            categoryId: Number(document.getElementById("product-category").value),
            price: Number(document.getElementById("product-price").value),
            costPrice: Number(document.getElementById("product-cost-price").value || 0),
            stock: Number(document.getElementById("product-stock").value),
            image: document.getElementById("product-image").value.trim()
        };
    }

    function validateProductForm(data) {
        const errors = {};
        if (!data.name) errors["product-name"] = "El nombre es obligatorio.";
        if (!data.description) errors["product-description"] = "La descripción es obligatoria.";
        if (!data.categoryId) errors["product-category"] = "Selecciona una categoría.";
        if (!Number.isFinite(data.price) || data.price < 0) errors["product-price"] = "El precio debe ser mayor o igual a 0.";
        if (!Number.isFinite(data.costPrice) || data.costPrice < 0) errors["product-cost-price"] = "El costo debe ser mayor o igual a 0.";
        if (!Number.isInteger(data.stock) || data.stock < 0) errors["product-stock"] = "El stock debe ser un número entero mayor o igual a 0.";
        showFieldErrors(errors);
        if (Object.keys(errors).length) {
            StoreUtils.showAlert("#product-alert", "Revisa los campos marcados antes de guardar.", "warning");
            return false;
        }
        StoreUtils.showAlert("#product-alert", "");
        return true;
    }

    function showFieldErrors(errors) {
        document.querySelectorAll("#product-form .is-invalid").forEach(input => input.classList.remove("is-invalid"));
        Object.keys(errors).forEach(id => document.getElementById(id)?.classList.add("is-invalid"));
    }

    async function saveProduct(event) {
        event.preventDefault();
        if (imageUploading) {
            StoreUtils.showAlert("#product-alert", "Espera a que termine la carga de la imagen.", "warning");
            return;
        }
        const data = getProductFormData();
        if (!validateProductForm(data)) return;

        const button = event.submitter || document.querySelector("#product-form button[type='submit']");
        setButtonLoading(button, true);
        try {
            if (currentProductId) {
                await Api.updateProduct(currentProductId, data);
            } else {
                await Api.createProduct(data);
            }
            productModal.hide();
            StoreUtils.showToast("Producto guardado correctamente", "success");
            await afterAdminDataChanged();
        } catch (error) {
            StoreUtils.showAlert("#product-alert", error.message, "danger");
        } finally {
            setButtonLoading(button, false);
        }
    }

    async function toggleProductStatus(id) {
        const product = adminProducts.find(item => Number(item.id) === Number(id));
        if (!product) return;
        const nextActive = product.active === false;
        const action = nextActive ? "activar" : "desactivar";
        if (!confirm(`¿Quieres ${action} "${product.name}"?`)) return;
        try {
            await Api.updateProductStatus(product.id, nextActive);
            StoreUtils.showToast(nextActive ? "Producto activado" : "Producto desactivado", "success");
            await afterAdminDataChanged();
        } catch (error) {
            StoreUtils.showToast(error.message, "danger");
        }
    }

    async function handleProductImageUpload(file) {
        if (!file) return;
        if (!isValidImageFile(file)) {
            document.getElementById("product-image-file").value = "";
            StoreUtils.showAlert("#product-alert", "Selecciona una imagen PNG, JPG, JPEG o WEBP.", "warning");
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
            StoreUtils.showToast("Imagen cargada correctamente", "success");
        } catch (error) {
            StoreUtils.showAlert("#product-alert", error.message, "danger");
            setImagePreview(document.getElementById("product-image").value, "No se pudo subir la imagen.");
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
        if (!preview || !statusText) return;
        preview.src = StoreUtils.productImage({ image: path });
        preview.onerror = () => {
            preview.onerror = null;
            preview.src = "assets/img/descarga.png";
        };
        statusText.textContent = status;
    }

    function openCategoryModal(category = null) {
        currentCategoryId = category?.id || null;
        resetCategoryForm();
        document.getElementById("categoryModalLabel").textContent = category ? "Editar categoría" : "Agregar categoría";
        document.getElementById("category-id").value = category?.id || "";
        document.getElementById("category-name").value = category?.name || "";
        document.getElementById("category-description").value = category?.description || "";
        categoryModal.show();
    }

    function resetCategoryForm() {
        document.getElementById("category-form")?.reset();
        StoreUtils.showAlert("#category-alert", "");
        document.getElementById("category-name")?.classList.remove("is-invalid");
    }

    function getCategoryFormData() {
        return {
            name: document.getElementById("category-name").value.trim(),
            description: document.getElementById("category-description").value.trim()
        };
    }

    function validateCategoryForm(data) {
        const nameInput = document.getElementById("category-name");
        nameInput.classList.toggle("is-invalid", !data.name);
        if (!data.name) {
            StoreUtils.showAlert("#category-alert", "El nombre de categoría es obligatorio.", "warning");
            return false;
        }
        StoreUtils.showAlert("#category-alert", "");
        return true;
    }

    async function saveCategory(event) {
        event.preventDefault();
        const data = getCategoryFormData();
        if (!validateCategoryForm(data)) return;

        const button = event.submitter || document.querySelector("#category-form button[type='submit']");
        setButtonLoading(button, true);
        try {
            if (currentCategoryId) {
                await Api.updateCategory(currentCategoryId, data);
            } else {
                await Api.createCategory(data);
            }
            categoryModal.hide();
            StoreUtils.showToast("Categoría guardada correctamente", "success");
            await Store.refresh();
            await loadCategories();
            if (document.getElementById("admin-products-table")) renderProductsTable(adminProducts);
            if (document.getElementById("ind-summary-categories")) await loadIndicatorsDashboard();
        } catch (error) {
            const message = /existe/i.test(error.message) ? "Ya existe una categoría con ese nombre" : error.message;
            StoreUtils.showAlert("#category-alert", message, "danger");
        } finally {
            setButtonLoading(button, false);
        }
    }

    async function afterAdminDataChanged() {
        await Store.refresh();
        if (document.getElementById("admin-products-table")) await loadProducts(false);
        if (document.getElementById("ind-summary-products")) await loadIndicatorsDashboard();
    }

    async function loadIndicatorsDashboard() {
        destroyExistingCharts();
        clearChartEmptyStates();
        try {
            const data = await Api.getAdminIndicators();
            renderSummaryCards(data?.summary);
            renderInventoryCharts(data);
            renderSalesCharts(data);
            renderExperienceIndicators(data);
        } catch (error) {
            StoreUtils.showToast(error.message, "danger");
            const data = emptyIndicators();
            renderSummaryCards(data.summary);
            renderInventoryCharts(data);
            renderSalesCharts(data);
            renderExperienceIndicators(data);
        }
    }

    function renderSummaryCards(summary = {}) {
        setText("ind-summary-products", summary.totalProducts ?? 0);
        setText("ind-summary-categories", summary.totalCategories ?? 0);
        setText("ind-summary-orders", summary.totalOrders ?? 0);
        setText("ind-summary-sales", StoreUtils.formatCurrency(summary.accumulatedSales ?? 0));
        setText("ind-summary-low-stock", summary.lowStockProducts ?? 0);
    }

    function renderIndicatorCard(containerId, indicator) {
        const element = document.getElementById(containerId);
        if (!element || !indicator) return;
        element.innerHTML = `
            <div class="indicator-heading">
                <div>
                    <h3>${StoreUtils.escapeHtml(indicator.title)}</h3>
                    <p>${StoreUtils.escapeHtml(indicator.description || "No hay datos suficientes")}</p>
                </div>
                <span class="indicator-status ${statusClass(indicator.status)}">${statusLabel(indicator.status)}</span>
            </div>
            <div class="indicator-value">${StoreUtils.escapeHtml(indicator.valueLabel || "Sin datos")}</div>
            ${indicator.message ? `<div class="indicator-message">${StoreUtils.escapeHtml(friendlyEmptyMessage(indicator.message))}</div>` : ""}
            <div class="indicator-meta">
                <div><span>Fórmula</span><strong>${StoreUtils.escapeHtml(indicator.formula || "No disponible")}</strong></div>
                <div><span>Frecuencia</span><strong>${StoreUtils.escapeHtml(indicator.frequency || "No definida")}</strong></div>
                <div><span>Meta</span><strong>${StoreUtils.escapeHtml(indicator.goal || "Mantener control operativo.")}</strong></div>
            </div>
        `;
    }

    function renderInventoryCharts(data) {
        const rotation = data.inventoryRotation;
        const stock = data.minimumStockEffectiveness;
        renderIndicatorCard("indicator-inventoryRotation", rotation);
        renderIndicatorCard("indicator-minimumStockEffectiveness", stock);

        const rotationRows = Array.isArray(rotation?.data) ? rotation.data : [];
        renderTable("table-inventory-rotation", rotationRows, 4, row => `
            <tr>
                <td>${StoreUtils.escapeHtml(row.category)}</td>
                <td>${row.unitsSold}</td>
                <td>${formatDecimal(row.averageStock)}</td>
                <td>${formatDecimal(row.rotation)}x</td>
            </tr>
        `);

        if (rotationRows.length) {
            createChart("chart-inventory-rotation", "bar", rotationRows.map(row => row.category), [{
                label: "Rotación",
                data: rotationRows.map(row => Number(row.rotation || 0)),
                backgroundColor: "#0D0000"
            }], baseChartOptions());
        } else {
            renderEmptyState("chart-inventory-rotation", "No hay datos suficientes");
        }

        renderStockEffectiveness(stock);
    }

    function renderSalesCharts(data) {
        const dailySales = data.dailySalesDensity;
        const profitability = data.profitabilityRanking;
        const ordersRate = data.confirmedOrdersRate;
        renderIndicatorCard("indicator-dailySalesDensity", dailySales);
        renderIndicatorCard("indicator-profitabilityRanking", profitability);
        renderIndicatorCard("indicator-confirmedOrdersRate", ordersRate);

        const series = Array.isArray(dailySales?.data?.series) ? dailySales.data.series : [];
        document.getElementById("daily-sales-details").innerHTML = `
            <div><span>Día con mayor ingreso</span><strong>${StoreUtils.escapeHtml(dailySales?.data?.bestDay || "Sin datos")}</strong></div>
            <div><span>Total acumulado</span><strong>${StoreUtils.formatCurrency(dailySales?.data?.total || 0)}</strong></div>
        `;
        if (series.length) {
            createChart("chart-daily-sales", "line", series.map(row => row.date), [{
                label: "Ingresos diarios",
                data: series.map(row => Number(row.revenue || 0)),
                borderColor: "#0D0000",
                backgroundColor: "rgba(13, 0, 0, 0.12)",
                tension: 0.32,
                fill: true
            }], baseChartOptions());
        } else {
            renderEmptyState("chart-daily-sales", "No hay datos suficientes");
        }

        const products = Array.isArray(profitability?.data) ? profitability.data : [];
        renderTable("table-profitability", products, 5, row => `
            <tr>
                <td>${StoreUtils.escapeHtml(row.product)}</td>
                <td>${StoreUtils.formatCurrency(row.salePrice)}</td>
                <td>${row.costRegistered ? StoreUtils.formatCurrency(row.costPrice) : "Costo no registrado"}</td>
                <td>${row.unitsSold}</td>
                <td>${StoreUtils.formatCurrency(row.margin)}</td>
            </tr>
        `);
        if (products.length) {
            createChart("chart-profitability", "bar", products.map(row => row.product), [{
                label: "Margen",
                data: products.map(row => Number(row.margin || 0)),
                backgroundColor: "#6B6B6B"
            }], baseChartOptions("y"));
        } else {
            renderEmptyState("chart-profitability", "No hay datos suficientes");
        }

        const orderRows = Array.isArray(ordersRate?.data) ? ordersRate.data : [];
        if (orderRows.some(row => Number(row.count || 0) > 0)) {
            createChart("chart-orders-status", "doughnut", orderRows.map(row => row.status), [{
                data: orderRows.map(row => Number(row.count || 0)),
                backgroundColor: ["#0D0000", "#6B6B6B", "#F5F5F5"],
                borderColor: "#FFFFFF"
            }], { plugins: { legend: { position: "bottom", labels: { color: "#0D0000" } } }, maintainAspectRatio: false });
        } else {
            renderEmptyState("chart-orders-status", "No hay datos suficientes");
        }
    }

    function renderExperienceIndicators(data) {
        renderIndicatorCard("indicator-conversionRate", data.conversionRate);
        renderIndicatorCard("indicator-cartAbandonmentRate", data.cartAbandonmentRate);
        renderIndicatorCard("indicator-catalogLoadTime", data.catalogLoadTime);
    }

    function renderStockEffectiveness(indicator) {
        const data = indicator?.data || {};
        const details = document.getElementById("stock-effectiveness-details");
        if (!details) return;
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
                        <thead><tr><th>Producto</th><th>Categoría</th><th class="text-end">Stock</th></tr></thead>
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

    function createChart(canvasId, type, labels, datasets, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === "undefined") return;
        canvas.classList.remove("d-none");
        const chart = new Chart(canvas, { type, data: { labels, datasets }, options });
        indicatorCharts.push(chart);
    }

    function destroyExistingCharts() {
        indicatorCharts.forEach(chart => chart.destroy());
        indicatorCharts = [];
    }

    function renderEmptyState(canvasId, message) {
        const canvas = document.getElementById(canvasId);
        const box = canvas?.closest(".chart-box");
        if (!canvas || !box) return;
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("d-none");
        let empty = box.querySelector(".chart-empty-state");
        if (!empty) {
            empty = document.createElement("div");
            empty.className = "chart-empty-state";
            box.appendChild(empty);
        }
        empty.textContent = message;
    }

    function clearChartEmptyStates() {
        document.querySelectorAll(".chart-box canvas").forEach(canvas => canvas.classList.remove("d-none"));
        document.querySelectorAll(".chart-empty-state").forEach(element => element.remove());
    }

    function baseChartOptions(indexAxis = "x") {
        return {
            indexAxis,
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: typeScales(indexAxis)
        };
    }

    function typeScales() {
        return {
            x: { ticks: { color: "#6B6B6B" }, grid: { color: "rgba(107, 107, 107, 0.14)" } },
            y: { ticks: { color: "#6B6B6B" }, grid: { color: "rgba(107, 107, 107, 0.14)" } }
        };
    }

    function renderTable(id, rows, colspan, rowTemplate) {
        const table = document.getElementById(id);
        if (!table) return;
        table.innerHTML = rows.length ? rows.map(rowTemplate).join("") : emptyRow(colspan, "No hay datos suficientes");
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
            message: "No hay datos suficientes",
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

    function friendlyEmptyMessage(message) {
        return /datos suficientes/i.test(message || "") ? "No hay datos suficientes" : message;
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

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function updateDashboardCategoryCounter() {
        setText("ind-summary-categories", adminCategories.length);
    }

    function setButtonLoading(button, loading) {
        if (!button) return;
        button.disabled = loading;
        button.dataset.originalText ||= button.innerHTML;
        button.innerHTML = loading
            ? `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Guardando...`
            : button.dataset.originalText;
    }

    function emptyRow(colspan, message) {
        return `<tr><td colspan="${colspan}" class="text-center text-muted py-4">${StoreUtils.escapeHtml(message)}</td></tr>`;
    }

    return { init, mountDashboard, mountProducts };
})();
