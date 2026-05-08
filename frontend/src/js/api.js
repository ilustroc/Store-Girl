const Api = (() => {
    const baseUrl = localStorage.getItem("tecnostore.apiUrl") || "http://localhost:8080/api";

    function currentSession() {
        try {
            return JSON.parse(localStorage.getItem("tecnostore.session"));
        } catch {
            return null;
        }
    }

    async function request(path, options = {}) {
        const session = currentSession();
        const headers = { "Content-Type": "application/json" };
        if (session?.role) headers["X-User-Role"] = session.role;

        const response = await fetch(`${baseUrl}${path}`, {
            method: options.method || "GET",
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        if (!response.ok) {
            throw new Error(data?.message || data?.error || "No se pudo completar la solicitud");
        }
        return data;
    }

    return {
        getCategories: () => request("/categories"),
        getProducts: () => request("/products"),
        getProduct: id => request(`/products/${id}`),
        getProductsByCategory: categoryId => request(`/products/category/${categoryId}`),
        createProduct: product => request("/products", { method: "POST", body: product }),
        updateProduct: (id, product) => request(`/products/${id}`, { method: "PUT", body: product }),
        deleteProduct: id => request(`/products/${id}`, { method: "DELETE" }),
        login: credentials => request("/auth/login", { method: "POST", body: credentials }),
        register: user => request("/auth/register", { method: "POST", body: user }),
        createOrder: order => request("/orders", { method: "POST", body: order }),
        getOrders: () => request("/orders"),
        getOrdersByUser: userId => request(`/orders/user/${userId}`)
    };
})();
