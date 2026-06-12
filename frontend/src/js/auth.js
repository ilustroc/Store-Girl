const Auth = (() => {
    const sessionKey = "tecnostore.session";
    const demoUsers = {
        admin: { email: "admin@gmail.com", password: "admin" },
        user: { email: "usuario@gmail.com", password: "usuario" }
    };

    function init() {
        document.getElementById("btn-logout")?.addEventListener("click", logout);
        refreshUi();
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(sessionKey));
        } catch {
            return null;
        }
    }

    function session() {
        return getCurrentUser();
    }

    function isAdmin() {
        return getCurrentUser()?.role === "ADMIN";
    }

    function saveSession(user) {
        const safeUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };
        localStorage.setItem(sessionKey, JSON.stringify(safeUser));
        refreshUi();
    }

    function logout() {
        localStorage.removeItem(sessionKey);
        Cart.clear();
        refreshUi();
        StoreUtils.toast("Sesión cerrada", "secondary");
        location.hash = "#/home";
    }

    function refreshUi() {
        const current = getCurrentUser();
        document.querySelectorAll(".guest-option").forEach(element => element.classList.toggle("d-none", Boolean(current)));
        document.querySelectorAll(".session-option").forEach(element => element.classList.toggle("d-none", !current));
        document.querySelectorAll(".admin-only").forEach(element => element.classList.toggle("d-none", !isAdmin()));
        const name = document.getElementById("nav-user-name");
        if (name) name.textContent = current ? current.fullName.split(" ")[0] : "Cuenta";
    }

    function getAuthFormData(form) {
        return Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, String(value).trim()]));
    }

    function validateLoginForm(data, form) {
        clearValidation(form);
        const errors = {};
        if (!isValidEmail(data.email)) errors.email = "Ingresa un correo electrónico válido.";
        if (!data.password) errors.password = "Ingresa tu contraseña.";
        return showValidationErrors(form, errors);
    }

    function validateRegisterForm(data, form) {
        clearValidation(form);
        const errors = {};
        if (!data.fullName) errors.fullName = "Ingresa tu nombre completo.";
        if (!isValidEmail(data.email)) errors.email = "Ingresa un correo electrónico válido.";
        if (!data.password) errors.password = "Ingresa una contraseña.";
        return showValidationErrors(form, errors);
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
    }

    function clearValidation(form) {
        form.querySelectorAll(".is-invalid").forEach(input => input.classList.remove("is-invalid"));
        showAuthAlert("");
    }

    function showValidationErrors(form, errors) {
        Object.entries(errors).forEach(([name, message]) => {
            const input = form.elements[name];
            if (!input) return;
            input.classList.add("is-invalid");
            const feedback = input.parentElement.querySelector(".invalid-feedback");
            if (feedback) feedback.textContent = message;
        });

        const hasErrors = Object.keys(errors).length > 0;
        if (hasErrors) {
            showAuthAlert("Completa los campos marcados para continuar.", "warning");
        }
        return !hasErrors;
    }

    function showAuthAlert(message, type = "danger") {
        const alert = document.getElementById("auth-alert");
        if (!alert) return;
        alert.textContent = message;
        alert.className = `alert alert-${type}${message ? "" : " d-none"}`;
    }

    function redirectAfterLogin(user) {
        location.hash = user.role === "ADMIN" ? "#/admin" : "#/catalogo";
    }

    function setLoading(button, loading) {
        if (!button) return;
        button.disabled = loading;
        button.dataset.originalText ||= button.innerHTML;
        button.innerHTML = loading
            ? `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Procesando...`
            : button.dataset.originalText;
    }

    function bindDemoAccess(form) {
        document.querySelectorAll("[data-auth-demo]").forEach(button => {
            button.addEventListener("click", () => {
                const demo = demoUsers[button.dataset.authDemo];
                if (!demo) return;
                form.elements.email.value = demo.email;
                form.elements.password.value = demo.password;
                clearValidation(form);
            });
        });
    }

    async function initLoginPage() {
        const form = document.getElementById("login-page-form");
        if (!form) return;
        bindDemoAccess(form);
        form.addEventListener("submit", async event => {
            event.preventDefault();
            const data = getAuthFormData(form);
            if (!validateLoginForm(data, form)) return;

            const button = event.submitter;
            setLoading(button, true);
            try {
                const user = await Api.login({ email: data.email, password: data.password });
                saveSession(user);
                showAuthAlert("Login correcto. Redirigiendo...", "success");
                StoreUtils.toast(`Bienvenido, ${user.fullName}`, "success");
                redirectAfterLogin(user);
            } catch (error) {
                showAuthAlert(error.message || "Credenciales incorrectas.", "danger");
            } finally {
                setLoading(button, false);
            }
        });
    }

    async function initRegisterPage() {
        const form = document.getElementById("register-page-form");
        if (!form) return;
        form.addEventListener("submit", async event => {
            event.preventDefault();
            const data = getAuthFormData(form);
            if (!validateRegisterForm(data, form)) return;

            const button = event.submitter;
            setLoading(button, true);
            try {
                const user = await Api.register({
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    password: data.password
                });
                saveSession(user);
                showAuthAlert("Registro exitoso. Redirigiendo...", "success");
                StoreUtils.toast("Cuenta creada correctamente", "success");
                redirectAfterLogin(user);
            } catch (error) {
                showAuthAlert(error.message || "No se pudo crear la cuenta.", "danger");
            } finally {
                setLoading(button, false);
            }
        });
    }

    function requireAuth() {
        if (!getCurrentUser()) {
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

    return {
        init,
        session,
        getCurrentUser,
        isAdmin,
        refreshUi,
        mountLogin: initLoginPage,
        mountRegistro: initRegisterPage,
        requireAuth,
        requireAdmin
    };
})();
