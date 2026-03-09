/**
 * BoomArt - Data Store
 * Uses localStorage for persistence (no backend required)
 */
const DataStore = {
    PAINTINGS_KEY: 'boomart_paintings',
    CART_KEY: 'boomart_cart',
    SALES_KEY: 'boomart_sales',
    INIT_KEY: 'boomart_initialized',

    getPaintings() {
        try {
            let data = localStorage.getItem(this.PAINTINGS_KEY);
            let paintings = data ? JSON.parse(data) : [];
            // Add sample paintings only on first visit (for demo)
            if (paintings.length === 0 && !localStorage.getItem(this.INIT_KEY)) {
                localStorage.setItem(this.INIT_KEY, 'true');
                paintings = [
                    { id: '1', title: 'Sunset Dreams', description: 'A vibrant acrylic painting capturing the golden hour over rolling hills. Warm oranges and soft purples blend to create a peaceful evening scene.', price: '2500', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400' },
                    { id: '2', title: 'Ocean Serenity', description: 'Deep sea blues and turquoise waves in a calming seascape. Perfect for bringing coastal vibes to any room.', price: '3200', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400' },
                    { id: '3', title: 'Floral Harmony', description: 'Delicate watercolor flowers in soft pinks and greens. A gentle reminder of nature\'s beauty.', price: '1800', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400' }
                ];
                this.savePaintings(paintings);
            }
            return paintings;
        } catch (e) {
            return [];
        }
    },

    savePaintings(paintings) {
        localStorage.setItem(this.PAINTINGS_KEY, JSON.stringify(paintings));
    },

    addPainting(painting) {
        const paintings = this.getPaintings();
        painting.id = Date.now().toString();
        paintings.push(painting);
        this.savePaintings(paintings);
        return painting;
    },

    updatePainting(id, updates) {
        const paintings = this.getPaintings();
        const index = paintings.findIndex(p => p.id === id);
        if (index !== -1) {
            paintings[index] = { ...paintings[index], ...updates };
            this.savePaintings(paintings);
            return paintings[index];
        }
        return null;
    },

    deletePainting(id) {
        const paintings = this.getPaintings().filter(p => p.id !== id);
        this.savePaintings(paintings);
        return true;
    },

    getPaintingById(id) {
        return this.getPaintings().find(p => p.id === id);
    },

    getCart() {
        try {
            const data = localStorage.getItem(this.CART_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    saveCart(cart) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    },

    addToCart(painting, quantity = 1) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id === painting.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...painting, quantity });
        }
        this.saveCart(cart);
        return cart;
    },

    updateCartQuantity(id, quantity) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return cart;
        if (quantity < 1) return this.removeFromCart(id);
        item.quantity = quantity;
        this.saveCart(cart);
        return cart;
    },

    removeFromCart(id) {
        const cart = this.getCart().filter(item => item.id !== id);
        this.saveCart(cart);
        return cart;
    },

    clearCart() {
        this.saveCart([]);
        return [];
    },

    getSales() {
        try {
            const data = localStorage.getItem(this.SALES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    addSale(sale) {
        const sales = this.getSales();
        sale.id = Date.now().toString();
        sale.date = new Date().toISOString();
        sales.push(sale);
        localStorage.setItem(this.SALES_KEY, JSON.stringify(sales));
        return sale;
    }
};
