package com.courtbooking.controller;

import com.courtbooking.dto.response.RevenueResponse;
import com.courtbooking.dto.response.StatisticsResponse;
import com.courtbooking.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Analytics Controller (Admin Only)
 * 
 * Provides analytics and statistics endpoints
 */
@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Analytics (Admin)", description = "Admin-only analytics and statistics APIs")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Get revenue statistics
     * 
     * @return revenue data
     */
    @GetMapping("/revenue")
    @Operation(summary = "Get revenue statistics", description = "Retrieve revenue data (admin only)")
    public ResponseEntity<RevenueResponse> getRevenue() {
        return ResponseEntity.ok(analyticsService.getRevenue());
    }

    /**
     * Get general statistics
     * 
     * @return system statistics
     */
    @GetMapping("/stats")
    @Operation(summary = "Get statistics", description = "Retrieve system statistics (admin only)")
    public ResponseEntity<StatisticsResponse> getStatistics() {
        return ResponseEntity.ok(analyticsService.getStatistics());
    }
}
