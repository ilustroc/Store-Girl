const AdminPanel = (() => {
    let productModal;
    let products = [];
    let orders = [];
    let users = [];

    function init() {
        productModal = new bootstrap.Modal(document.getElementById("productModal"));
        document.getElementById("btn-new-product").addEventListener("click", () => openProductForm());
        document.getElementById("product-form").addEventListener("submit", saveProduct);
        document.getElementById("admin-products-table").addEventListener("click", handleProductActions);
        document.getElementById("admin-orders-table").addEventListener("change", handleOrderStatus);
        return refresh();
    }

    async function refresh() {
        if (!Auth.isAdmin()) {
            clear();
            return;
        }
        try {
            const [productData, orderData, userData] = await Promise.all([
                Api.getProducts(),
                Api.getOrders(),
                Api.getUsers()
            ]);
            products = productData;
            orders = orderData;
            users = userData;
            renderStats();
            renderProducts();
            renderOrders();
            renderUsers();
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        }
    }

    function clear() {
        document.getElementById("admin-stats").innerHTML = "";
        document.getElementById("admin-products-table").innerHTML = "";
        document.getElementById("admin-orders-table").innerHTML = "";
        document.getElementById("admin-users-table").innerHTML = "";
    }

    function renderStats() {
        const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((inner, item) => inner + Number(item.quantity), 0), 0);
        const stats = [
            { label: "Productos", value: products.length, icon: "bi-box-seam" },
            { label: "Pedidos", value: orders.length, icon: "bi-receipt" },
            { label: "Usuarios", value: users.length, icon: "bi-people" },
            { label: "Ventas", value: StoreUtils.money(totalSales), icon: "bi-cash-coin" },
            { label: "Unidades", value: totalItems, icon: "bi-bar-chart" }
        ];
        document.getElementById("admin-stats").innerHTML = stats.map(stat => `
            <div class="col-sm-6 col-xl">
                <div class="stat-tile">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="text-muted small">${stat.label}</div>
                            <div class="h4 fw-bold mb-0">${stat.value}</div>
                        </div>
                        <i class="bi ${stat.icon}"></i>
                    </div>
                </div>
            </div>
        `).join("");
    }

    function renderProducts() {
        const table = document.getElementById("admin-products-table");
        table.innerHTML = products.length
            ? products.map(product => `
                <tr>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <img src="${StoreUtils.escapeHtml(product.imageUrl || "assets/img/descarga.png")}" alt="" width="44" height="44" class="object-fit-contain bg-light rounded">
                            <div>
                                <strong>${StoreUtils.escapeHtml(product.name)}</strong>
                                <div class="text-muted small">${StoreUtils.escapeHtml(product.description).slice(0, 72)}</div>
                            </div>
                        </div>
                    </td>
                    <td>${StoreUtils.escapeHtml(product.category)}</td>
                    <td>${StoreUtils.money(product.price)}</td>
                    <td>${product.stock}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary" data-edit-product="${product.id}" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" data-delete-product="${product.id}" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="5" class="text-center text-muted py-4">No hay productos.</td></tr>`;
    }

    function renderOrders() {
        const table = document.getElementById("admin-orders-table");
        table.innerHTML = orders.length
            ? orders.map(order => `
                <tr>
                    <td>
                        <strong>${StoreUtils.escapeHtml(order.orderNumber)}</strong>
                        <div class="text-muted small">${order.items.length} lineas</div>
                    </td>
                    <td>
                        ${StoreUtils.escapeHtml(order.customerName)}
                        <div class="text-muted small">${StoreUtils.escapeHtml(order.customerEmail)}</div>
                    </td>
                    <td>${StoreUtils.date(order.createdAt)}</td>
                    <td>${StoreUtils.money(order.total)}</td>
                    <td>
                        <select class="form-select form-select-sm" data-order-status="${StoreUtils.escapeHtml(order.orderNumber)}">
                            ${["Procesando", "Enviado", "Entregado", "Cancelado"].map(status => `
                                <option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>
                            `).join("")}
                        </select>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="5" class="text-center text-muted py-4">No hay pedidos.</td></tr>`;
    }

    function renderUsers() {
        const table = document.getElementById("admin-users-table");
        table.innerHTML = users.length
            ? users.map(user => `
                <tr>
                    <td>${StoreUtils.escapeHtml(user.fullName)}</td>
                    <td>${StoreUtils.escapeHtml(user.email)}</td>
                    <td><span class="badge text-bg-${user.role === "admin" ? "primary" : "secondary"}">${StoreUtils.escapeHtml(user.role)}</span></td>
                    <td>${StoreUtils.escapeHtml(user.phone || "-")}</td>
                    <td>${StoreUtils.date(user.createdAt)}</td>
                </tr>
            `).join("")
            : `<tr><td colspan="5" class="text-center text-muted py-4">No hay usuarios.</td></tr>`;
    }

    function openProductForm(product = null) {
        document.getElementById("productModalLabel").textContent = product ? "Editar producto" : "Agregar producto";
        document.getElementById("product-id").value = product?.id || "";
        document.getElementById("product-name").value = product?.name || "";
        document.getElementById("product-price").value = product?.price || "";
        document.getElementById("product-stock").value = product?.stock ?? 10;
        document.getElementById("product-category").value = product?.category || "";
        document.getElementById("product-image").value = product?.imageUrl || "";
        document.getElementById("product-description").value = product?.description || "";
        productModal.show();
    }

    async function saveProduct(event) {
        event.preventDefault();
        const id = document.getElementById("product-id").value;
        const payload = {
            name: document.getElementById("product-name").value.trim(),
            price: Number(document.getElementById("product-price").value),
            stock: Number(document.getElementById("product-stock").value),
            category: document.getElementById("product-category").value.trim(),
            imageUrl: document.getElementById("product-image").value.trim(),
            description: document.getElementById("product-description").value.trim()
        };

        const button = event.submitter;
        button.disabled = true;
        try {
            if (id) {
                await Api.updateProduct(id, payload);
                StoreUtils.toast("Producto actualizado", "success");
            } else {
                await Api.createProduct(payload);
                StoreUtils.toast("Producto agregado", "success");
            }
            productModal.hide();
            await Catalog.load();
            await refresh();
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        } finally {
            button.disabled = false;
        }
    }

    async function handleProductActions(event) {
        const edit = event.target.closest("[data-edit-product]");
        const remove = event.target.closest("[data-delete-product]");
        if (edit) {
            const product = products.find(item => Number(item.id) === Number(edit.dataset.editProduct));
            if (product) openProductForm(product);
        }
        if (remove) {
            const product = products.find(item => Number(item.id) === Number(remove.dataset.deleteProduct));
            if (!product) return;
            const confirmed = confirm(`Eliminar "${product.name}"?`);
            if (!confirmed) return;
            try {
                await Api.deleteProduct(product.id);
                StoreUtils.toast("Producto eliminado", "success");
                await Catalog.load();
                await refresh();
            } catch (error) {
                StoreUtils.toast(error.message, "danger");
            }
        }
    }

    async function handleOrderStatus(event) {
        const select = event.target.closest("[data-order-status]");
        if (!select) return;
        try {
            await Api.updateOrderStatus(select.dataset.orderStatus, select.value);
            StoreUtils.toast("Estado actualizado", "success");
            await refresh();
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        }
    }

    return { init, refresh };
})();

window.AdminPanel = AdminPanel;
