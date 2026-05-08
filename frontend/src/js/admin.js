const Admin = (() => {
    let productModal;
    let categoryModal;
    let currentProductId = null;
    let currentCategoryId = null;
    let imageUploading = false;

    function init() {
        productModal = new bootstrap.Modal(document.getElementById("productModal"));
        categoryModal = new bootstrap.Modal(document.getElementById("categoryModal"));
        document.getElementById("product-form")?.addEventListener("submit", saveProduct);
        document.getElementById("category-form")?.addEventListener("submit", saveCategory);
        document.getElementById("product-image-file")?.addEventListener("change", handleProductImageSelected);
    }

    function mountDashboard() {
        Auth.refreshUi();
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

    function renderCategories() {
        const list = document.getElementById("admin-categories-list");
        if (!list) return;
        const categories = Store.categories();
        list.innerHTML = categories.length
            ? categories.map(category => `
                <div class="category-chip">
                    <div>
                        <strong>${StoreUtils.escapeHtml(category.name)}</strong>
                        <span>${StoreUtils.escapeHtml(category.description || "Sin descripcion")}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" data-admin-edit-category="${category.id}" title="Editar categoria">
                        <i class="bi bi-pencil"></i>
                    </button>
                </div>
            `).join("")
            : `<div class="empty-state compact"><p>No hay categorias registradas.</p></div>`;

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
        document.getElementById("categoryModalLabel").textContent = category ? "Editar categoria" : "Agregar categoria";
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
                StoreUtils.toast("Categoria actualizada", "success");
            } else {
                await Api.createCategory(payload);
                StoreUtils.toast("Categoria creada", "success");
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

    return { init, mountDashboard, mountProducts };
})();
