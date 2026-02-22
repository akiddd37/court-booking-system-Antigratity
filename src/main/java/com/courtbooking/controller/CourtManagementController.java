package com.courtbooking.controller;

import com.courtbooking.dto.request.CourtRequest;
import com.courtbooking.dto.response.CourtResponse;
import com.courtbooking.entity.Court;
import com.courtbooking.exception.ResourceNotFoundException;
import com.courtbooking.repository.CourtRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Court Management Controller (Admin Only)
 * 
 * Provides CRUD operations for courts.
 * Only accessible by users with ADMIN role.
 */
@RestController
@RequestMapping("/api/admin/courts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Court Management (Admin)", description = "Admin-only APIs for managing courts")
public class CourtManagementController {

        private final CourtRepository courtRepository;

        /**
         * Get all courts (including inactive)
         * 
         * @return list of all courts
         */
        @GetMapping
        @Operation(summary = "Get all courts", description = "Get all courts including inactive ones (admin only)")
        public ResponseEntity<List<CourtResponse>> getAllCourts() {
                List<Court> courts = courtRepository.findAll();

                List<CourtResponse> responses = courts.stream()
                                .map(court -> CourtResponse.builder()
                                                .id(court.getId())
                                                .courtName(court.getCourtName())
                                                .courtType(court.getCourtType())
                                                .hourlyRate(court.getHourlyRate())
                                                .isActive(court.getIsActive())
                                                .build())
                                .toList();

                return ResponseEntity.ok(responses);
        }

        /**
         * Create a new court
         * 
         * @param request court details
         * @return created court
         */
        @PostMapping
        @Operation(summary = "Create court", description = "Create a new court (admin only)")
        public ResponseEntity<CourtResponse> createCourt(@Valid @RequestBody CourtRequest request) {
                Court court = new Court();
                court.setCourtName(request.getCourtName());
                court.setCourtType(request.getCourtType());
                court.setHourlyRate(BigDecimal.valueOf(request.getHourlyRate()));
                court.setIsActive(request.getIsActive());

                court = courtRepository.save(court);

                CourtResponse response = CourtResponse.builder()
                                .id(court.getId())
                                .courtName(court.getCourtName())
                                .courtType(court.getCourtType())
                                .hourlyRate(court.getHourlyRate())
                                .isActive(court.getIsActive())
                                .build();

                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        /**
         * Update an existing court
         * 
         * @param id      court ID
         * @param request updated court details
         * @return updated court
         */
        @PutMapping("/{id}")
        @Operation(summary = "Update court", description = "Update an existing court (admin only)")
        public ResponseEntity<CourtResponse> updateCourt(
                        @PathVariable Long id,
                        @Valid @RequestBody CourtRequest request) {

                Court court = courtRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + id));

                court.setCourtName(request.getCourtName());
                court.setCourtType(request.getCourtType());
                court.setHourlyRate(BigDecimal.valueOf(request.getHourlyRate()));
                court.setIsActive(request.getIsActive());

                court = courtRepository.save(court);

                CourtResponse response = CourtResponse.builder()
                                .id(court.getId())
                                .courtName(court.getCourtName())
                                .courtType(court.getCourtType())
                                .hourlyRate(court.getHourlyRate())
                                .isActive(court.getIsActive())
                                .build();

                return ResponseEntity.ok(response);
        }

        /**
         * Delete a court
         * 
         * @param id court ID
         * @return success message
         */
        @DeleteMapping("/{id}")
        @Operation(summary = "Delete court", description = "Delete a court (admin only)")
        public ResponseEntity<String> deleteCourt(@PathVariable Long id) {
                Court court = courtRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + id));

                courtRepository.delete(court);

                return ResponseEntity.ok("Court deleted successfully");
        }
}
