package com.courtbooking.service;

import com.courtbooking.dto.request.BookingRequest;
import com.courtbooking.dto.response.BookingResponse;
import com.courtbooking.entity.Booking;
import com.courtbooking.entity.Booking.BookingStatus;
import com.courtbooking.entity.Court;
import com.courtbooking.entity.User;
import com.courtbooking.exception.BookingConflictException;
import com.courtbooking.exception.ResourceNotFoundException;
import com.courtbooking.exception.ValidationException;
import com.courtbooking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final CourtService courtService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // 1. Validate business rules
        validateBookingRequest(request);

        // 2. Fetch user and court entities
        User user = userService.findUserById(request.getUserId());
        Court court = courtService.findCourtEntityById(request.getCourtId());

        // 3. Check for conflicts (application-level check)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getCourtId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Court is already booked for the selected time slot");
        }

        // 4. Calculate total price
        BigDecimal totalPrice = calculatePrice(court, request);

        // 5. Create and save booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCourt(court);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalPrice(totalPrice);

        Booking savedBooking = bookingRepository.save(booking);

        return toResponse(savedBooking);
    }

    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ValidationException("Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new ValidationException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return toResponse(updatedBooking);
    }

    public List<BookingResponse> getCourtBookings(Long courtId, LocalDate date) {
        return bookingRepository.findByCourtIdAndBookingDate(courtId, date)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ValidationException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking updatedBooking = bookingRepository.save(booking);

        return toResponse(updatedBooking);
    }

    @Transactional
    public BookingResponse rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ValidationException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        Booking updatedBooking = bookingRepository.save(booking);

        return toResponse(updatedBooking);
    }

    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        bookingRepository.delete(booking);
    }

    // ===== VALIDATION METHODS =====

    private void validateBookingRequest(BookingRequest request) {
        // Check if booking date is not in the past
        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Booking date cannot be in the past");
        }

        // Check if end time is after start time
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new ValidationException("End time must be after start time");
        }

        // Check minimum booking duration (e.g., 1 hour)
        long minutes = ChronoUnit.MINUTES.between(request.getStartTime(), request.getEndTime());
        if (minutes < 60) {
            throw new ValidationException("Minimum booking duration is 1 hour");
        }

        // Check maximum booking duration (e.g., 4 hours)
        if (minutes > 240) {
            throw new ValidationException("Maximum booking duration is 4 hours");
        }
    }

    private BigDecimal calculatePrice(Court court, BookingRequest request) {
        long hours = ChronoUnit.HOURS.between(request.getStartTime(), request.getEndTime());

        // If there are remaining minutes, round up to the next hour
        long minutes = ChronoUnit.MINUTES.between(request.getStartTime(), request.getEndTime());
        if (minutes % 60 != 0) {
            hours++;
        }

        return court.getHourlyRate().multiply(BigDecimal.valueOf(hours));
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userFullName(booking.getUser().getFullName())
                .courtId(booking.getCourt().getId())
                .courtName(booking.getCourt().getCourtName())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
