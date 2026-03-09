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

// Update cart badge on page load
document.addEventListener('DOMContentLoaded', updateCartBadge);
