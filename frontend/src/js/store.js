const Store = (() => {
    const LOW_STOCK_LIMIT = 5;
    let products = [];
    let categories = [];

    async function init() {
        await refresh();
    }

    async function refresh() {
        try {
            const [productData, categoryData] = await Promise.all([Api.getProducts(), Api.getCategories()]);
            products = Array.isArray(productData) ? productData : [];
            categories = Array.isArray(categoryData) ? categoryData : [];
        } catch {
            products = [];
            categories = [];
            StoreUtils.showToast("No pudimos cargar la tienda en este momento", "danger");
        }
    }

    function mountHome() {
        const count = document.getElementById("home-product-count");
        if (count) count.textContent = `${products.length}+`;
        const featured = document.getElementById("home-featured-products");
        if (featured) featured.innerHTML = products.slice(0, 6).map(renderProductCard).join("");
        bindProductButtons();
    }

    function mountCatalog(params = {}) {
        loadCatalog(params);
    }

    function loadCatalog(params = {}) {
        const query = params.query || {};
        const searchInput = document.getElementById("catalog-search");
        const categorySelect = document.getElementById("catalog-category");
        const sortSelect = document.getElementById("catalog-sort");

        renderCategoryFilter(categorySelect);
        if (query.search) searchInput.value = query.search;

        const render = () => renderProducts(searchInput.value, categorySelect.value, sortSelect.value);
        searchInput.addEventListener("input", render);
        categorySelect.addEventListener("change", render);
        sortSelect.addEventListener("change", render);
        render();
    }

    function renderCategoryFilter(select) {
        if (!select) return;
        select.innerHTML = `<option value="">Todas</option>` + categories
            .map(category => `<option value="${category.id}">${StoreUtils.escapeHtml(category.name)}</option>`)
            .join("");
    }

    function renderProducts(search = "", categoryId = "", sort = "default") {
        const list = document.getElementById("catalog-products");
        const counter = document.getElementById("catalog-count");
        if (!list || !counter) return;

        const visible = filterProducts(search, categoryId, sort);
        counter.textContent = `${visible.length} producto${visible.length === 1 ? "" : "s"}`;
        list.innerHTML = visible.length
            ? visible.map(renderProductCard).join("")
            : `<div class="col-12">${StoreUtils.renderEmptyState({
                icon: "bi-search",
                title: "No encontramos productos",
                text: "Prueba con otro término o cambia la categoría seleccionada.",
                actionHref: "#/catalogo",
                actionText: "Ver todo el catálogo"
            })}</div>`;
        bindProductButtons();
    }

    function filterProducts(search, categoryId, sort) {
        const term = search.trim().toLowerCase();
        const visible = products.filter(product => {
            const matchesSearch = !term
                || String(product.name || "").toLowerCase().includes(term)
                || String(product.description || "").toLowerCase().includes(term)
                || StoreUtils.categoryName(product).toLowerCase().includes(term);
            const matchesCategory = !categoryId || String(product.category?.id) === String(categoryId);
            return matchesSearch && matchesCategory;
        });

        return [...visible].sort((a, b) => {
            if (sort === "price-asc") return Number(a.price) - Number(b.price);
            if (sort === "price-desc") return Number(b.price) - Number(a.price);
            if (sort === "stock-desc") return Number(b.stock) - Number(a.stock);
            return Number(b.stock > 0) - Number(a.stock > 0);
        });
    }

    async function mountDetail(params) {
        await loadProductDetail(params.id);
    }

    async function loadProductDetail(id) {
        const container = document.getElementById("product-detail");
        if (!container) return;
        container.innerHTML = `<div class="route-loading"><div class="spinner-border text-primary" role="status"></div></div>`;
        try {
            const product = await Api.getProductById(id);
            products = products.some(item => Number(item.id) === Number(product.id)) ? products : [product, ...products];
            renderProductDetail(product);
        } catch {
            container.innerHTML = StoreUtils.renderEmptyState({
                icon: "bi-box-seam",
                title: "Producto no encontrado",
                text: "El producto que buscas no está disponible o fue actualizado.",
                actionHref: "#/catalogo",
                actionText: "Volver al catálogo"
            });
        }
    }

    function renderProductDetail(product) {
        const container = document.getElementById("product-detail");
        if (!container) return;
        const stock = stockInfo(product);
        container.innerHTML = `
            <div class="product-detail-grid">
                <div class="detail-image">
                    <img src="${StoreUtils.escapeHtml(StoreUtils.productImage(product))}" alt="${StoreUtils.escapeHtml(product.name)}" ${StoreUtils.imageFallbackAttr()}>
                </div>
                <div class="detail-info">
                    <span class="badge rounded-pill text-bg-light">${StoreUtils.escapeHtml(StoreUtils.categoryName(product))}</span>
                    <h1>${StoreUtils.escapeHtml(product.name)}</h1>
                    <div class="detail-price">${StoreUtils.formatCurrency(product.price)}</div>
                    <span class="badge stock-badge ${stock.className}">${stock.detailLabel}</span>
                    <p class="mt-3">${StoreUtils.escapeHtml(product.description)}</p>
                    <div class="d-flex flex-wrap gap-2 mt-4">
                        <button class="btn btn-primary btn-lg" data-add-product="${product.id}" ${Number(product.stock || 0) <= 0 ? "disabled" : ""}>
                            <i class="bi bi-cart-plus me-2"></i>Agregar al carrito
                        </button>
                        <a class="btn btn-outline-secondary btn-lg" href="#/catalogo">Volver al catálogo</a>
                    </div>
                    <div class="benefit-grid">
                        <div><i class="bi bi-shield-check"></i><strong>Compra segura</strong><span>Proceso simple y protegido.</span></div>
                        <div><i class="bi bi-box-seam"></i><strong>Stock actualizado</strong><span>Disponibilidad revisada antes de confirmar.</span></div>
                        <div><i class="bi bi-headset"></i><strong>Atención personalizada</strong><span>Acompañamiento durante tu compra.</span></div>
                    </div>
                </div>
            </div>
            <div class="related-products">
                <div class="section-heading compact-heading">
                    <div>
                        <p class="eyebrow">También te puede interesar</p>
                        <h2>Productos relacionados</h2>
                    </div>
                </div>
                <div class="row g-4" id="related-products"></div>
            </div>
        `;
        renderRelatedProducts(product);
        bindProductButtons();
    }

    function renderRelatedProducts(product) {
        const container = document.getElementById("related-products");
        if (!container) return;
        const related = products
            .filter(item => Number(item.id) !== Number(product.id) && Number(item.category?.id) === Number(product.category?.id))
            .slice(0, 3);
        container.innerHTML = related.length
            ? related.map(renderProductCard).join("")
            : `<div class="col-12"><div class="empty-state compact"><p>No hay productos relacionados por ahora.</p></div></div>`;
        bindProductButtons();
    }

    function renderProductCard(product) {
        const stock = stockInfo(product);
        return `
            <div class="col-md-6 col-xl-4">
                <article class="product-card">
                    <a class="product-image" href="#/producto/${product.id}">
                        <img src="${StoreUtils.escapeHtml(StoreUtils.productImage(product))}" alt="${StoreUtils.escapeHtml(product.name)}" ${StoreUtils.imageFallbackAttr()}>
                    </a>
                    <div class="product-body">
                        <div class="d-flex justify-content-between gap-2 mb-2">
                            <span class="badge rounded-pill text-bg-light">${StoreUtils.escapeHtml(StoreUtils.categoryName(product))}</span>
                            <span class="badge stock-badge ${stock.className}">${stock.cardLabel}</span>
                        </div>
                        <a class="product-title" href="#/producto/${product.id}">${StoreUtils.escapeHtml(product.name)}</a>
                        <p>${StoreUtils.escapeHtml(product.description)}</p>
                        <div class="product-bottom">
                            <strong>${StoreUtils.formatCurrency(product.price)}</strong>
                            <button class="btn btn-primary" data-add-product="${product.id}" ${Number(product.stock || 0) <= 0 ? "disabled" : ""} aria-label="Agregar ${StoreUtils.escapeHtml(product.name)} al carrito">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    function stockInfo(product) {
        const stock = Number(product?.stock || 0);
        if (stock <= 0) return { className: "empty", cardLabel: "Agotado", detailLabel: "Agotado" };
        if (stock <= LOW_STOCK_LIMIT) return { className: "low", cardLabel: "Stock bajo", detailLabel: `${stock} unidades disponibles` };
        return { className: "", cardLabel: "Disponible", detailLabel: `${stock} unidades disponibles` };
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
        loadCatalog,
        renderProducts,
        renderProductCard,
        mountDetail,
        loadProductDetail,
        renderProductDetail,
        renderRelatedProducts,
        allProducts: () => products,
        categories: () => categories,
        productCard: renderProductCard
    };
})();
