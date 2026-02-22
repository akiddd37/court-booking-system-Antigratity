package com.courtbooking.service;

import com.courtbooking.dto.response.RevenueResponse;
import com.courtbooking.dto.response.StatisticsResponse;
import com.courtbooking.entity.Booking;
import com.courtbooking.entity.Booking.BookingStatus;
import com.courtbooking.repository.BookingRepository;
import com.courtbooking.repository.CourtRepository;
import com.courtbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Analytics Service
 * 
 * Provides analytics and statistics for admin dashboard
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;

    /**
     * Get revenue statistics
     */
    public RevenueResponse getRevenue() {
        List<Booking> allBookings = bookingRepository.findAll();

        // Filter only confirmed and completed bookings for revenue
        List<Booking> revenueBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED ||
                        b.getStatus() == BookingStatus.COMPLETED)
                .collect(Collectors.toList());

        // Calculate total revenue
        BigDecimal totalRevenue = revenueBookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate today's revenue
        LocalDate today = LocalDate.now();
        BigDecimal todayRevenue = revenueBookings.stream()
                .filter(b -> b.getBookingDate().equals(today))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate this week's revenue
        LocalDate weekStart = today.minusDays(today.getDayOfWeek().getValue() - 1);
        BigDecimal weekRevenue = revenueBookings.stream()
                .filter(b -> !b.getBookingDate().isBefore(weekStart))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate this month's revenue
        LocalDate monthStart = today.withDayOfMonth(1);
        BigDecimal monthRevenue = revenueBookings.stream()
                .filter(b -> !b.getBookingDate().isBefore(monthStart))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Revenue by court type
        Map<String, BigDecimal> revenueByType = new HashMap<>();
        revenueBookings.forEach(booking -> {
            String courtType = booking.getCourt().getCourtType();
            revenueByType.merge(courtType, booking.getTotalPrice(), BigDecimal::add);
        });

        return RevenueResponse.builder()
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .weekRevenue(weekRevenue)
                .monthRevenue(monthRevenue)
                .revenueByCourtType(revenueByType)
                .build();
    }

    /**
     * Get general statistics
     */
    public StatisticsResponse getStatistics() {
        // User stats
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(u -> u.getIsActive() != null && u.getIsActive())
                .count();

        // Court stats
        long totalCourts = courtRepository.count();
        long activeCourts = courtRepository.findAll().stream()
                .filter(c -> c.getIsActive() != null && c.getIsActive())
                .count();

        // Booking stats
        List<Booking> allBookings = bookingRepository.findAll();
        long totalBookings = allBookings.size();
        long pendingBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING)
                .count();
        long confirmedBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .count();

        // Most popular court
        String mostPopularCourt = allBookings.isEmpty() ? "N/A"
                : allBookings.stream()
                        .collect(Collectors.groupingBy(
                                b -> b.getCourt().getCourtName(),
                                Collectors.counting()))
                        .entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(Map.Entry::getKey)
                        .orElse("N/A");

        // Peak hour (most common start time)
        String peakHour = allBookings.isEmpty() ? "N/A"
                : allBookings.stream()
                        .collect(Collectors.groupingBy(
                                b -> b.getStartTime().getHour(),
                                Collectors.counting()))
                        .entrySet().stream()
                        .max(Map.Entry.comparingByValue())
                        .map(e -> String.format("%02d:00", e.getKey()))
                        .orElse("N/A");

        return StatisticsResponse.builder()
                .totalUsers((int) totalUsers)
                .activeUsers((int) activeUsers)
                .totalCourts((int) totalCourts)
                .activeCourts((int) activeCourts)
                .totalBookings((int) totalBookings)
                .pendingBookings((int) pendingBookings)
                .confirmedBookings((int) confirmedBookings)
                .mostPopularCourt(mostPopularCourt)
                .peakHour(peakHour)
                .build();
    }
}
