const Router = (() => {
    const routes = [
        { pattern: /^\/?$/, view: "src/view/public/home.html", handler: Store.mountHome },
        { pattern: /^\/home$/, view: "src/view/public/home.html", handler: Store.mountHome },
        { pattern: /^\/catalogo$/, view: "src/view/public/catalogo.html", handler: Store.mountCatalog },
        { pattern: /^\/producto\/(\d+)$/, view: "src/view/public/detalle-producto.html", handler: args => Store.mountDetail({ id: args.id }) },
        { pattern: /^\/carrito$/, view: "src/view/public/carrito.html", handler: Cart.renderCartPage },
        { pattern: /^\/checkout$/, view: "src/view/public/checkout.html", handler: Cart.renderCheckout },
        { pattern: /^\/login$/, view: "src/view/auth/login.html", handler: Auth.mountLogin },
        { pattern: /^\/registro$/, view: "src/view/auth/registro.html", handler: Auth.mountRegistro },
        { pattern: /^\/mis-pedidos$/, view: "src/view/user/mis-pedidos.html", handler: mountOrders },
        { pattern: /^\/admin$/, view: "src/view/admin/dashboard.html", handler: guardedAdmin(Admin.mountDashboard) },
        { pattern: /^\/admin\/productos$/, view: "src/view/admin/productos.html", handler: guardedAdmin(Admin.mountProducts) }
    ];

    function init() {
        window.addEventListener("hashchange", render);
        render();
    }

    async function render() {
        const { path, query } = parseHash();
        const match = routes.find(route => route.pattern.test(path)) || routes[1];
        const params = [...path.match(match.pattern)].slice(1);
        const app = document.getElementById("app");
        const routeStart = performance.now();
        app.innerHTML = `<div class="route-loading"><div class="spinner-border text-primary" role="status"></div></div>`;
        try {
            app.innerHTML = await Components.loadView(match.view);
            await match.handler({ params, query, id: params[0] });
            trackRoute(path, Math.round(performance.now() - routeStart));
            setActiveLink(path);
            window.scrollTo({ top: 0, behavior: "smooth" });
            bootstrap.Collapse.getInstance(document.getElementById("mainNavbar"))?.hide();
        } catch (error) {
            app.innerHTML = `<div class="container section-pad"><div class="alert alert-danger">${StoreUtils.escapeHtml(error.message)}</div></div>`;
        }
    }

    function trackRoute(path, loadTimeMs) {
        const page = pageName(path);
        if (!page) return;
        Api.trackVisit({ page, source: "web", sessionId: StoreUtils.analyticsSessionId() }).catch(() => {});
        if (page === "catalogo") {
            Api.trackPerformance({ page, loadTimeMs }).catch(() => {});
        }
    }

    function pageName(path) {
        if (path === "/" || path === "/home") return "home";
        if (path === "/catalogo") return "catalogo";
        if (/^\/producto\/\d+$/.test(path)) return "producto";
        return "";
    }

    function parseHash() {
        const raw = location.hash.replace(/^#/, "") || "/home";
        const [path, queryString = ""] = raw.split("?");
        const query = Object.fromEntries(new URLSearchParams(queryString));
        return { path, query };
    }

    function setActiveLink(path) {
        document.querySelectorAll(".store-navbar .nav-link").forEach(link => {
            const linkPath = link.getAttribute("href")?.replace(/^#/, "");
            link.classList.toggle("active", linkPath === path || (path === "/" && linkPath === "/home"));
        });
    }

    function guardedAdmin(handler) {
        return async args => {
            if (!Auth.requireAdmin()) return;
            await handler(args);
        };
    }

    async function mountOrders() {
        if (!Auth.requireAuth()) return;
        const container = document.getElementById("orders-list");
        if (!container) return;
        container.innerHTML = `<div class="text-center text-muted py-4">Cargando pedidos...</div>`;
        try {
            const orders = await Api.getUserOrders(Auth.session().id);
            container.innerHTML = orders.length
                ? orders.map(orderCard).join("")
                : StoreUtils.renderEmptyState({
                    icon: "bi-bag",
                    title: "Aún no tienes pedidos registrados",
                    text: "Explora el catálogo y guarda aquí el historial de tus compras.",
                    actionHref: "#/catalogo",
                    actionText: "Explorar catálogo"
                });
        } catch (error) {
            container.innerHTML = `<div class="alert alert-danger mb-0">${StoreUtils.escapeHtml(error.message)}</div>`;
        }
    }

    function orderCard(order) {
        const items = Array.isArray(order.items) ? order.items : [];
        const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        const status = StoreUtils.escapeHtml(order.status || "PENDING");
        return `
            <article class="order-card">
                <div class="order-card-head">
                    <div>
                        <span class="text-muted small">Pedido #${order.id}</span>
                        <h3 class="h6 mb-1">${StoreUtils.date(order.createdAt)}</h3>
                        <span class="text-muted small">${quantity} producto${quantity === 1 ? "" : "s"}</span>
                    </div>
                    <div class="text-lg-end">
                        <span class="badge text-bg-${StoreUtils.orderStatusClass(order.status)}">${status}</span>
                        <strong class="d-block mt-2">${StoreUtils.money(order.total || 0)}</strong>
                    </div>
                </div>
                ${orderItemsTemplate(items)}
            </article>
        `;
    }

    function orderItemsTemplate(items) {
        if (!items.length) {
            return `<p class="text-muted mb-0 mt-3">Este pedido no incluye detalle de productos.</p>`;
        }
        return `
            <div class="order-items">
                ${items.map(item => {
                    const product = item.product || {};
                    const productName = product.name || item.productName || "Producto";
                    const quantity = Number(item.quantity || 0);
                    const unitPrice = Number(item.unitPrice ?? product.price ?? 0);
                    const subtotal = Number(item.subtotal ?? unitPrice * quantity);
                    return `
                        <div class="order-item-line">
                            <img src="${StoreUtils.productImage(product)}" alt="${StoreUtils.escapeHtml(productName)}" ${StoreUtils.imageFallbackAttr()}>
                            <div>
                                <strong>${StoreUtils.escapeHtml(productName)}</strong>
                                <span>${quantity} x ${StoreUtils.money(unitPrice)}</span>
                            </div>
                            <strong>${StoreUtils.money(subtotal)}</strong>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    }

    return { init, render };
})();
