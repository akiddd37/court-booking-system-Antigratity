/**
 * Admin Courts Management
 * CRUD operations for court management
 */

let courts = [];
let editingCourtId = null;

// DOM Elements
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const courtsTableBody = document.getElementById('courtsTableBody');
const courtModal = document.getElementById('courtModal');
const courtForm = document.getElementById('courtForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    auth.requireAdmin();
    
    loadCourts();
    setupFormHandler();
});

/**
 * Load all courts
 */
async function loadCourts() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        
        courts = await api.get('/admin/courts');
        displayCourts(courts);
        
        loading.style.display = 'none';
    } catch (error) {
        loading.style.display = 'none';
        console.error('Error loading courts:', error);
        showError('Failed to load courts. Please try again.');
    }
}

/**
 * Display courts in table
 */
function displayCourts(courts) {
    if (courts.length === 0) {
        courtsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-light);">
                    No courts found. Click "Add New Court" to create one.
                </td>
            </tr>
        `;
        return;
    }

    courtsTableBody.innerHTML = courts.map(court => `
        <tr>
            <td>${court.id}</td>
            <td><strong>${court.courtName}</strong></td>
            <td>
                <span class="type-badge type-${court.courtType.toLowerCase()}">
                    ${getCourtIcon(court.courtType)} ${court.courtType}
                </span>
            </td>
            <td>RM ${parseFloat(court.hourlyRate).toFixed(2)}</td>
            <td>
                <span class="status-badge ${court.isActive ? 'status-active' : 'status-inactive'}">
                    ${court.isActive ? '✓ Active' : '✗ Inactive'}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn-icon btn-edit" onclick="showEditModal(${court.id})" title="Edit">
                    ✏️
                </button>
                <button class="btn-icon btn-toggle" onclick="toggleCourtStatus(${court.id})" title="Toggle Status">
                    ${court.isActive ? '🔒' : '🔓'}
                </button>
                <button class="btn-icon btn-delete" onclick="deleteCourt(${court.id})" title="Delete">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Get court icon by type
 */
function getCourtIcon(type) {
    const icons = {
        'BADMINTON': '🏸',
        'TENNIS': '🎾',
        'BASKETBALL': '🏀'
    };
    return icons[type] || '🏟️';
}

/**
 * Show create modal
 */
function showCreateModal() {
    editingCourtId = null;
    modalTitle.textContent = 'Add New Court';
    submitBtn.textContent = 'Create Court';
    courtForm.reset();
    document.getElementById('isActive').checked = true;
    courtModal.style.display = 'flex';
}

/**
 * Show edit modal
 */
function showEditModal(courtId) {
    const court = courts.find(c => c.id === courtId);
    if (!court) return;

    editingCourtId = courtId;
    modalTitle.textContent = 'Edit Court';
    submitBtn.textContent = 'Update Court';
    
    document.getElementById('courtId').value = court.id;
    document.getElementById('courtName').value = court.courtName;
    document.getElementById('courtType').value = court.courtType;
    document.getElementById('hourlyRate').value = court.hourlyRate;
    document.getElementById('isActive').checked = court.isActive;
    
    courtModal.style.display = 'flex';
}

/**
 * Close modal
 */
function closeModal() {
    courtModal.style.display = 'none';
    courtForm.reset();
    editingCourtId = null;
}

/**
 * Setup form handler
 */
function setupFormHandler() {
    courtForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courtData = {
            courtName: document.getElementById('courtName').value.trim(),
            courtType: document.getElementById('courtType').value,
            hourlyRate: parseFloat(document.getElementById('hourlyRate').value),
            isActive: document.getElementById('isActive').checked
        };

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = editingCourtId ? 'Updating...' : 'Creating...';

        try {
            if (editingCourtId) {
                await updateCourt(editingCourtId, courtData);
            } else {
                await createCourt(courtData);
            }
            
            closeModal();
            loadCourts();
            
        } catch (error) {
            console.error('Error saving court:', error);
            showError(error.message || 'Failed to save court. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = editingCourtId ? 'Update Court' : 'Create Court';
        }
    });
}

/**
 * Create new court
 */
async function createCourt(courtData) {
    try {
        await api.post('/admin/courts', courtData);
        alert('✓ Court created successfully!');
    } catch (error) {
        throw error;
    }
}

/**
 * Update court
 */
async function updateCourt(courtId, courtData) {
    try {
        await api.put(`/admin/courts/${courtId}`, courtData);
        alert('✓ Court updated successfully!');
    } catch (error) {
        throw error;
    }
}

/**
 * Delete court
 */
async function deleteCourt(courtId) {
    const court = courts.find(c => c.id === courtId);
    if (!court) return;

    if (!confirm(`Are you sure you want to delete "${court.courtName}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        await api.delete(`/admin/courts/${courtId}`);
        alert('✓ Court deleted successfully!');
        loadCourts();
    } catch (error) {
        console.error('Error deleting court:', error);
        showError('Failed to delete court. It may have active bookings.');
    }
}

/**
 * Toggle court status
 */
async function toggleCourtStatus(courtId) {
    const court = courts.find(c => c.id === courtId);
    if (!court) return;

    const newStatus = !court.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} "${court.courtName}"?`)) {
        return;
    }

    try {
        const updatedCourt = {
            ...court,
            isActive: newStatus
        };
        
        await api.put(`/admin/courts/${courtId}`, updatedCourt);
        loadCourts();
    } catch (error) {
        console.error('Error toggling court status:', error);
        showError('Failed to update court status.');
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

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === courtModal) {
        closeModal();
    }
};
