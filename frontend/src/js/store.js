const Store = (() => {
    let products = [];
    let categories = [];

    async function init() {
        await refresh();
    }

    async function refresh() {
        try {
            const [productData, categoryData] = await Promise.all([Api.getProducts(), Api.getCategories()]);
            products = productData;
            categories = categoryData;
        } catch (error) {
            products = [];
            categories = [];
            StoreUtils.toast("No se pudo conectar con el backend", "danger");
        }
    }

    function mountHome() {
        const count = document.getElementById("home-product-count");
        if (count) count.textContent = `${products.length}+`;
        const featured = document.getElementById("home-featured-products");
        if (featured) featured.innerHTML = products.slice(0, 6).map(productCard).join("");
        bindProductButtons();
    }

    function mountCatalog(params = {}) {
        const query = params.query || {};
        const searchInput = document.getElementById("catalog-search");
        const categorySelect = document.getElementById("catalog-category");
        const sortSelect = document.getElementById("catalog-sort");

        categorySelect.innerHTML = `<option value="">Todas</option>` + categories
            .map(category => `<option value="${category.id}">${StoreUtils.escapeHtml(category.name)}</option>`)
            .join("");

        if (query.search) searchInput.value = query.search;

        const render = () => renderCatalog(searchInput.value, categorySelect.value, sortSelect.value);
        searchInput.addEventListener("input", render);
        categorySelect.addEventListener("change", render);
        sortSelect.addEventListener("change", render);
        render();
    }

    function renderCatalog(search = "", categoryId = "", sort = "default") {
        const list = document.getElementById("catalog-products");
        const counter = document.getElementById("catalog-count");
        const term = search.trim().toLowerCase();
        let visible = products.filter(product => {
            const matchesSearch = !term
                || product.name.toLowerCase().includes(term)
                || product.description.toLowerCase().includes(term)
                || StoreUtils.categoryName(product).toLowerCase().includes(term);
            const matchesCategory = !categoryId || String(product.category.id) === String(categoryId);
            return matchesSearch && matchesCategory;
        });

        if (sort === "price-asc") visible = visible.sort((a, b) => Number(a.price) - Number(b.price));
        if (sort === "price-desc") visible = visible.sort((a, b) => Number(b.price) - Number(a.price));
        if (sort === "stock-desc") visible = visible.sort((a, b) => Number(b.stock) - Number(a.stock));

        counter.textContent = `${visible.length} producto${visible.length === 1 ? "" : "s"}`;
        list.innerHTML = visible.length
            ? visible.map(productCard).join("")
            : `<div class="col-12"><div class="empty-state compact"><p>No se encontraron productos.</p></div></div>`;
        bindProductButtons();
    }

    async function mountDetail(params) {
        const container = document.getElementById("product-detail");
        try {
            const product = await Api.getProduct(params.id);
            const stockClass = product.stock <= 0 ? "empty" : product.stock <= 5 ? "low" : "";
            container.innerHTML = `
                <div class="product-detail-grid">
                    <div class="detail-image"><img src="${StoreUtils.escapeHtml(StoreUtils.productImage(product))}" alt="${StoreUtils.escapeHtml(product.name)}" ${StoreUtils.imageFallbackAttr()}></div>
                    <div class="detail-info">
                        <span class="badge rounded-pill text-bg-light">${StoreUtils.escapeHtml(StoreUtils.categoryName(product))}</span>
                        <h1>${StoreUtils.escapeHtml(product.name)}</h1>
                        <p>${StoreUtils.escapeHtml(product.description)}</p>
                        <div class="detail-price">${StoreUtils.money(product.price)}</div>
                        <span class="badge stock-badge ${stockClass}">${product.stock > 0 ? `${product.stock} unidades disponibles` : "Sin stock"}</span>
                        <div class="d-flex gap-2 mt-4">
                            <button class="btn btn-primary btn-lg" data-add-product="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
                                <i class="bi bi-cart-plus me-2"></i>Agregar al carrito
                            </button>
                            <a class="btn btn-outline-secondary btn-lg" href="#/catalogo">Volver</a>
                        </div>
                    </div>
                </div>
            `;
            products = products.some(item => item.id === product.id) ? products : [product, ...products];
            bindProductButtons();
        } catch (error) {
            container.innerHTML = `<div class="alert alert-danger">${StoreUtils.escapeHtml(error.message)}</div>`;
        }
    }

    function productCard(product) {
        const stockClass = product.stock <= 0 ? "empty" : product.stock <= 5 ? "low" : "";
        return `
            <div class="col-md-6 col-xl-4">
                <article class="product-card">
                    <a class="product-image" href="#/producto/${product.id}">
                        <img src="${StoreUtils.escapeHtml(StoreUtils.productImage(product))}" alt="${StoreUtils.escapeHtml(product.name)}" ${StoreUtils.imageFallbackAttr()}>
                    </a>
                    <div class="product-body">
                        <div class="d-flex justify-content-between gap-2 mb-2">
                            <span class="badge rounded-pill text-bg-light">${StoreUtils.escapeHtml(StoreUtils.categoryName(product))}</span>
                            <span class="badge stock-badge ${stockClass}">${product.stock > 0 ? `${product.stock} disp.` : "Sin stock"}</span>
                        </div>
                        <a class="product-title" href="#/producto/${product.id}">${StoreUtils.escapeHtml(product.name)}</a>
                        <p>${StoreUtils.escapeHtml(product.description)}</p>
                        <div class="product-bottom">
                            <strong>${StoreUtils.money(product.price)}</strong>
                            <button class="btn btn-primary" data-add-product="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
                                <i class="bi bi-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    function bindProductButtons() {
        document.querySelectorAll("[data-add-product]").forEach(button => {
            button.onclick = () => {
                const product = products.find(item => Number(item.id) === Number(button.dataset.addProduct));
                Cart.add(product);
            };
        });
    }

    return {
        init,
        refresh,
        mountHome,
        mountCatalog,
        mountDetail,
        allProducts: () => products,
        categories: () => categories,
        productCard
    };
})();
