const Api = (() => {
    const API_BASE_URL = localStorage.getItem("tecnostore.apiUrl") || "http://localhost:8080/api";

    function currentSession() {
        try {
            return JSON.parse(localStorage.getItem("tecnostore.session"));
        } catch {
            return null;
        }
    }

    function authHeaders(json = true) {
        const session = currentSession();
        const headers = json ? { "Content-Type": "application/json" } : {};
        if (session?.token) headers.Authorization = `Bearer ${session.token}`;
        return headers;
    }

    async function request(path, options = {}) {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: options.method || "GET",
            headers: authHeaders(true),
            body: options.body ? JSON.stringify(options.body) : undefined
        });

        const data = await parseResponse(response);
        if (!response.ok) {
            throw new Error(data?.message || data?.error || "No se pudo completar la solicitud");
        }
        return data;
    }

    async function upload(path, file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: authHeaders(false),
            body: formData
        });

        const data = await parseResponse(response);
        if (!response.ok) {
            throw new Error(data?.message || data?.error || "No se pudo completar la solicitud");
        }
        return data;
    }

    async function download(path, filename) {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "GET",
            headers: authHeaders(false)
        });
        if (!response.ok) {
            const data = await parseResponse(response);
            throw new Error(data?.message || data?.error || "No se pudo descargar el archivo");
        }
        const blob = await response.blob();
        const disposition = response.headers.get("Content-Disposition") || "";
        const serverName = disposition.match(/filename="?([^"]+)"?/i)?.[1];
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = serverName || filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
    }

    async function parseResponse(response) {
        const text = await response.text();
        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    }

    function query(params = {}) {
        const clean = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "");
        return clean.length ? `?${new URLSearchParams(clean).toString()}` : "";
    }

    return {
        getCategories: () => request("/categories"),
        getAdminCategories: () => request("/categories?includeInactive=true"),
        createCategory: category => request("/categories", { method: "POST", body: category }),
        updateCategory: (id, category) => request(`/categories/${id}`, { method: "PUT", body: category }),
        updateCategoryStatus: (id, active) => request(`/categories/${id}/status`, { method: "PUT", body: { active } }),
        deleteCategory: id => request(`/categories/${id}`, { method: "DELETE" }),
        getAdminDashboard: () => request("/admin/dashboard"),
        getAdminIndicators: () => request("/admin/indicators"),
        getProducts: () => request("/products"),
        getAdminProducts: () => request("/products?includeInactive=true"),
        getProduct: id => request(`/products/${id}`),
        getProductById: id => request(`/products/${id}`),
        getProductsByCategory: categoryId => request(`/products/category/${categoryId}`),
        createProduct: product => request("/products", { method: "POST", body: product }),
        updateProduct: (id, product) => request(`/products/${id}`, { method: "PUT", body: product }),
        updateProductStatus: (id, active) => request(`/products/${id}/status`, { method: "PUT", body: { active } }),
        deleteProduct: id => request(`/products/${id}`, { method: "DELETE" }),
        uploadProductImage: file => upload("/uploads/product-image", file),
        login: credentials => request("/auth/login", { method: "POST", body: credentials }),
        register: user => request("/auth/register", { method: "POST", body: user }),
        createOrder: order => request("/orders", { method: "POST", body: order }),
        getOrders: () => request("/orders"),
        getOrdersByUser: userId => request(`/orders/user/${userId}`),
        getUserOrders: userId => request(`/orders/user/${userId}`),
        getReport: (type, filters) => request(`/reports/${type}${query(filters)}`),
        exportReport: (type, format, filters) => download(`/reports/${type}/${format}${query(filters)}`, `reporte_${type}.${format}`),
        trackVisit: event => request("/analytics/visit", { method: "POST", body: event }),
        trackPerformance: event => request("/analytics/performance", { method: "POST", body: event }),
        trackCart: event => request("/analytics/cart", { method: "POST", body: event })
    };
})();
