// My Bookings Page Logic

// DOM Elements
const bookingsContainer = document.getElementById('bookings-container');
const loading = document.getElementById('loading');
const errorElement = document.getElementById('error');
const userIdInput = document.getElementById('userIdSelect');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    auth.requireAuth();
    
    // Auto-fill user ID and load bookings
    const user = auth.getUser();
    if (user) {
        document.getElementById('userIdSelect').value = user.id;
        loadBookings();
    }
});

/**
 * Load user bookings
 */
async function loadBookings() {
    const userId = userIdInput.value;
    
    if (!userId || userId < 1) {
        utils.showError('Please enter a valid user ID', errorElement);
        return;
    }

    try {
        loading.style.display = 'block';
        errorElement.style.display = 'none';
        bookingsContainer.innerHTML = '';

        const bookings = await api.get(`/bookings/user/${userId}`);
        displayBookings(bookings);
        
        loading.style.display = 'none';
    } catch (error) {
        loading.style.display = 'none';
        console.error('Error loading bookings:', error);
        
        if (error.status === 404) {
            bookingsContainer.innerHTML = '<p class="no-results">No bookings found for this user.</p>';
        } else {
            utils.showError('Failed to load bookings. Please try again.', errorElement);
        }
    }
}

/**
 * Display bookings
 * @param {Array} bookings - Array of booking objects
 */
function displayBookings(bookings) {
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div class="empty-state">
                <h3>📭 No Bookings Yet</h3>
                <p>You haven't made any bookings.</p>
                <a href="index.html" class="btn btn-primary">Browse Courts</a>
            </div>
        `;
        return;
    }

    // Sort bookings by date (newest first)
    bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    bookingsContainer.innerHTML = bookings.map(booking => `
        <div class="booking-card ${booking.status.toLowerCase()}">
            <div class="booking-header">
                <h3>${booking.courtName}</h3>
                <span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
            
            <div class="booking-details">
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
                <div class="detail-row">
                    <span class="label">🆔 Booking ID:</span>
                    <span class="value">#${booking.id}</span>
                </div>
            </div>

            ${booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? `
                <button 
                    class="btn btn-danger" 
                    onclick="cancelBooking(${booking.id})"
                >
                    Cancel Booking
                </button>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Cancel a booking
 * @param {number} bookingId - Booking ID to cancel
 */
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        await api.put(`/bookings/${bookingId}/cancel`);
        
        // Show success and reload
        alert('✓ Booking cancelled successfully');
        loadBookings();
        
    } catch (error) {
        console.error('Error cancelling booking:', error);
        
        let errorMessage = 'Failed to cancel booking. Please try again.';
        if (error.message) {
            errorMessage = error.message;
        }
        
        alert(`⚠ ${errorMessage}`);
    }
}
