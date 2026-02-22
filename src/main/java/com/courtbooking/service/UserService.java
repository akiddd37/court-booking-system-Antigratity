package com.courtbooking.service;

import com.courtbooking.dto.response.UserResponse;
import com.courtbooking.entity.User;
import com.courtbooking.exception.ResourceNotFoundException;
import com.courtbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    /**
     * Get all users (admin only)
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID (admin only)
     */
    public UserResponse getUserById(Long id) {
        User user = findUserById(id);
        return toUserResponse(user);
    }

    /**
     * Activate user
     */
    @Transactional
    public UserResponse activateUser(Long id) {
        User user = findUserById(id);
        user.setIsActive(true);
        userRepository.save(user);
        return toUserResponse(user);
    }

    /**
     * Deactivate user
     */
    @Transactional
    public UserResponse deactivateUser(Long id) {
        User user = findUserById(id);
        user.setIsActive(false);
        userRepository.save(user);
        return toUserResponse(user);
    }

    /**
     * Convert User entity to UserResponse DTO
     */
    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .totalBookings(user.getBookings() != null ? user.getBookings().size() : 0)
                .build();
    }
}
