# Frontend - Court Booking System

Modern, responsive frontend for the Court Booking System built with vanilla HTML, CSS, and JavaScript.

## 🚀 Quick Start

### Prerequisites

- Spring Boot backend running on `http://localhost:8080`
- Modern web browser
- VS Code with Live Server extension (recommended)

### Running the Frontend

**Option 1: VS Code Live Server (Recommended)**

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Opens at `http://127.0.0.1:5500`

**Option 2: Python**

```bash
cd frontend
python -m http.server 5500
```

**Option 3: Node.js**

```bash
npx http-server frontend -p 5500
```

## 📁 Project Structure

```
frontend/
├── index.html           # Court listing page
├── booking.html         # Booking form
├── my-bookings.html     # User's bookings
├── css/
│   └── style.css        # All styles
└── js/
    ├── api.js           # API service layer
    ├── courts.js        # Court listing logic
    ├── booking.js       # Booking form logic
    └── my-bookings.js   # Bookings management
```

## ✨ Features

### 1. Court Listing (index.html)

- View all available courts
- Filter by sport type (Badminton, Tennis, Basketball)
- See hourly rates
- Click "Book Now" to reserve

### 2. Booking Form (booking.html)

- Select court from dropdown
- Choose date (future dates only)
- Set time range (1-4 hours)
- Real-time price calculation
- Form validation
- Error handling for conflicts

### 3. My Bookings (my-bookings.html)

- View all user bookings
- See booking status (Pending, Confirmed, Cancelled, Completed)
- Cancel active bookings
- Sorted by date

## 🎨 Design Features

- **Modern UI**: Clean, card-based design
- **Responsive**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Hover effects and transitions
- **Color-Coded Status**: Visual feedback for booking states
- **Loading States**: Spinners during API calls
- **Error Handling**: User-friendly error messages

## 🔌 API Integration

All API calls go through `js/api.js`:

```javascript
// Example: Get all courts
const courts = await api.get("/courts");

// Example: Create booking
const booking = await api.post("/bookings", bookingData);

// Example: Cancel booking
await api.put("/bookings/123/cancel");
```

## 🛠️ Development Notes

### CORS Configuration

The backend has CORS enabled for:

- `http://127.0.0.1:5500`
- `http://localhost:5500`
- `file://` (for direct file opening)

### User Authentication

Currently uses a simple User ID input (demo purposes).
In production, implement:

- Login/registration system
- JWT tokens
- Session management

### Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern JS)

## 📝 Usage Guide

### Booking a Court

1. **Browse Courts**
   - Go to home page
   - Filter by sport type if desired
   - Click "Book Now" on desired court

2. **Fill Booking Form**
   - Select court (or pre-selected from previous page)
   - Choose future date
   - Set start and end time (1-4 hours)
   - Review calculated price
   - Click "Book Now"

3. **View Bookings**
   - Go to "My Bookings"
   - Enter your User ID
   - Click "Load"
   - See all your bookings

4. **Cancel Booking**
   - In "My Bookings" page
   - Click "Cancel Booking" button
   - Confirm cancellation

## 🐛 Troubleshooting

### "Failed to load courts"

- Ensure backend is running: `mvn spring-boot:run`
- Check backend URL in `js/api.js` (default: `http://localhost:8080/api`)

### CORS Errors

- Make sure `CorsConfig.java` is in backend
- Restart backend after adding CORS config
- Check browser console for specific error

### Booking Conflicts

- Error: "Court already booked"
- Solution: Choose different time slot
- Check availability in "My Bookings" for that court

## 🎯 Next Steps

### Enhancements You Could Add

1. **User Authentication**
   - Login/registration pages
   - JWT token storage
   - Protected routes

2. **Advanced Features**
   - Search functionality
   - Date range picker
   - Booking calendar view
   - Payment integration

3. **UI Improvements**
   - Dark mode toggle
   - More animations
   - Toast notifications
   - Image gallery for courts

4. **Performance**
   - Caching API responses
   - Lazy loading
   - Pagination for bookings

## 📚 Learning Resources

**Concepts Used:**

- Fetch API for HTTP requests
- Async/await for asynchronous code
- DOM manipulation
- Event handling
- Form validation
- CSS Grid and Flexbox
- CSS animations

**Next Learning Steps:**

- React.js or Vue.js frameworks
- State management (Redux, Vuex)
- TypeScript
- Build tools (Webpack, Vite)

---

**Built with ❤️ using Vanilla JavaScript**
