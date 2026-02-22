# Troubleshooting: Application Startup Failure

## Problem

Application fails to start with exit code 1.

## Root Cause

Most likely: **MySQL connection failure**

MySQL is running (verified on port 3306), but the application cannot connect. Common causes:

1. Incorrect database credentials
2. Database doesn't exist
3. MySQL user permissions

---

## Solution Steps

### Step 1: Verify MySQL Credentials

Check your MySQL username and password. The default in `application.properties` is:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

If your MySQL password is different, update `src/main/resources/application.properties`.

### Step 2: Create Database and User

Open MySQL command line:

```bash
mysql -u root -p
```

Then run these commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS court_booking_db;

-- Verify it was created
SHOW DATABASES;

-- Create a dedicated user (recommended for production)
CREATE USER IF NOT EXISTS 'courtbooking'@'localhost' IDENTIFIED BY 'courtbooking123';

-- Grant permissions
GRANT ALL PRIVILEGES ON court_booking_db.* TO 'courtbooking'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### Step 3: Update application.properties (if using dedicated user)

If you created the `courtbooking` user, update your credentials:

```properties
spring.datasource.username=courtbooking
spring.datasource.password=courtbooking123
```

### Step 4: Run the Schema Script

```bash
mysql -u root -p court_booking_db < database/schema.sql
```

Or manually in MySQL:

```sql
USE court_booking_db;
SOURCE C:/Users/HP/VScode/courtBookingSpringBoot (Antigravity)/database/schema.sql;
```

### Step 5: Restart the Application

```bash
mvn spring-boot:run
```

---

## Alternative: Use H2 In-Memory Database (For Testing)

If you want to test without MySQL setup, you can temporarily use H2:

### 1. Update pom.xml

Replace MySQL dependency:

```xml
<!-- Comment out MySQL -->
<!--
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
-->

<!-- Add H2 -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. Update application.properties

```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:courtbookingdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop

# H2 Console (optional - for viewing data)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### 3. Run

```bash
mvn clean spring-boot:run
```

Access H2 Console at: `http://localhost:8080/h2-console`

---

## Quick Diagnostic Commands

### Check if MySQL is running

```bash
netstat -an | findstr :3306
```

### Test MySQL connection

```bash
mysql -u root -p -e "SELECT 1"
```

### Check MySQL version

```bash
mysql --version
```

### View Spring Boot logs with full error

```bash
mvn spring-boot:run -X
```

---

## Most Common Fix

**90% of the time, the issue is:**

1. Wrong MySQL password in `application.properties`
2. Database `court_booking_db` doesn't exist

**Quick Fix:**

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE court_booking_db;
EXIT;
```

Then run: `mvn spring-boot:run`
