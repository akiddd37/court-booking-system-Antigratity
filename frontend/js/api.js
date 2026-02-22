// API Configuration
// Use relative path /api - Nginx will proxy to backend:8080
const API_BASE_URL = '/api';

// API Service Layer
const api = {
    /**
     * GET request
     * @param {string} endpoint - API endpoint (e.g., '/courts')
     * @returns {Promise} Response data
     */
    async get(endpoint) {
        try {
            const headers = {};
            const token = localStorage.getItem('court_booking_token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: headers
            });

            if (response.status === 401 || response.status === 403) {
                // Unauthorized or Forbidden - redirect to login
                localStorage.removeItem('court_booking_token');
                localStorage.removeItem('court_booking_user');
                window.location.href = 'login.html';
                return;
            }

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request body data
     * @returns {Promise} Response data
     */
    async post(endpoint, data) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            const token = localStorage.getItem('court_booking_token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('court_booking_token');
                localStorage.removeItem('court_booking_user');
                window.location.href = 'login.html';
                return;
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    },

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request body data (optional)
     * @returns {Promise} Response data
     */
    async put(endpoint, data = null) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            const token = localStorage.getItem('court_booking_token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const options = {
                method: 'PUT',
                headers: headers
            };
            
            if (data) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('court_booking_token');
                localStorage.removeItem('court_booking_user');
                window.location.href = 'login.html';
                return;
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            return await response.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            throw error;
        }
    },

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} Response data
     */
    async delete(endpoint) {
        try {
            const headers = {};
            const token = localStorage.getItem('court_booking_token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: headers
            });

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('court_booking_token');
                localStorage.removeItem('court_booking_user');
                window.location.href = 'login.html';
                return;
            }
            
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            return await response.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            throw error;
        }
    }
};

// Utility Functions
const utils = {
    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    formatCurrency(amount) {
        return `RM ${parseFloat(amount).toFixed(2)}`;
    },

    /**
     * Format date
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Format time
     * @param {string} timeString - Time string (HH:mm:ss)
     * @returns {string} Formatted time (HH:mm)
     */
    formatTime(timeString) {
        return timeString.substring(0, 5);
    },

    /**
     * Show error message
     * @param {string} message - Error message
     * @param {HTMLElement} element - Element to display error in
     */
    showError(message, element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    },

    /**
     * Show success message
     * @param {string} message - Success message
     * @param {HTMLElement} element - Element to display success in
     */
    showSuccess(message, element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
};
