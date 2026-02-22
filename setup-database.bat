@echo off
REM Quick Database Setup Script for Court Booking System

echo ========================================
echo Court Booking System - Database Setup
echo ========================================
echo.

echo This script will help you set up the MySQL database.
echo.
echo Please ensure MySQL is running before proceeding.
echo.

set /p MYSQL_USER="Enter MySQL username (default: root): "
if "%MYSQL_USER%"=="" set MYSQL_USER=root

echo.
echo Connecting to MySQL and creating database...
echo.

mysql -u %MYSQL_USER% -p -e "CREATE DATABASE IF NOT EXISTS court_booking_db; SHOW DATABASES LIKE 'court_booking_db';"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database 'court_booking_db' created successfully!
    echo.
    echo Now loading schema and sample data...
    echo.
    
    mysql -u %MYSQL_USER% -p court_booking_db < database\schema.sql
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✓ Schema and sample data loaded successfully!
        echo.
        echo ========================================
        echo Setup Complete!
        echo ========================================
        echo.
        echo Next steps:
        echo 1. Update src\main\resources\application.properties with your MySQL credentials
        echo 2. Run: mvn spring-boot:run
        echo 3. Access Swagger UI: http://localhost:8080/swagger-ui.html
        echo.
    ) else (
        echo.
        echo ✗ Failed to load schema. Please check the error above.
        echo.
    )
) else (
    echo.
    echo ✗ Failed to create database. Please check:
    echo   - MySQL is running
    echo   - Username and password are correct
    echo   - You have permission to create databases
    echo.
)

pause
