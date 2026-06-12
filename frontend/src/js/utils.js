const StoreUtils = (() => {
    const moneyFormatter = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN"
    });

    function money(value) {
        return moneyFormatter.format(Number(value || 0));
    }

    function formatCurrency(value) {
        return money(value);
    }

    function formatNumber(value) {
        return new Intl.NumberFormat("es-PE").format(Number(value || 0));
    }

    function date(value) {
        if (!value) return "-";
        return new Intl.DateTimeFormat("es-PE", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(value));
    }

    function formatDate(value) {
        return date(value);
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function toast(message, type = "primary") {
        const container = document.getElementById("toast-container");
        if (!container) return;
        const id = `toast-${Date.now()}`;
        container.insertAdjacentHTML("beforeend", `
            <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">${escapeHtml(message)}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
                </div>
            </div>
        `);
        const element = document.getElementById(id);
        bootstrap.Toast.getOrCreateInstance(element, { delay: 3200 }).show();
        element.addEventListener("hidden.bs.toast", () => element.remove());
    }

    function showToast(message, type = "primary") {
        toast(message, type);
    }

    function showAlert(container, message, type = "danger") {
        const element = typeof container === "string" ? document.querySelector(container) : container;
        if (!element) return;
        ["success", "danger", "warning", "info", "primary", "secondary"].forEach(item => element.classList.remove(`alert-${item}`));
        element.classList.add("alert", `alert-${type}`);
        element.classList.toggle("d-none", !message);
        element.textContent = message || "";
    }

    function categoryName(product) {
        return product?.category?.name || "Sin categoría";
    }

    function productImage(product) {
        const image = product?.image?.trim();
        if (!image) return fallbackImage();
        if (/^https?:\/\//i.test(image) || image.startsWith("assets/")) return image;
        return fallbackImage();
    }

    function fallbackImage() {
        return "assets/img/descarga.png";
    }

    function getPlaceholderImage() {
        return fallbackImage();
    }

    function imageFallbackAttr() {
        return `onerror="this.onerror=null;this.src='${fallbackImage()}'"`;
    }

    function orderStatusClass(status) {
        return {
            PENDING: "warning",
            CONFIRMED: "success",
            CANCELLED: "danger"
        }[status] || "secondary";
    }

    function renderEmptyState({ icon = "bi-inbox", title = "No hay información", text = "", actionHref = "", actionText = "" } = {}) {
        return `
            <div class="empty-state">
                <i class="bi ${escapeHtml(icon)}"></i>
                <h2>${escapeHtml(title)}</h2>
                ${text ? `<p>${escapeHtml(text)}</p>` : ""}
                ${actionHref && actionText ? `<a class="btn btn-primary" href="${escapeHtml(actionHref)}">${escapeHtml(actionText)}</a>` : ""}
            </div>
        `;
    }

    function analyticsSessionId() {
        const key = "tecnostore.analyticsSession";
        let id = localStorage.getItem(key);
        if (!id) {
            id = `ts-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            localStorage.setItem(key, id);
        }
        return id;
    }

    return {
        money,
        formatCurrency,
        formatNumber,
        date,
        formatDate,
        escapeHtml,
        toast,
        showToast,
        showAlert,
        categoryName,
        productImage,
        getPlaceholderImage,
        imageFallbackAttr,
        orderStatusClass,
        renderEmptyState,
        analyticsSessionId
    };
})();
