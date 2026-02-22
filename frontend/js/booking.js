// Booking Page Logic

let selectedCourt = null;

// DOM Elements
const form = document.getElementById('booking-form');
const courtSelect = document.getElementById('courtId');
const dateInput = document.getElementById('bookingDate');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const pricePreview = document.getElementById('pricePreview');
const durationSpan = document.getElementById('duration');
const hourlyRateSpan = document.getElementById('hourlyRate');
const totalPriceSpan = document.getElementById('totalPrice');
const errorElement = document.getElementById('error');
const successElement = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    auth.requireAuth();
    
    // Auto-fill user ID from logged-in user
    const user = auth.getUser();
    if (user) {
        document.getElementById('userId').value = user.id;
    }
    
    loadCourts();
    setupFormValidation();
    setMinDate();
    
    // Pre-select court if courtId in URL
    const urlParams = new URLSearchParams(window.location.search);
    const courtId = urlParams.get('courtId');
    if (courtId) {
        courtSelect.value = courtId;
        onCourtChange();
    }
});

/**
 * Load courts into dropdown
 */
async function loadCourts() {
    try {
        const courts = await api.get('/courts');
        courtSelect.innerHTML = '<option value="">-- Choose a court --</option>';
        
        courts.forEach(court => {
            if (court.isActive) {
                const option = document.createElement('option');
                option.value = court.id;
                option.textContent = `${court.courtName} - ${court.courtType} (${utils.formatCurrency(court.hourlyRate)}/hr)`;
                option.dataset.rate = court.hourlyRate;
                courtSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading courts:', error);
        utils.showError('Failed to load courts', errorElement);
    }
}

/**
 * Set minimum date to today
 */
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

/**
 * Setup form validation and event listeners
 */
function setupFormValidation() {
    courtSelect.addEventListener('change', onCourtChange);
    startTimeInput.addEventListener('change', calculatePrice);
    endTimeInput.addEventListener('change', calculatePrice);
    form.addEventListener('submit', handleSubmit);
}

/**
 * Handle court selection change
 */
function onCourtChange() {
    const selectedOption = courtSelect.options[courtSelect.selectedIndex];
    if (selectedOption.value) {
        selectedCourt = {
            id: selectedOption.value,
            rate: parseFloat(selectedOption.dataset.rate)
        };
        calculatePrice();
    } else {
        selectedCourt = null;
        pricePreview.style.display = 'none';
    }
}

/**
 * Calculate and display price
 */
function calculatePrice() {
    if (!selectedCourt || !startTimeInput.value || !endTimeInput.value) {
        return;
    }

    const start = startTimeInput.value;
    const end = endTimeInput.value;

    // Calculate duration in hours
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    const durationMinutes = endMinutes - startMinutes;

    if (durationMinutes <= 0) {
        utils.showError('End time must be after start time', errorElement);
        pricePreview.style.display = 'none';
        return;
    }

    if (durationMinutes < 60) {
        utils.showError('Minimum booking duration is 1 hour', errorElement);
        pricePreview.style.display = 'none';
        return;
    }

    if (durationMinutes > 240) {
        utils.showError('Maximum booking duration is 4 hours', errorElement);
        pricePreview.style.display = 'none';
        return;
    }

    // Calculate hours (round up)
    const hours = Math.ceil(durationMinutes / 60);
    const totalPrice = hours * selectedCourt.rate;

    // Display price preview
    durationSpan.textContent = `${hours} hour${hours > 1 ? 's' : ''}`;
    hourlyRateSpan.textContent = utils.formatCurrency(selectedCourt.rate);
    totalPriceSpan.textContent = utils.formatCurrency(totalPrice);
    pricePreview.style.display = 'block';
    errorElement.style.display = 'none';
}

/**
 * Convert time string to minutes
 * @param {string} time - Time in HH:mm format
 * @returns {number} Minutes
 */
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleSubmit(e) {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    errorElement.style.display = 'none';
    successElement.style.display = 'none';

    // Prepare booking data
    const bookingData = {
        userId: parseInt(document.getElementById('userId').value),
        courtId: parseInt(courtSelect.value),
        bookingDate: dateInput.value,
        startTime: startTimeInput.value + ':00',
        endTime: endTimeInput.value + ':00'
    };

    try {
        const result = await api.post('/bookings', bookingData);
        
        // Show success message
        successElement.textContent = `✓ Booking created successfully! Booking ID: ${result.id}`;
        successElement.style.display = 'block';

        // Reset form
        form.reset();
        pricePreview.style.display = 'none';
        selectedCourt = null;

        // Redirect to my bookings after 2 seconds
        setTimeout(() => {
            window.location.href = 'my-bookings.html';
        }, 2000);

    } catch (error) {
        console.error('Booking error:', error);
        
        let errorMessage = 'Failed to create booking. Please try again.';
        
        if (error.status === 409) {
            errorMessage = '⚠ Court is already booked for this time slot. Please choose a different time.';
        } else if (error.status === 400 && error.message) {
            errorMessage = `⚠ ${error.message}`;
        } else if (error.message) {
            errorMessage = `⚠ ${error.message}`;
        }

        utils.showError(errorMessage, errorElement);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}
