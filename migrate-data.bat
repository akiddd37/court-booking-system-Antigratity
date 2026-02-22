@echo off
REM Script to migrate data from local MySQL to Docker MySQL

echo ========================================
echo Migrating Data to Docker MySQL
echo ========================================

REM Step 1: Export from local MySQL (port 3306)
echo.
echo Step 1: Exporting data from local MySQL...
mysqldump -u root -p --port=3306 court_booking_db > backup.sql

REM Step 2: Import to Docker MySQL (port 3307)
echo.
echo Step 2: Importing data to Docker MySQL...
mysql -u root -p --port=3307 --host=127.0.0.1 court_booking_db < backup.sql

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo Your old users and data are now in Docker!
pause
