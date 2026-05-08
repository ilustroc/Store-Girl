const Components = (() => {
    const layout = [
        { target: "navbar-container", path: "src/view/layout/navbar.html" },
        { target: "footer-container", path: "src/view/layout/footer.html" },
        { target: "modal-container", path: "src/view/layout/modals.html" }
    ];

    async function loadLayout() {
        await Promise.all(layout.map(async component => {
            const target = document.getElementById(component.target);
            const response = await fetch(component.path);
            if (!response.ok) throw new Error(`No se pudo cargar ${component.path}`);
            target.innerHTML = await response.text();
        }));
    }

    async function loadView(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
        return response.text();
    }

    return { loadLayout, loadView };
})();
