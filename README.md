# 🎾 Court Booking System - Quick Start Guide

## What You Need

1. **Docker Desktop** - Download and install from: https://www.docker.com/products/docker-desktop
   - Windows: Download and run installer
   - Mac: Download and run installer
   - Takes ~5 minutes to install

2. **This project folder** - The entire folder you received

---

## How to Run (3 Simple Steps!)

### Step 1: Install Docker Desktop

- Download from https://www.docker.com/products/docker-desktop
- Install it (accept all defaults)
- **Restart your computer** after installation
- Open Docker Desktop and wait for it to start (whale icon in system tray)

### Step 2: Open Terminal/Command Prompt

- **Windows:** Press `Win + R`, type `cmd`, press Enter
- **Mac:** Press `Cmd + Space`, type `terminal`, press Enter

### Step 3: Navigate to Project Folder and Run

```bash
# Navigate to the project folder (example path, use your actual path)
cd path/to/courtBookingSpringBoot

# Start the application (this will take 2-3 minutes the first time)
docker-compose up
```

**Wait for this message:**

```
court-booking-backend  | Started CourtBookingSystemApplication
```

### Step 4: Open Your Browser

Go to: **http://localhost**

That's it! The application is running! 🎉

---

## How to Stop

Press `Ctrl + C` in the terminal where docker-compose is running.

Or run:

```bash
docker-compose down
```

---

## Troubleshooting

### "Docker is not running"

- Make sure Docker Desktop is open (check system tray for whale icon)
- Wait until the whale icon is steady (not animated)

### "Port already in use"

- Stop any other applications using port 80, 8080, or 3307
- Or restart your computer

### "Cannot connect to Docker daemon"

- Restart Docker Desktop
- Wait 30 seconds and try again

---

## What's Included?

- ✅ Database (MySQL) - automatically set up
- ✅ Backend API (Spring Boot) - automatically built and started
- ✅ Frontend (Web interface) - automatically served

**No manual setup required!** Everything runs in isolated containers.

---

## System Requirements

- **OS:** Windows 10/11, macOS, or Linux
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB free space
- **Internet:** Required for first-time setup (to download Docker images)

---

## Features to Test

1. **Register** a new account
2. **Login** with your account
3. **Browse courts** - View available courts
4. **Book a court** - Select date, time, and duration
5. **View bookings** - See your booking history
6. **Admin features** (if you have admin access):
   - Manage courts
   - View all bookings
   - User management
   - Revenue dashboard

---

## Default Admin Account

**Email:** admin@courtbooking.com  
**Password:** admin123

_(You can create this account by registering and then updating the database)_

---

## Need Help?

If you encounter any issues:

1. Make sure Docker Desktop is running
2. Try restarting Docker Desktop
3. Try running `docker-compose down` then `docker-compose up` again
4. Check that no other applications are using ports 80, 8080, or 3307

---

## Technical Details (Optional)

**Architecture:**

- Frontend: Nginx web server (port 80)
- Backend: Spring Boot REST API (port 8080)
- Database: MySQL 8.0 (port 3307)

**All running in isolated Docker containers!**

---

## Why Docker?

✅ **Consistent Environment** - Works the same on every computer  
✅ **No Manual Setup** - No need to install Java, MySQL, etc.  
✅ **Isolated** - Won't interfere with other software  
✅ **Easy to Clean Up** - Just delete the containers when done

---

**Enjoy using the Court Booking System!** 🎾
