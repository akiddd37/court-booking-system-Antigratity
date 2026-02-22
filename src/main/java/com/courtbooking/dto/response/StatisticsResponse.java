package com.courtbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Statistics Response DTO
 * 
 * Contains general system statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {

    private Integer totalUsers;
    private Integer activeUsers;
    private Integer totalCourts;
    private Integer activeCourts;
    private Integer totalBookings;
    private Integer pendingBookings;
    private Integer confirmedBookings;
    private String mostPopularCourt;
    private String peakHour;
}
