const Auth = (() => {
    const storageKey = "tecnostore.session";
    let authModal;
    let ordersModal;

    function init() {
        authModal = new bootstrap.Modal(document.getElementById("authModal"));
        ordersModal = new bootstrap.Modal(document.getElementById("ordersModal"));

        document.getElementById("btn-login-nav").addEventListener("click", () => show("login"));
        document.getElementById("btn-register-nav").addEventListener("click", () => show("register"));
        document.getElementById("btn-hero-login").addEventListener("click", () => show("login"));
        document.getElementById("btn-logout").addEventListener("click", logout);
        document.getElementById("btn-my-orders").addEventListener("click", showOrders);
        document.getElementById("login-form").addEventListener("submit", login);
        document.getElementById("register-form").addEventListener("submit", register);

        refreshUi();
    }

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem(storageKey));
        } catch {
            return null;
        }
    }

    function isAdmin() {
        return getSession()?.role === "admin";
    }

    function setSession(user) {
        localStorage.setItem(storageKey, JSON.stringify(user));
        refreshUi();
    }

    function show(tab = "login") {
        const tabId = tab === "register" ? "register-tab" : "login-tab";
        bootstrap.Tab.getOrCreateInstance(document.getElementById(tabId)).show();
        authModal.show();
    }

    async function login(event) {
        event.preventDefault();
        const button = event.submitter;
        button.disabled = true;
        try {
            const response = await Api.login({
                email: document.getElementById("login-email").value.trim(),
                password: document.getElementById("login-password").value
            });
            setSession(response.user);
            authModal.hide();
            StoreUtils.toast(`Bienvenido, ${response.user.fullName}`, "success");
            await afterSessionChange();
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        } finally {
            button.disabled = false;
        }
    }

    async function register(event) {
        event.preventDefault();
        const button = event.submitter;
        button.disabled = true;
        try {
            const response = await Api.register({
                fullName: document.getElementById("register-name").value.trim(),
                email: document.getElementById("register-email").value.trim(),
                phone: document.getElementById("register-phone").value.trim(),
                password: document.getElementById("register-password").value
            });
            setSession(response.user);
            authModal.hide();
            event.target.reset();
            StoreUtils.toast("Cuenta creada correctamente", "success");
            await afterSessionChange();
        } catch (error) {
            StoreUtils.toast(error.message, "danger");
        } finally {
            button.disabled = false;
        }
    }

    async function logout() {
        localStorage.removeItem(storageKey);
        refreshUi();
        await afterSessionChange();
        StoreUtils.toast("Sesion cerrada", "secondary");
    }

    function refreshUi() {
        const session = getSession();
        const guestOptions = document.querySelectorAll(".guest-option");
        const sessionOptions = document.querySelectorAll(".session-option");
        const adminOnly = document.querySelectorAll(".admin-only");
        const adminSection = document.getElementById("admin");
        const adminNavItem = document.getElementById("admin-nav-item");
        const userName = document.getElementById("nav-user-name");

        userName.textContent = session ? session.fullName.split(" ")[0] : "Cuenta";
        guestOptions.forEach(element => element.classList.toggle("d-none", Boolean(session)));
        sessionOptions.forEach(element => element.classList.toggle("d-none", !session));
        adminOnly.forEach(element => element.classList.toggle("d-none", !isAdmin()));
        adminSection.classList.toggle("d-none", !isAdmin());
        adminNavItem.classList.toggle("d-none", !isAdmin());
    }

    async function afterSessionChange() {
        refreshUi();
        if (window.AdminPanel) {
            await AdminPanel.refresh();
        }
    }

    async function showOrders() {
        const session = getSession();
        if (!session) {
            show("login");
            return;
        }
        const table = document.getElementById("my-orders-table");
        table.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Cargando...</td></tr>`;
        ordersModal.show();
        try {
            const orders = await Api.getOrders(session.email);
            table.innerHTML = orders.length
                ? orders.map(order => `
                    <tr>
                        <td><strong>${StoreUtils.escapeHtml(order.orderNumber)}</strong></td>
                        <td>${StoreUtils.date(order.createdAt)}</td>
                        <td>${order.items.reduce((sum, item) => sum + Number(item.quantity), 0)}</td>
                        <td>${StoreUtils.money(order.total)}</td>
                        <td><span class="badge text-bg-${StoreUtils.statusClass(order.status)}">${StoreUtils.escapeHtml(order.status)}</span></td>
                    </tr>
                `).join("")
                : `<tr><td colspan="5" class="text-center text-muted py-4">No tienes pedidos registrados.</td></tr>`;
        } catch (error) {
            table.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">${StoreUtils.escapeHtml(error.message)}</td></tr>`;
        }
    }

    return { init, getSession, isAdmin, show, refreshUi };
})();
