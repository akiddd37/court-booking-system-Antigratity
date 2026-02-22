/**
 * Admin Bookings View
 * View all bookings across all users
 */

let allBookings = [];

// DOM Elements
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const bookingsContainer = document.getElementById('bookingsContainer');
const statusFilter = document.getElementById('statusFilter');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    auth.requireAdmin();
    
    loadAllBookings();
    
    // Setup filter
    statusFilter.addEventListener('change', filterBookings);
});

/**
 * Load all bookings
 */
async function loadAllBookings() {
    try {
        loading.style.display = 'block';
        errorDiv.style.display = 'none';
        bookingsContainer.innerHTML = '';
        
        // Get all bookings from admin endpoint
        allBookings = await api.get('/bookings');
        
        displayBookings(allBookings);
        loading.style.display = 'none';
        
    } catch (error) {
        loading.style.display = 'none';
        console.error('Error loading bookings:', error);
        
        if (error.status === 404) {
            bookingsContainer.innerHTML = `
                <div class="empty-state">
                    <h3>📭 No Bookings Found</h3>
                    <p>There are no bookings in the system yet.</p>
                    <a href="index.html" class="btn btn-primary">Browse Courts</a>
                </div>
            `;
        } else {
            showError('Failed to load bookings. Please try again.');
        }
    }
}

/**
 * Display bookings
 */
function displayBookings(bookings) {
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="empty-state">
                <h3>📭 No Bookings Found</h3>
                <p>No bookings match the selected filter.</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    bookingsContainer.innerHTML = bookings.map(booking => `
        <div class="booking-card ${booking.status.toLowerCase()}">
            <div class="booking-header">
                <h3>${booking.courtName}</h3>
                <span class="status-badge status-${booking.status.toLowerCase()}">
                    ${booking.status}
                </span>
            </div>
            
            <div class="booking-details">
                <div class="detail-row">
                    <span class="label">🆔 Booking ID:</span>
                    <span class="value">#${booking.id}</span>
                </div>
                <div class="detail-row">
                    <span class="label">👤 User ID:</span>
                    <span class="value">${booking.userId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">🏟️ Court:</span>
                    <span class="value">${booking.courtName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">📅 Date:</span>
                    <span class="value">${utils.formatDate(booking.bookingDate)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">⏰ Time:</span>
                    <span class="value">${utils.formatTime(booking.startTime)} - ${utils.formatTime(booking.endTime)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">💰 Price:</span>
                    <span class="value">${utils.formatCurrency(booking.totalPrice)}</span>
                </div>
            </div>

            ${(booking.status === 'PENDING' || booking.status === 'CONFIRMED') ? `
                <div class="booking-actions">
                    ${booking.status === 'PENDING' ? `
                        <button 
                            class="btn btn-success btn-small" 
                            onclick="approveBooking(${booking.id})"
                        >
                            ✓ Approve
                        </button>
                        <button 
                            class="btn btn-warning btn-small" 
                            onclick="rejectBooking(${booking.id})"
                        >
                            ✗ Reject
                        </button>
                    ` : ''}
                    <button 
                        class="btn btn-danger btn-small" 
                        onclick="cancelBooking(${booking.id})"
                    >
                        Cancel
                    </button>
                </div>
            ` : ''}
            
            <div class="booking-actions">
                <button 
                    class="btn btn-danger btn-small" 
                    onclick="deleteBookingPermanently(${booking.id})"
                    style="background: #8b0000;"
                >
                    🗑️ Delete Permanently
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Filter bookings by status
 */
function filterBookings() {
    const selectedStatus = statusFilter.value;
    
    if (selectedStatus === 'all') {
        displayBookings(allBookings);
    } else {
        const filtered = allBookings.filter(b => b.status === selectedStatus);
        displayBookings(filtered);
    }
}

/**
 * Cancel a booking
 */
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        await api.put(`/bookings/${bookingId}/cancel`);
        alert('✓ Booking cancelled successfully');
        loadAllBookings();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showError('Failed to cancel booking. Please try again.');
    }
}

/**
 * Approve a booking
 */
async function approveBooking(bookingId) {
    if (!confirm('Approve this booking?')) {
        return;
    }

    try {
        await api.put(`/bookings/${bookingId}/approve`);
        alert('✓ Booking approved successfully');
        loadAllBookings();
    } catch (error) {
        console.error('Error approving booking:', error);
        showError(error.message || 'Failed to approve booking.');
    }
}

/**
 * Reject a booking
 */
async function rejectBooking(bookingId) {
    if (!confirm('Reject this booking? This action cannot be undone.')) {
        return;
    }

    try {
        await api.put(`/bookings/${bookingId}/reject`);
        alert('✓ Booking rejected');
        loadAllBookings();
    } catch (error) {
        console.error('Error rejecting booking:', error);
        showError(error.message || 'Failed to reject booking.');
    }
}

/**
 * Delete a booking permanently
 */
async function deleteBookingPermanently(bookingId) {
    if (!confirm('⚠️ PERMANENTLY DELETE this booking?\n\nThis action CANNOT be undone!')) {
        return;
    }

    try {
        await api.delete(`/bookings/${bookingId}`);
        alert('✓ Booking deleted permanently');
        loadAllBookings();
    } catch (error) {
        console.error('Error deleting booking:', error);
        showError('Failed to delete booking. Please try again.');
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
