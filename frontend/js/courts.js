// Courts Page Logic

let allCourts = [];
let currentFilter = 'all';

// DOM Elements
const courtsGrid = document.getElementById('courts-grid');
const loading = document.getElementById('loading');
const errorElement = document.getElementById('error');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCourts();
    setupFilters();
});

/**
 * Load courts from API
 */
async function loadCourts() {
    try {
        loading.style.display = 'block';
        errorElement.style.display = 'none';
        courtsGrid.innerHTML = '';

        allCourts = await api.get('/courts');
        displayCourts(allCourts);
        
        loading.style.display = 'none';
    } catch (error) {
        loading.style.display = 'none';
        errorElement.textContent = 'Failed to load courts. Please make sure the backend is running.';
        errorElement.style.display = 'block';
        console.error('Error loading courts:', error);
    }
}

/**
 * Display courts in grid
 * @param {Array} courts - Array of court objects
 */
function displayCourts(courts) {
    if (courts.length === 0) {
        courtsGrid.innerHTML = '<p class="no-results">No courts found.</p>';
        return;
    }

    courtsGrid.innerHTML = courts.map(court => `
        <div class="court-card">
            <div class="court-icon">${getCourtIcon(court.courtType)}</div>
            <h3>${court.courtName}</h3>
            <div class="court-type">${court.courtType}</div>
            <div class="court-price">${utils.formatCurrency(court.hourlyRate)}/hour</div>
            <div class="court-status ${court.isActive ? 'active' : 'inactive'}">
                ${court.isActive ? '✓ Available' : '✗ Unavailable'}
            </div>
            ${court.isActive ? `
                <a href="booking.html?courtId=${court.id}" class="btn btn-primary">Book Now</a>
            ` : `
                <button class="btn btn-disabled" disabled>Unavailable</button>
            `}
        </div>
    `).join('');
}

/**
 * Get icon for court type
 * @param {string} type - Court type
 * @returns {string} Icon emoji
 */
function getCourtIcon(type) {
    const icons = {
        'BADMINTON': '🏸',
        'TENNIS': '🎾',
        'BASKETBALL': '🏀',
        'VOLLEYBALL': '🏐'
    };
    return icons[type] || '🎯';
}

/**
 * Setup filter buttons
 */
function setupFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter courts
            const filterType = button.dataset.type;
            currentFilter = filterType;

            if (filterType === 'all') {
                displayCourts(allCourts);
            } else {
                const filtered = allCourts.filter(court => court.courtType === filterType);
                displayCourts(filtered);
            }
        });
    });
}
