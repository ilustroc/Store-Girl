const Auth = (() => {
    const key = "tecnostore.session";

    function init() {
        document.getElementById("btn-logout")?.addEventListener("click", logout);
        refreshUi();
    }

    function session() {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    }

    function isAdmin() {
        return session()?.role === "ADMIN";
    }

    function save(user) {
        localStorage.setItem(key, JSON.stringify(user));
        refreshUi();
    }

    function logout() {
        localStorage.removeItem(key);
        Cart.clear();
        refreshUi();
        StoreUtils.toast("Sesión cerrada", "secondary");
        location.hash = "#/home";
    }

    function refreshUi() {
        const current = session();
        document.querySelectorAll(".guest-option").forEach(element => element.classList.toggle("d-none", Boolean(current)));
        document.querySelectorAll(".session-option").forEach(element => element.classList.toggle("d-none", !current));
        document.querySelectorAll(".admin-only").forEach(element => element.classList.toggle("d-none", !isAdmin()));
        const name = document.getElementById("nav-user-name");
        if (name) name.textContent = current ? current.fullName.split(" ")[0] : "Cuenta";
    }

    async function mountLogin() {
        document.getElementById("login-page-form").addEventListener("submit", async event => {
            event.preventDefault();
            const button = event.submitter;
            button.disabled = true;
            try {
                const user = await Api.login({
                    email: document.getElementById("login-email").value.trim(),
                    password: document.getElementById("login-password").value
                });
                save(user);
                StoreUtils.toast(`Bienvenido, ${user.fullName}`, "success");
                location.hash = user.role === "ADMIN" ? "#/admin" : "#/catalogo";
            } catch (error) {
                StoreUtils.toast(error.message, "danger");
            } finally {
                button.disabled = false;
            }
        });
    }

    async function mountRegistro() {
        document.getElementById("register-page-form").addEventListener("submit", async event => {
            event.preventDefault();
            const button = event.submitter;
            button.disabled = true;
            try {
                const user = await Api.register({
                    fullName: document.getElementById("register-name").value.trim(),
                    email: document.getElementById("register-email").value.trim(),
                    phone: document.getElementById("register-phone").value.trim(),
                    password: document.getElementById("register-password").value
                });
                save(user);
                StoreUtils.toast("Cuenta creada correctamente", "success");
                location.hash = "#/catalogo";
            } catch (error) {
                StoreUtils.toast(error.message, "danger");
            } finally {
                button.disabled = false;
            }
        });
    }

    function requireAuth() {
        if (!session()) {
            StoreUtils.toast("Inicia sesión para continuar", "warning");
            location.hash = "#/login";
            return false;
        }
        return true;
    }

    function requireAdmin() {
        if (!isAdmin()) {
            StoreUtils.toast("Solo el administrador puede acceder", "danger");
            location.hash = "#/login";
            return false;
        }
        return true;
    }

    return { init, session, isAdmin, refreshUi, mountLogin, mountRegistro, requireAuth, requireAdmin };
})();
