# 🐳 DOCKERFILE EXPLANATION:
# This file tells Docker how to build a container for your Spring Boot backend
# Using MULTI-STAGE BUILD for smaller final image

# ===== STAGE 1: Build the application =====
FROM maven:3.9-eclipse-temurin-17-alpine AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first (for dependency caching)
COPY pom.xml .

# Download dependencies (cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (creates JAR file)
RUN mvn clean package -DskipTests -B

# ===== STAGE 2: Run the application =====
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
