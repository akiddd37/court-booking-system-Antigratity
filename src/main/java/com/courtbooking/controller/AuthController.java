package com.courtbooking.controller;

import com.courtbooking.dto.request.LoginRequest;
import com.courtbooking.dto.request.RegisterRequest;
import com.courtbooking.dto.response.AuthResponse;
import com.courtbooking.entity.User;
import com.courtbooking.exception.ValidationException;
import com.courtbooking.repository.UserRepository;
import com.courtbooking.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * 
 * Handles user authentication and registration.
 * Endpoints: /api/auth/login, /api/auth/register
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    /**
     * User login
     * 
     * @param loginRequest login credentials
     * @return JWT token and user info
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {

        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        // Get user from database
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ValidationException("User not found"));

        // Build response
        AuthResponse response = AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * User registration
     * 
     * @param registerRequest registration details
     * @return JWT token and user info
     */
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register new user and return JWT token")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Encrypt password
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(User.UserRole.USER); // Default role is USER

        // Save user
        user = userRepository.save(user);

        // Load user details for token generation
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        // Build response
        AuthResponse response = AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(response);
    }
}
