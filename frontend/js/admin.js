/**
 * Admin Dashboard
 * Display statistics, revenue, and analytics
 */

let revenueChart = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    auth.requireAdmin();
    
    // Display admin name
    const user = auth.getUser();
    if (user) {
        document.getElementById('adminName').textContent = user.fullName;
    }
    
    loadDashboardData();
});

/**
 * Load all dashboard data
 */
async function loadDashboardData() {
    try {
        // Load revenue and statistics in parallel
        const [revenue, stats] = await Promise.all([
            api.get('/admin/analytics/revenue'),
            api.get('/admin/analytics/stats')
        ]);
        
        displayRevenue(revenue);
        displayStatistics(stats);
        renderRevenueChart(revenue.revenueByCourtType);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Show placeholders on error
        displayErrorPlaceholders();
    }
}

/**
 * Display revenue data
 */
function displayRevenue(revenue) {
    document.getElementById('todayRevenue').textContent = 
        `RM ${parseFloat(revenue.todayRevenue || 0).toFixed(2)}`;
    document.getElementById('weekRevenue').textContent = 
        `RM ${parseFloat(revenue.weekRevenue || 0).toFixed(2)}`;
    document.getElementById('monthRevenue').textContent = 
        `RM ${parseFloat(revenue.monthRevenue || 0).toFixed(2)}`;
    document.getElementById('totalRevenue').textContent = 
        `RM ${parseFloat(revenue.totalRevenue || 0).toFixed(2)}`;
}

/**
 * Display statistics
 */
function displayStatistics(stats) {
    document.getElementById('totalCourts').textContent = stats.totalCourts || 0;
    document.getElementById('activeCourts').textContent = stats.activeCourts || 0;
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('activeUsers').textContent = stats.activeUsers || 0;
    document.getElementById('totalBookings').textContent = stats.totalBookings || 0;
    document.getElementById('pendingBookings').textContent = stats.pendingBookings || 0;
    document.getElementById('mostPopularCourt').textContent = stats.mostPopularCourt || 'N/A';
    document.getElementById('peakHour').textContent = stats.peakHour || 'N/A';
}

/**
 * Render revenue chart
 */
function renderRevenueChart(revenueByType) {
    const ctx = document.getElementById('revenueChart');
    
    // Destroy existing chart if any
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    // Prepare data
    const labels = Object.keys(revenueByType || {});
    const data = Object.values(revenueByType || {}).map(v => parseFloat(v));
    
    // Chart colors
    const colors = {
        'BADMINTON': '#ffc107',
        'TENNIS': '#28a745',
        'BASKETBALL': '#17a2b8'
    };
    
    const backgroundColors = labels.map(label => colors[label] || '#6c757d');
    
    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (RM)',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'RM ' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Display error placeholders
 */
function displayErrorPlaceholders() {
    const placeholders = [
        'todayRevenue', 'weekRevenue', 'monthRevenue', 'totalRevenue',
        'totalCourts', 'activeCourts', 'totalUsers', 'activeUsers',
        'totalBookings', 'pendingBookings', 'mostPopularCourt', 'peakHour'
    ];
    
    placeholders.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '-';
        }
    });
}
