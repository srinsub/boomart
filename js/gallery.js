/**
 * BoomArt - Gallery Page Logic
 */
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyGallery = document.getElementById('emptyGallery');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartClose = document.getElementById('cartClose');
    const clearCartBtn = document.getElementById('clearCart');
    const payNowBtn = document.getElementById('payNow');
    const paymentModal = document.getElementById('paymentModal');
    const paymentModalClose = document.getElementById('paymentModalClose');
    const qrCodeImage = document.getElementById('qrCodeImage');
    const paymentAmount = document.getElementById('paymentAmount');
    const printBillBtn = document.getElementById('printBill');
    const paymentDoneBtn = document.getElementById('paymentDone');

    let currentCartForPayment = [];

    // Render gallery
    function renderGallery() {
        const paintings = DataStore.getPaintings();
        
        if (paintings.length === 0) {
            galleryGrid.style.display = 'none';
            emptyGallery.style.display = 'block';
            return;
        }

        emptyGallery.style.display = 'none';
        galleryGrid.style.display = 'grid';
        galleryGrid.innerHTML = paintings.map(painting => `
            <div class="gallery-card">
                <img src="${painting.imageUrl}" alt="${painting.title}" onerror="this.src='https://via.placeholder.com/280x220?text=No+Image'">
                <div class="gallery-card-body">
                    <h3>${painting.title}</h3>
                    <p>${painting.description}</p>
                    <div class="price">$${parseFloat(painting.price).toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="addToCart('${painting.id}')">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }

    // Add to cart (global for onclick)
    window.addToCart = function(id) {
        const painting = DataStore.getPaintingById(id);
        if (painting) {
            DataStore.addToCart(painting);
            updateCartBadge();
            renderCart();
            cartSidebar.classList.add('open');
        }
    };

    // Update quantity (global for onclick)
    window.updateCartQuantity = function(id, delta) {
        const cart = DataStore.getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;
        const newQty = Math.max(1, item.quantity + delta);
        DataStore.updateCartQuantity(id, newQty);
        updateCartBadge();
        renderCart();
    };

    window.removeCartItem = function(id) {
        DataStore.removeFromCart(id);
        updateCartBadge();
        renderCart();
    };

    // Render cart
    function renderCart() {
        const cart = DataStore.getCart();
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span class="price">$${parseFloat(item.price).toFixed(2)}</span>
                    <div class="cart-item-modify">
                        <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button type="button" class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase">+</button>
                        <button type="button" class="btn-remove" onclick="removeCartItem('${item.id}')" title="Remove">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Cart close
    if (cartClose) cartClose.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // Clear cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            DataStore.clearCart();
            updateCartBadge();
            renderCart();
            cartSidebar.classList.remove('open');
        });
    }

    // Pay Now - Show modal with QR Code
    if (payNowBtn) {
        payNowBtn.addEventListener('click', function() {
            const cart = DataStore.getCart();
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            currentCartForPayment = [...cart];

            paymentAmount.textContent = `$${total.toFixed(2)}`;
            // Static QR Code is set in HTML - same for all payments

            paymentModal.classList.add('open');
        });
    }

    // Close payment modal
    if (paymentModalClose) {
        paymentModalClose.addEventListener('click', () => paymentModal.classList.remove('open'));
    }

    // Print Bill
    if (printBillBtn) {
        printBillBtn.addEventListener('click', function() {
            const total = currentCartForPayment.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            const billHtml = `
                <div class="bill-print">
                    <h2>BoomArt - Invoice</h2>
                    <p class="bill-date">Date: ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            ${currentCartForPayment.map(item => `
                                <tr>
                                    <td>${item.title}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${parseFloat(item.price).toFixed(2)}</td>
                                    <td>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="3">Total</td>
                                <td>$${total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="text-align:center; margin-top:24px;">Thank you for supporting Neural teaching students!</p>
                </div>
            `;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html><head><link rel="stylesheet" href="css/style.css"></head>
                <body>${billHtml}</body></html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        });
    }

    // Payment Done - Record sale and clear cart
    if (paymentDoneBtn) {
        paymentDoneBtn.addEventListener('click', function() {
            const total = currentCartForPayment.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            DataStore.addSale({
                items: currentCartForPayment,
                total: total
            });
            DataStore.clearCart();
            updateCartBadge();
            renderCart();
            paymentModal.classList.remove('open');
            cartSidebar.classList.remove('open');
            currentCartForPayment = [];
            alert('Thank you for your purchase! Your contribution supports Neural teaching students.');
        });
    }

    renderGallery();
    renderCart();
    updateCartBadge();
});
