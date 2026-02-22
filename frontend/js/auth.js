/**
 * Authentication Module
 * Handles JWT token management, login/logout, and authentication state
 */

const AUTH_TOKEN_KEY = 'court_booking_token';
const AUTH_USER_KEY = 'court_booking_user';

const auth = {
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User data and token
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            
            // Store token and user info
            this.setToken(data.token);
            this.setUser({
                id: data.id,
                email: data.email,
                fullName: data.fullName,
                role: data.role
            });

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} User data and token
     */
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            const data = await response.json();
            
            // Store token and user info
            this.setToken(data.token);
            this.setUser({
                id: data.id,
                email: data.email,
                fullName: data.fullName,
                role: data.role
            });

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        window.location.href = 'login.html';
    },

    /**
     * Get stored JWT token
     * @returns {string|null} JWT token
     */
    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Set JWT token
     * @param {string} token - JWT token
     */
    setToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },

    /**
     * Get current user info
     * @returns {Object|null} User object
     */
    getUser() {
        const userJson = localStorage.getItem(AUTH_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },

    /**
     * Set user info
     * @param {Object} user - User object
     */
    setUser(user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Check if user is admin
     * @returns {boolean} True if user has admin role
     */
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'ADMIN';
    },

    /**
     * Redirect to login if not authenticated
     * @param {string} returnUrl - URL to return to after login
     */
    requireAuth(returnUrl = null) {
        if (!this.isAuthenticated()) {
            const url = returnUrl || window.location.pathname;
            window.location.href = `login.html?returnUrl=${encodeURIComponent(url)}`;
        }
    },

    /**
     * Redirect to login if not admin
     */
    requireAdmin() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        } else if (!this.isAdmin()) {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index.html';
        }
    },

    /**
     * Get authorization headers for API requests
     * @returns {Object} Headers object with Authorization
     */
    getAuthHeaders() {
        const token = this.getToken();
        if (token) {
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        }
        return {
            'Content-Type': 'application/json'
        };
    }
};
