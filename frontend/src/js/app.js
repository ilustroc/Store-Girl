document.addEventListener("DOMContentLoaded", async () => {
    await Components.loadLayout();
    Auth.init();
    Cart.init();
    Admin.init();
    await Store.init();
    setupNavbarSearch();
    Router.init();
});

function setupNavbarSearch() {
    document.getElementById("navbar-search-form")?.addEventListener("submit", event => {
        event.preventDefault();
        const term = document.getElementById("navbar-search").value.trim();
        location.hash = term ? `#/catalogo?search=${encodeURIComponent(term)}` : "#/catalogo";
    });
}
