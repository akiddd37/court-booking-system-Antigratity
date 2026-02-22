/**
 * Register Page Script
 * Handles user registration form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const errorDiv = document.getElementById('error');

    // Check if already logged in
    if (auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return;
        }

        // Disable button and show loading
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<span class="spinner-small"></span> Creating account...';
        errorDiv.style.display = 'none';

        try {
            // Call auth.register
            await auth.register({
                fullName,
                email,
                phoneNumber,
                password
            });

            // Success! Redirect to home
            window.location.href = 'index.html';

        } catch (error) {
            showError(error.message || 'Registration failed. Please try again.');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
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
