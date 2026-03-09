/**
 * BoomArt - Common App Utilities
 */
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const cart = DataStore.getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = count;
    }
}

// Mobile nav toggle (hamburger)
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('open');
            toggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
        nav.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                nav.classList.remove('open');
                toggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }
});
