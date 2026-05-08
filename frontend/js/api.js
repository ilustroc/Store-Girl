const Api = (() => {
    const baseUrl = localStorage.getItem("tecnostore.apiUrl") || "http://localhost:8080/api";

    function session() {
        try {
            return JSON.parse(localStorage.getItem("tecnostore.session"));
        } catch {
            return null;
        }
    }

    async function request(path, options = {}) {
        const currentSession = session();
        const headers = {
            "Content-Type": "application/json"
        };
        if (currentSession?.role) {
            headers["X-User-Role"] = currentSession.role;
        }

        const response = await fetch(`${baseUrl}${path}`, {
            method: options.method || "GET",
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        if (!response.ok) {
            throw new Error(data.error || "No se pudo completar la solicitud");
        }
        return data;
    }

    return {
        health: () => request("/health"),
        getProducts: () => request("/products").then(response => response.data),
        createProduct: product => request("/products", { method: "POST", body: product }).then(response => response.data),
        updateProduct: (id, product) => request(`/products/${id}`, { method: "PUT", body: product }).then(response => response.data),
        deleteProduct: id => request(`/products/${id}`, { method: "DELETE" }),
        login: credentials => request("/auth/login", { method: "POST", body: credentials }),
        register: user => request("/auth/register", { method: "POST", body: user }),
        getUsers: () => request("/users").then(response => response.data),
        getOrders: email => {
            const query = email ? `?email=${encodeURIComponent(email)}` : "";
            return request(`/orders${query}`).then(response => response.data);
        },
        createOrder: order => request("/orders", { method: "POST", body: order }).then(response => response.data),
        updateOrderStatus: (orderNumber, status) => request(`/orders/${encodeURIComponent(orderNumber)}/status`, {
            method: "PATCH",
            body: { status }
        })
    };
})();
