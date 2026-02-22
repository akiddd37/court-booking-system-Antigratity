-- Court Booking System Database Schema
-- Run this script in MySQL to create the database structure

-- Create database (if not already created by Spring)
CREATE DATABASE IF NOT EXISTS court_booking_db;
USE court_booking_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Courts Table
CREATE TABLE IF NOT EXISTS courts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    court_name VARCHAR(100) NOT NULL UNIQUE,
    court_type VARCHAR(50) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_court_type (court_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    court_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_court FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
    
    -- Performance Indexes
    INDEX idx_user_bookings (user_id, booking_date),
    INDEX idx_court_bookings (court_id, booking_date),
    INDEX idx_booking_status (status),
    
    -- CRITICAL: Prevent double-booking at database level
    UNIQUE KEY unique_court_booking (court_id, booking_date, start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample courts for testing
INSERT INTO courts (court_name, court_type, hourly_rate, is_active) VALUES
('Court A1', 'BADMINTON', 25.00, TRUE),
('Court A2', 'BADMINTON', 25.00, TRUE),
('Court B1', 'TENNIS', 40.00, TRUE),
('Court C1', 'BASKETBALL', 50.00, TRUE)
ON DUPLICATE KEY UPDATE court_name=court_name;
