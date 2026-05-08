const StoreUtils = (() => {
    const moneyFormatter = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN"
    });

    function money(value) {
        return moneyFormatter.format(Number(value || 0));
    }

    function date(value) {
        if (!value) return "-";
        return new Intl.DateTimeFormat("es-PE", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(value));
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

    function categoryName(product) {
        return product?.category?.name || "Sin categoria";
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

    return { money, date, escapeHtml, toast, categoryName, productImage, imageFallbackAttr, orderStatusClass };
})();
