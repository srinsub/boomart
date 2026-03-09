/**
 * BoomArt - Administrator authentication
 * Session-based; admin must log in to access Manage and Report.
 */
const Auth = {
    STORAGE_KEY: 'boomart_admin',
    // Change this password for your site (or set via first-time setup)
    ADMIN_PASSWORD: 'boomart',

    isAdmin() {
        return sessionStorage.getItem(this.STORAGE_KEY) === 'true';
    },

    login(password) {
        if (password === this.ADMIN_PASSWORD) {
            sessionStorage.setItem(this.STORAGE_KEY, 'true');
            return true;
        }
        return false;
    },

    logout() {
        sessionStorage.removeItem(this.STORAGE_KEY);
    }
};
