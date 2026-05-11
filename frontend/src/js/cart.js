const Cart = (() => {
    const key = "tecnostore.cart";
    let items = [];

    function init() {
        items = load();
        renderBadge();
    }

    function load() {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    }

    function save(status = items.length ? "ACTIVE" : "ABANDONED") {
        localStorage.setItem(key, JSON.stringify(items));
        renderBadge();
        trackCart(status);
    }

    function add(product) {
        if (!product || product.stock <= 0) {
            StoreUtils.toast("Producto sin stock disponible", "warning");
            return;
        }
        const existing = items.find(item => Number(item.productId) === Number(product.id));
        if (existing) {
            if (existing.quantity >= product.stock) {
                StoreUtils.toast("Stock maximo alcanzado", "warning");
                return;
            }
            existing.quantity += 1;
        } else {
            items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: StoreUtils.productImage(product),
                stock: product.stock,
                quantity: 1
            });
        }
        save();
        StoreUtils.toast("Producto agregado al carrito", "success");
    }

    function change(productId, delta) {
        const item = items.find(entry => Number(entry.productId) === Number(productId));
        if (!item) return;
        const next = item.quantity + delta;
        if (next <= 0) {
            remove(productId);
            return;
        }
        if (next > item.stock) {
            StoreUtils.toast("No hay mas stock para este producto", "warning");
            return;
        }
        item.quantity = next;
        save();
        renderCartPage();
        renderCheckout();
    }

    function remove(productId) {
        items = items.filter(item => Number(item.productId) !== Number(productId));
        save();
        renderCartPage();
        renderCheckout();
    }

    function clear(status = "ABANDONED") {
        items = [];
        save(status);
    }

    function total() {
        return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    }

    function renderBadge() {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById("cart-count");
        if (badge) badge.textContent = count;
    }

    function rowTemplate(item) {
        return `
            <div class="cart-line">
                <img src="${StoreUtils.escapeHtml(item.image)}" alt="${StoreUtils.escapeHtml(item.name)}" ${StoreUtils.imageFallbackAttr()}>
                <div>
                    <strong>${StoreUtils.escapeHtml(item.name)}</strong>
                    <div class="text-muted small">${StoreUtils.money(item.price)}</div>
                    <div class="cart-line-actions">
                        <div class="quantity-control">
                            <button type="button" data-cart-minus="${item.productId}">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-cart-plus="${item.productId}">+</button>
                        </div>
                        <button class="btn btn-sm btn-link text-danger" data-cart-remove="${item.productId}">Eliminar</button>
                    </div>
                </div>
                <strong>${StoreUtils.money(Number(item.price) * item.quantity)}</strong>
            </div>
        `;
    }

    function renderCartPage() {
        const list = document.getElementById("cart-page-items");
        if (!list) return;
        if (!items.length) {
            list.innerHTML = `<div class="empty-state"><i class="bi bi-cart-x"></i><h2>Tu carrito esta vacio</h2><p>Agrega productos desde el catalogo.</p><a class="btn btn-primary" href="#/catalogo">Ir al catalogo</a></div>`;
        } else {
            list.innerHTML = items.map(rowTemplate).join("");
        }
        const subtotal = document.getElementById("cart-page-subtotal");
        const pageTotal = document.getElementById("cart-page-total");
        if (subtotal) subtotal.textContent = StoreUtils.money(total());
        if (pageTotal) pageTotal.textContent = StoreUtils.money(total());
        bindCartButtons();
    }

    function renderCheckout() {
        const list = document.getElementById("checkout-items");
        if (!list) return;
        list.innerHTML = items.length ? items.map(rowTemplate).join("") : `<div class="empty-state compact"><p>No hay productos para confirmar.</p><a class="btn btn-primary" href="#/catalogo">Comprar productos</a></div>`;
        const user = Auth.session();
        const userBox = document.getElementById("checkout-user");
        if (userBox) {
            userBox.innerHTML = user
                ? `<div class="checkout-user"><strong>${StoreUtils.escapeHtml(user.fullName)}</strong><span>${StoreUtils.escapeHtml(user.email)}</span></div>`
                : `<div class="alert alert-warning">Debes iniciar sesión para confirmar la compra.</div>`;
        }
        const checkoutTotal = document.getElementById("checkout-total");
        if (checkoutTotal) checkoutTotal.textContent = StoreUtils.money(total());
        bindCartButtons();
        document.getElementById("btn-confirm-order")?.addEventListener("click", confirmOrder);
    }

    async function confirmOrder() {
        if (!Auth.requireAuth()) return;
        if (!items.length) {
            StoreUtils.toast("El carrito esta vacio", "warning");
            return;
        }
        const button = document.getElementById("btn-confirm-order");
        button.disabled = true;
        try {
            await Api.createOrder({
                userId: Auth.session().id,
                items: items.map(item => ({ productId: item.productId, quantity: item.quantity }))
            });
            clear("COMPLETED");
            await Store.refresh();
            StoreUtils.toast("Pedido confirmado correctamente", "success");
            location.hash = "#/mis-pedidos";
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        } finally {
            button.disabled = false;
        }
    }

    function bindCartButtons() {
        document.querySelectorAll("[data-cart-minus]").forEach(button => button.onclick = () => change(button.dataset.cartMinus, -1));
        document.querySelectorAll("[data-cart-plus]").forEach(button => button.onclick = () => change(button.dataset.cartPlus, 1));
        document.querySelectorAll("[data-cart-remove]").forEach(button => button.onclick = () => remove(button.dataset.cartRemove));
    }

    function trackCart(status) {
        Api.trackCart({
            userId: Auth.session()?.id || null,
            sessionId: StoreUtils.analyticsSessionId(),
            status
        }).catch(() => {});
    }

    return { init, add, renderCartPage, renderCheckout, clear, total };
})();
