const Cart = (() => {
    const storageKey = "tecnostore.cart";
    let items = [];

    function init() {
        items = load();
        document.getElementById("btn-checkout").addEventListener("click", checkout);
        render();
    }

    function load() {
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch {
            return [];
        }
    }

    function save() {
        localStorage.setItem(storageKey, JSON.stringify(items));
    }

    function add(product) {
        if (Number(product.stock) <= 0) {
            StoreUtils.toast("Producto sin stock", "warning");
            return;
        }
        const existing = items.find(item => Number(item.productId) === Number(product.id));
        if (existing) {
            if (existing.quantity >= Number(product.stock)) {
                StoreUtils.toast("No hay mas stock disponible", "warning");
                return;
            }
            existing.quantity += 1;
        } else {
            items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock,
                quantity: 1
            });
        }
        save();
        render();
        StoreUtils.toast("Producto agregado al carrito", "success");
    }

    function changeQuantity(productId, delta) {
        const item = items.find(entry => Number(entry.productId) === Number(productId));
        if (!item) return;
        const nextQuantity = item.quantity + delta;
        if (nextQuantity <= 0) {
            remove(productId);
            return;
        }
        if (nextQuantity > Number(item.stock)) {
            StoreUtils.toast("Stock maximo alcanzado", "warning");
            return;
        }
        item.quantity = nextQuantity;
        save();
        render();
    }

    function remove(productId) {
        items = items.filter(item => Number(item.productId) !== Number(productId));
        save();
        render();
    }

    function totals() {
        const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const shipping = subtotal === 0 || subtotal >= 500 ? 0 : 20;
        return { subtotal, shipping, total: subtotal + shipping };
    }

    function render() {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        const list = document.getElementById("cart-items");
        const summary = totals();
        document.getElementById("cart-count").textContent = count;
        document.getElementById("cart-subtotal").textContent = StoreUtils.money(summary.subtotal);
        document.getElementById("cart-shipping").textContent = summary.shipping === 0 ? "Gratis" : StoreUtils.money(summary.shipping);
        document.getElementById("cart-total").textContent = StoreUtils.money(summary.total);

        if (!items.length) {
            list.innerHTML = `<div class="text-center text-muted py-5"><i class="bi bi-cart-x fs-1 d-block mb-2"></i>Tu carrito esta vacio.</div>`;
            return;
        }

        list.innerHTML = items.map(item => `
            <div class="cart-item">
                <img src="${StoreUtils.escapeHtml(item.imageUrl || "assets/img/descarga.png")}" alt="${StoreUtils.escapeHtml(item.name)}">
                <div>
                    <div class="d-flex justify-content-between gap-2">
                        <strong>${StoreUtils.escapeHtml(item.name)}</strong>
                        <button class="btn btn-sm btn-link text-danger p-0" data-cart-remove="${item.productId}" aria-label="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div class="text-muted small mb-2">${StoreUtils.money(item.price)}</div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="quantity-control">
                            <button type="button" data-cart-minus="${item.productId}" aria-label="Restar">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-cart-plus="${item.productId}" aria-label="Sumar">+</button>
                        </div>
                        <strong>${StoreUtils.money(Number(item.price) * item.quantity)}</strong>
                    </div>
                </div>
            </div>
        `).join("");
    }

    async function checkout() {
        const session = Auth.getSession();
        if (!session) {
            Auth.show("login");
            StoreUtils.toast("Inicia sesion para finalizar la compra", "warning");
            return;
        }
        if (!items.length) {
            StoreUtils.toast("Agrega productos antes de comprar", "warning");
            return;
        }

        const button = document.getElementById("btn-checkout");
        button.disabled = true;
        try {
            const order = await Api.createOrder({
                userId: session.id,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });
            items = [];
            save();
            render();
            await Catalog.load();
            if (window.AdminPanel) {
                await AdminPanel.refresh();
            }
            StoreUtils.toast(`Pedido ${order.orderNumber} registrado`, "success");
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        } finally {
            button.disabled = false;
        }
    }

    document.addEventListener("click", event => {
        const minus = event.target.closest("[data-cart-minus]");
        const plus = event.target.closest("[data-cart-plus]");
        const removeButton = event.target.closest("[data-cart-remove]");
        if (minus) changeQuantity(minus.dataset.cartMinus, -1);
        if (plus) changeQuantity(plus.dataset.cartPlus, 1);
        if (removeButton) remove(removeButton.dataset.cartRemove);
    });

    return { init, add, render };
})();
