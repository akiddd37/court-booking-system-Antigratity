package com.courtbooking.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Court Request DTO
 * 
 * Used for creating and updating courts (admin only).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourtRequest {

    @NotBlank(message = "Court name is required")
    @Size(min = 2, max = 100, message = "Court name must be between 2 and 100 characters")
    private String courtName;

    @NotBlank(message = "Court type is required")
    private String courtType; // BADMINTON, TENNIS, BASKETBALL, etc.

    @NotNull(message = "Hourly rate is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0")
    private Double hourlyRate;

    @NotNull(message = "Active status is required")
    private Boolean isActive;
}
