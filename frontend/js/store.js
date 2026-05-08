const Catalog = (() => {
    let products = [];
    let search = "";
    let category = "";

    function init() {
        document.getElementById("search-products").addEventListener("input", event => {
            search = event.target.value.trim().toLowerCase();
            render();
        });
        document.getElementById("category-filter").addEventListener("change", event => {
            category = event.target.value;
            render();
        });
        document.getElementById("products-grid").addEventListener("click", event => {
            const button = event.target.closest("[data-add-product]");
            if (!button) return;
            const product = products.find(item => Number(item.id) === Number(button.dataset.addProduct));
            if (product) Cart.add(product);
        });
        return load();
    }

    async function load() {
        const message = document.getElementById("catalog-message");
        message.classList.add("d-none");
        try {
            products = await Api.getProducts();
            renderCategories();
            render();
        } catch (error) {
            document.getElementById("products-grid").innerHTML = "";
            message.textContent = `No se pudo cargar el catalogo: ${error.message}`;
            message.classList.remove("d-none");
        }
    }

    function renderCategories() {
        const select = document.getElementById("category-filter");
        const categories = [...new Set(products.map(product => product.category).filter(Boolean))].sort();
        select.innerHTML = `<option value="">Todas las categorias</option>` + categories
            .map(item => `<option value="${StoreUtils.escapeHtml(item)}">${StoreUtils.escapeHtml(item)}</option>`)
            .join("");
        select.value = category;
    }

    function visibleProducts() {
        return products.filter(product => {
            const matchesSearch = !search
                || product.name.toLowerCase().includes(search)
                || product.description.toLowerCase().includes(search)
                || product.category.toLowerCase().includes(search);
            const matchesCategory = !category || product.category === category;
            return matchesSearch && matchesCategory;
        });
    }

    function render() {
        const grid = document.getElementById("products-grid");
        const visible = visibleProducts();
        if (!visible.length) {
            grid.innerHTML = `<div class="col-12"><div class="alert alert-light border text-center">No hay productos para mostrar.</div></div>`;
            return;
        }

        grid.innerHTML = visible.map(product => {
            const stockClass = Number(product.stock) === 0 ? "empty" : Number(product.stock) <= 5 ? "low" : "";
            const disabled = Number(product.stock) <= 0 ? "disabled" : "";
            return `
                <div class="col-md-6 col-xl-4">
                    <article class="card product-card">
                        <div class="product-image">
                            <img src="${StoreUtils.escapeHtml(product.imageUrl || "assets/img/descarga.png")}" alt="${StoreUtils.escapeHtml(product.name)}">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                                <span class="badge rounded-pill text-bg-light">${StoreUtils.escapeHtml(product.category)}</span>
                                <span class="badge rounded-pill stock-badge ${stockClass}">${Number(product.stock) > 0 ? `${product.stock} disp.` : "Sin stock"}</span>
                            </div>
                            <h3 class="h5 fw-bold">${StoreUtils.escapeHtml(product.name)}</h3>
                            <p class="text-muted product-description">${StoreUtils.escapeHtml(product.description)}</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <strong class="fs-4 text-primary">${StoreUtils.money(product.price)}</strong>
                                </div>
                                <button class="btn btn-primary w-100" data-add-product="${product.id}" ${disabled}>
                                    <i class="bi bi-cart-plus me-2"></i>Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        }).join("");
    }

    function all() {
        return products;
    }

    return { init, load, all };
})();
