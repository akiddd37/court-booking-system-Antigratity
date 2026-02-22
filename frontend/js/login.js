/**
 * Login Page Script
 * Handles user login form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('error');

    // Check if already logged in
    if (auth.isAuthenticated()) {
        // Redirect to return URL or home
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl') || 'index.html';
        window.location.href = returnUrl;
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Disable button and show loading
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="spinner-small"></span> Logging in...';
        errorDiv.style.display = 'none';

        try {
            // Call auth.login
            await auth.login(email, password);

            // Success! Redirect to return URL or home
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('returnUrl') || 'index.html';
            window.location.href = returnUrl;

        } catch (error) {
            showError(error.message || 'Login failed. Please check your credentials.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
});
