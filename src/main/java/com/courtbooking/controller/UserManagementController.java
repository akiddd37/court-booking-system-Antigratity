package com.courtbooking.controller;

import com.courtbooking.dto.response.UserResponse;
import com.courtbooking.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User Management Controller (Admin Only)
 * 
 * Provides user management operations for admins.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "User Management (Admin)", description = "Admin-only APIs for managing users")
public class UserManagementController {

    private final UserService userService;

    /**
     * Get all users
     * 
     * @return list of all users
     */
    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve all users (admin only)")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Get user by ID
     * 
     * @param id user ID
     * @return user details
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve user details by ID (admin only)")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * Activate user
     * 
     * @param id user ID
     * @return updated user
     */
    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate user", description = "Activate a user account (admin only)")
    public ResponseEntity<UserResponse> activateUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.activateUser(id));
    }

    /**
     * Deactivate user
     * 
     * @param id user ID
     * @return updated user
     */
    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate user", description = "Deactivate a user account (admin only)")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deactivateUser(id));
    }
}
