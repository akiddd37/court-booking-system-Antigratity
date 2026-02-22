package com.courtbooking.controller;

import com.courtbooking.dto.response.CourtResponse;
import com.courtbooking.service.CourtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
@Tag(name = "Court Management", description = "APIs for managing courts")
public class CourtController {

    private final CourtService courtService;

    @GetMapping
    @Operation(summary = "Get all active courts", description = "Retrieves a list of all active courts")
    public ResponseEntity<List<CourtResponse>> getAllActiveCourts() {
        return ResponseEntity.ok(courtService.getAllActiveCourts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get court by ID", description = "Retrieves a specific court by its ID")
    public ResponseEntity<CourtResponse> getCourtById(@PathVariable Long id) {
        return ResponseEntity.ok(courtService.getCourtById(id));
    }

    @GetMapping("/type/{courtType}")
    @Operation(summary = "Get courts by type", description = "Retrieves courts filtered by type (e.g., BADMINTON, TENNIS)")
    public ResponseEntity<List<CourtResponse>> getCourtsByType(@PathVariable String courtType) {
        return ResponseEntity.ok(courtService.getCourtsByType(courtType));
    }
}
