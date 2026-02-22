package com.courtbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Revenue Response DTO
 * 
 * Contains revenue statistics and breakdowns
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueResponse {

    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal weekRevenue;
    private BigDecimal monthRevenue;
    private Map<String, BigDecimal> revenueByCourtType;
}
