/**
 * Admin User Management
 * View and manage all users
 */

let allUsers = [];

// DOM Elements
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const usersTableBody = document.getElementById('usersTableBody');
const roleFilter = document.getElementById('roleFilter');
const statusFilter = document.getElementById('statusFilter');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    auth.requireAdmin();
    
    loadUsers();
    
    // Setup filters
    roleFilter.addEventListener('change', filterUsers);
    statusFilter.addEventListener('change', filterUsers);
});

/**
 * Load all users
 */
async function loadUsers() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        
        allUsers = await api.get('/admin/users');
        displayUsers(allUsers);
        
        loading.style.display = 'none';
    } catch (error) {
        loading.style.display = 'none';
        console.error('Error loading users:', error);
        showError('Failed to load users. Please try again.');
    }
}

/**
 * Display users in table
 */
function displayUsers(users) {
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-light);">
                    No users found.
                </td>
            </tr>
        `;
        return;
    }

    usersTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td><strong>${user.fullName}</strong></td>
            <td>${user.email}</td>
            <td>${user.phoneNumber || '-'}</td>
            <td>
                <span class="type-badge ${user.role === 'ADMIN' ? 'type-admin' : 'type-user'}">
                    ${user.role === 'ADMIN' ? '👑' : '👤'} ${user.role}
                </span>
            </td>
            <td>
                <span class="status-badge ${user.isActive ? 'status-active' : 'status-inactive'}">
                    ${user.isActive ? '✓ Active' : '✗ Inactive'}
                </span>
            </td>
            <td>${user.totalBookings}</td>
            <td>${utils.formatDate(user.createdAt)}</td>
            <td class="action-buttons">
                ${user.isActive ? `
                    <button 
                        class="btn-icon btn-toggle" 
                        onclick="deactivateUser(${user.id})" 
                        title="Deactivate User"
                    >
                        🔒
                    </button>
                ` : `
                    <button 
                        class="btn-icon btn-toggle" 
                        onclick="activateUser(${user.id})" 
                        title="Activate User"
                    >
                        🔓
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

/**
 * Filter users
 */
function filterUsers() {
    const selectedRole = roleFilter.value;
    const selectedStatus = statusFilter.value;
    
    let filtered = allUsers;
    
    // Filter by role
    if (selectedRole !== 'all') {
        filtered = filtered.filter(u => u.role === selectedRole);
    }
    
    // Filter by status
    if (selectedStatus === 'active') {
        filtered = filtered.filter(u => u.isActive === true);
    } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(u => u.isActive === false);
    }
    
    displayUsers(filtered);
}

/**
 * Activate user
 */
async function activateUser(userId) {
    if (!confirm('Activate this user account?')) {
        return;
    }

    try {
        await api.put(`/admin/users/${userId}/activate`);
        alert('✓ User activated successfully');
        loadUsers();
    } catch (error) {
        console.error('Error activating user:', error);
        showError('Failed to activate user. Please try again.');
    }
}

/**
 * Deactivate user
 */
async function deactivateUser(userId) {
    if (!confirm('Deactivate this user account?\n\nThe user will not be able to login.')) {
        return;
    }

    try {
        await api.put(`/admin/users/${userId}/deactivate`);
        alert('✓ User deactivated successfully');
        loadUsers();
    } catch (error) {
        console.error('Error deactivating user:', error);
        showError('Failed to deactivate user. Please try again.');
    }
}

/**
 * Show error message
 */
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}
