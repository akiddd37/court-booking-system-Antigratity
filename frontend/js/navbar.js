/**
 * Dynamic Navigation Bar
 * Updates navigation based on authentication state
 */

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

function updateNavbar() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;

    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Base menu items
    let menuHTML = `
        <li><a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Courts</a></li>
    `;

    if (auth.isAuthenticated()) {
        const user = auth.getUser();
        
        // Authenticated menu items
        menuHTML += `
            <li><a href="my-bookings.html" ${currentPage === 'my-bookings.html' ? 'class="active"' : ''}>My Bookings</a></li>
        `;

        // Admin menu
        if (auth.isAdmin()) {
            menuHTML += `
                <li><a href="admin.html" ${currentPage === 'admin.html' ? 'class="active"' : ''}>Admin</a></li>
            `;
        }

        // User info and logout
        menuHTML += `
            <li style="color: var(--text-light); padding: 0.5rem 1rem;">
                👤 ${user.fullName}
            </li>
            <li>
                <a href="#" onclick="handleLogout(event)" style="color: var(--danger-color);">Logout</a>
            </li>
        `;
    } else {
        // Not authenticated menu items
        menuHTML += `
            <li><a href="login.html" ${currentPage === 'login.html' ? 'class="active"' : ''}>Login</a></li>
            <li><a href="register.html" ${currentPage === 'register.html' ? 'class="active"' : ''}>Register</a></li>
        `;
    }

    navMenu.innerHTML = menuHTML;
}

function handleLogout(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
    }
}
