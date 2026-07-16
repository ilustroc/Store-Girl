const Cart = (() => {
    const storageKey = "tecnostore.cart";
    let items = [];

    function init() {
        items = getCart();
        renderBadge();
    }

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(status = items.length ? "ACTIVE" : "ABANDONED") {
        localStorage.setItem(storageKey, JSON.stringify(items));
        renderBadge();
        trackCart(status);
    }

    function addToCart(product) {
        if (!product || Number(product.stock) <= 0) {
            StoreUtils.showToast("Producto sin stock disponible", "warning");
            return;
        }

        const existing = items.find(item => Number(item.productId) === Number(product.id));
        if (existing) {
            if (existing.quantity >= Number(product.stock)) {
                StoreUtils.showToast("Stock máximo alcanzado", "warning");
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

        saveCart();
        StoreUtils.showToast("Producto agregado al carrito", "success");
    }

    function removeFromCart(productId) {
        items = items.filter(item => Number(item.productId) !== Number(productId));
        saveCart();
        renderCart();
        renderCheckout();
    }

    function updateQuantity(productId, delta) {
        const item = items.find(entry => Number(entry.productId) === Number(productId));
        if (!item) return;

        const nextQuantity = item.quantity + delta;
        if (nextQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (nextQuantity > Number(item.stock)) {
            StoreUtils.showToast("No hay más stock para este producto", "warning");
            return;
        }

        item.quantity = nextQuantity;
        saveCart();
        renderCart();
        renderCheckout();
    }

    function clear(status = "ABANDONED") {
        items = [];
        saveCart(status);
    }

    function calculateCartTotal() {
        return items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    }

    function calculateItemCount() {
        return items.reduce((sum, item) => sum + Number(item.quantity), 0);
    }

    function renderBadge() {
        const badge = document.getElementById("cart-count");
        if (badge) badge.textContent = calculateItemCount();
    }

    function renderCartPage() {
        renderCart();
    }

    function renderCart() {
        const list = document.getElementById("cart-page-items");
        if (!list) return;

        list.innerHTML = items.length
            ? items.map(cartRowTemplate).join("")
            : StoreUtils.renderEmptyState({
                icon: "bi-cart-x",
                title: "Tu carrito está vacío",
                text: "Agrega productos desde el catálogo y vuelve para revisar tu compra.",
                actionHref: "#/catalogo",
                actionText: "Ver catálogo"
            });

        updateCartSummary();
        bindCartButtons();
    }

    function updateCartSummary() {
        setText("cart-page-count", `${calculateItemCount()} producto${calculateItemCount() === 1 ? "" : "s"}`);
        setText("cart-page-subtotal", StoreUtils.formatCurrency(calculateCartTotal()));
        setText("cart-page-total", StoreUtils.formatCurrency(calculateCartTotal()));
        const checkoutLink = document.getElementById("cart-checkout-link");
        if (checkoutLink) checkoutLink.classList.toggle("disabled", !items.length);
    }

    function renderCheckout() {
        const list = document.getElementById("checkout-items");
        if (!list) return;

        list.innerHTML = items.length
            ? items.map(checkoutRowTemplate).join("")
            : StoreUtils.renderEmptyState({
                icon: "bi-bag-x",
                title: "No hay productos para confirmar",
                text: "Tu carrito está vacío. Agrega productos antes de continuar.",
                actionHref: "#/catalogo",
                actionText: "Comprar productos"
            });

        renderCheckoutUser();
        setText("checkout-total", StoreUtils.formatCurrency(calculateCartTotal()));
        bindCartButtons();
        document.getElementById("btn-confirm-order")?.addEventListener("click", confirmOrder);
    }

    function renderCheckoutUser() {
        const user = Auth.session();
        const userBox = document.getElementById("checkout-user");
        if (!userBox) return;
        userBox.innerHTML = user
            ? `<div class="checkout-user"><strong>${StoreUtils.escapeHtml(user.fullName)}</strong><span>${StoreUtils.escapeHtml(user.email)}</span></div>`
            : `<div class="alert alert-warning">Debes iniciar sesión para confirmar la compra.</div>`;
        const nameInput = document.getElementById("checkout-name");
        if (nameInput && user?.fullName && !nameInput.value) nameInput.value = user.fullName;
    }

    async function confirmOrder() {
        if (!Auth.requireAuth()) return;
        if (!items.length) {
            StoreUtils.showAlert("#checkout-alert", "El carrito está vacío.", "warning");
            return;
        }

        const form = document.getElementById("checkout-form");
        const data = getCheckoutFormData(form);
        if (!validateCheckout(data)) return;

        const button = document.getElementById("btn-confirm-order");
        setButtonLoading(button, true);
        try {
            await Api.createOrder({
                userId: Auth.session().id,
                fullName: data.fullName,
                phone: data.phone,
                address: data.address,
                comment: data.comment,
                items: items.map(item => ({ productId: item.productId, quantity: item.quantity }))
            });
            clear("COMPLETED");
            await Store.refresh();
            StoreUtils.showToast("Pedido confirmado correctamente", "success");
            location.hash = "#/mis-pedidos";
        } catch (error) {
            StoreUtils.showAlert("#checkout-alert", error.message || "No se pudo confirmar el pedido.", "danger");
        } finally {
            setButtonLoading(button, false);
        }
    }

    function getCheckoutFormData(form) {
        if (!form) return {};
        return {
            fullName: document.getElementById("checkout-name").value.trim(),
            phone: document.getElementById("checkout-phone").value.trim(),
            address: document.getElementById("checkout-address").value.trim(),
            comment: document.getElementById("checkout-comment").value.trim()
        };
    }

    function validateCheckout(data) {
        const errors = {
            "checkout-name": !data.fullName,
            "checkout-phone": !/^9\d{8}$/.test(data.phone || ""),
            "checkout-address": !data.address
        };
        Object.entries(errors).forEach(([id, invalid]) => document.getElementById(id)?.classList.toggle("is-invalid", invalid));
        const hasErrors = Object.values(errors).some(Boolean);
        StoreUtils.showAlert("#checkout-alert", hasErrors ? "Completa nombre, teléfono peruano válido y dirección para confirmar tu pedido." : "", "warning");
        return !hasErrors;
    }

    function cartRowTemplate(item) {
        return `
            <div class="cart-line">
                <img src="${StoreUtils.escapeHtml(item.image)}" alt="${StoreUtils.escapeHtml(item.name)}" ${StoreUtils.imageFallbackAttr()}>
                <div>
                    <strong>${StoreUtils.escapeHtml(item.name)}</strong>
                    <div class="text-muted small">Precio unitario: ${StoreUtils.formatCurrency(item.price)}</div>
                    <div class="cart-line-actions">
                        <div class="quantity-control" aria-label="Cantidad">
                            <button type="button" data-cart-minus="${item.productId}" aria-label="Disminuir cantidad">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-cart-plus="${item.productId}" aria-label="Aumentar cantidad">+</button>
                        </div>
                        <button class="btn btn-sm btn-link text-danger" data-cart-remove="${item.productId}">Eliminar</button>
                    </div>
                </div>
                <strong>${StoreUtils.formatCurrency(Number(item.price) * Number(item.quantity))}</strong>
            </div>
        `;
    }

    function checkoutRowTemplate(item) {
        return `
            <div class="checkout-line">
                <img src="${StoreUtils.escapeHtml(item.image)}" alt="${StoreUtils.escapeHtml(item.name)}" ${StoreUtils.imageFallbackAttr()}>
                <div>
                    <strong>${StoreUtils.escapeHtml(item.name)}</strong>
                    <span>${item.quantity} x ${StoreUtils.formatCurrency(item.price)}</span>
                </div>
                <strong>${StoreUtils.formatCurrency(Number(item.price) * Number(item.quantity))}</strong>
            </div>
        `;
    }

    function bindCartButtons() {
        document.querySelectorAll("[data-cart-minus]").forEach(button => button.onclick = () => updateQuantity(button.dataset.cartMinus, -1));
        document.querySelectorAll("[data-cart-plus]").forEach(button => button.onclick = () => updateQuantity(button.dataset.cartPlus, 1));
        document.querySelectorAll("[data-cart-remove]").forEach(button => button.onclick = () => removeFromCart(button.dataset.cartRemove));
    }

    function trackCart(status) {
        Api.trackCart({
            userId: Auth.session()?.id || null,
            sessionId: StoreUtils.analyticsSessionId(),
            status
        }).catch(() => {});
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function setButtonLoading(button, loading) {
        if (!button) return;
        button.disabled = loading;
        button.dataset.originalText ||= button.innerHTML;
        button.innerHTML = loading
            ? `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Confirmando...`
            : button.dataset.originalText;
    }

    return {
        init,
        getCart,
        saveCart,
        add: addToCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        renderCartPage,
        renderCart,
        renderCheckout,
        confirmOrder,
        clear,
        total: calculateCartTotal,
        calculateCartTotal
    };
})();
