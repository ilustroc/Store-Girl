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
        const table = document.getElementById("orders-table");
        table.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Cargando pedidos...</td></tr>`;
        try {
            const orders = await Api.getOrdersByUser(Auth.session().id);
            table.innerHTML = orders.length
                ? orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${StoreUtils.date(order.createdAt)}</td>
                        <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                        <td>${StoreUtils.money(order.total)}</td>
                        <td><span class="badge text-bg-${StoreUtils.orderStatusClass(order.status)}">${order.status}</span></td>
                    </tr>
                `).join("")
                : `<tr><td colspan="5" class="text-center text-muted py-4">Todavía no tienes pedidos.</td></tr>`;
        } catch (error) {
            table.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">${StoreUtils.escapeHtml(error.message)}</td></tr>`;
        }
    }

    return { init, render };
})();
