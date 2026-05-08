const Admin = (() => {
    let productModal;
    let currentProductId = null;

    function init() {
        productModal = new bootstrap.Modal(document.getElementById("productModal"));
        document.getElementById("product-form")?.addEventListener("submit", saveProduct);
    }

    function mountDashboard() {
        Auth.refreshUi();
    }

    async function mountProducts() {
        if (!Auth.requireAdmin()) return;
        document.getElementById("btn-new-product")?.addEventListener("click", () => openProductModal());
        renderProducts();
    }

    function renderProducts() {
        const table = document.getElementById("admin-products-table");
        const products = Store.allProducts();
        table.innerHTML = products.length
            ? products.map(product => `
                <tr>
                    <td>
                        <div class="table-product">
                            <img src="${StoreUtils.escapeHtml(StoreUtils.productImage(product))}" alt="">
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
        select.innerHTML = Store.categories()
            .map(category => `<option value="${category.id}" ${String(category.id) === String(selectedId) ? "selected" : ""}>${StoreUtils.escapeHtml(category.name)}</option>`)
            .join("");
    }

    function openProductModal(product = null) {
        currentProductId = product?.id || null;
        document.getElementById("productModalLabel").textContent = product ? "Editar producto" : "Agregar producto";
        document.getElementById("product-id").value = product?.id || "";
        document.getElementById("product-name").value = product?.name || "";
        document.getElementById("product-price").value = product?.price || "";
        document.getElementById("product-stock").value = product?.stock ?? 10;
        document.getElementById("product-image").value = product?.image || "";
        document.getElementById("product-description").value = product?.description || "";
        fillCategorySelect(product?.category?.id || "");
        productModal.show();
    }

    async function saveProduct(event) {
        event.preventDefault();
        const button = event.submitter;
        button.disabled = true;
        const payload = {
            name: document.getElementById("product-name").value.trim(),
            description: document.getElementById("product-description").value.trim(),
            categoryId: Number(document.getElementById("product-category").value),
            price: Number(document.getElementById("product-price").value),
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

    return { init, mountDashboard, mountProducts };
})();
