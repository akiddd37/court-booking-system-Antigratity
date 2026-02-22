package com.courtbooking.repository;

import com.courtbooking.entity.Booking;
import com.courtbooking.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByCourtIdAndBookingDate(Long courtId, LocalDate bookingDate);

    @Query("SELECT b FROM Booking b WHERE b.court.id = :courtId " +
            "AND b.bookingDate = :date " +
            "AND b.status NOT IN ('CANCELLED') " +
            "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(
            @Param("courtId") Long courtId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
}
