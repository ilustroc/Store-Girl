document.addEventListener("DOMContentLoaded", async () => {
    Auth.init();
    Cart.init();
    await Catalog.init();
    await AdminPanel.init();

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            const navbar = bootstrap.Collapse.getInstance(document.getElementById("mainNavbar"));
            if (navbar) navbar.hide();
        });
    });
});
