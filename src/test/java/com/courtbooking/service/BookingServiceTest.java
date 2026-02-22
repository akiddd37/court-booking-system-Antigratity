package com.courtbooking.service;

import com.courtbooking.dto.request.BookingRequest;
import com.courtbooking.dto.response.BookingResponse;
import com.courtbooking.entity.Booking;
import com.courtbooking.entity.Booking.BookingStatus;
import com.courtbooking.entity.Court;
import com.courtbooking.entity.User;
import com.courtbooking.exception.BookingConflictException;
import com.courtbooking.exception.ValidationException;
import com.courtbooking.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookingService Unit Tests")
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserService userService;

    @Mock
    private CourtService courtService;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Court testCourt;
    private BookingRequest validRequest;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");

        // Setup test court
        testCourt = new Court();
        testCourt.setId(1L);
        testCourt.setCourtName("Court A1");
        testCourt.setCourtType("BADMINTON");
        testCourt.setHourlyRate(new BigDecimal("25.00"));
        testCourt.setIsActive(true);

        // Setup valid booking request
        validRequest = new BookingRequest();
        validRequest.setUserId(1L);
        validRequest.setCourtId(1L);
        validRequest.setBookingDate(LocalDate.now().plusDays(1));
        validRequest.setStartTime(LocalTime.of(10, 0));
        validRequest.setEndTime(LocalTime.of(12, 0));
    }

    @Test
    @DisplayName("Should create booking successfully when all validations pass")
    void testCreateBooking_Success() {
        // Arrange
        when(userService.findUserById(1L)).thenReturn(testUser);
        when(courtService.findCourtEntityById(1L)).thenReturn(testCourt);
        when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), any()))
                .thenReturn(new ArrayList<>());

        Booking savedBooking = new Booking();
        savedBooking.setId(1L);
        savedBooking.setUser(testUser);
        savedBooking.setCourt(testCourt);
        savedBooking.setBookingDate(validRequest.getBookingDate());
        savedBooking.setStartTime(validRequest.getStartTime());
        savedBooking.setEndTime(validRequest.getEndTime());
        savedBooking.setStatus(BookingStatus.PENDING);
        savedBooking.setTotalPrice(new BigDecimal("50.00"));

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        // Act
        BookingResponse response = bookingService.createBooking(validRequest);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test User", response.getUserFullName());
        assertEquals("Court A1", response.getCourtName());
        assertEquals(BookingStatus.PENDING, response.getStatus());
        assertEquals(new BigDecimal("50.00"), response.getTotalPrice());

        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw ValidationException when booking date is in the past")
    void testCreateBooking_PastDate() {
        // Arrange
        validRequest.setBookingDate(LocalDate.now().minusDays(1));

        // Act & Assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> bookingService.createBooking(validRequest));

        assertEquals("Booking date cannot be in the past", exception.getMessage());
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw ValidationException when end time is before start time")
    void testCreateBooking_InvalidTimeRange() {
        // Arrange
        validRequest.setStartTime(LocalTime.of(12, 0));
        validRequest.setEndTime(LocalTime.of(10, 0));

        // Act & Assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> bookingService.createBooking(validRequest));

        assertEquals("End time must be after start time", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw ValidationException when booking duration is less than 1 hour")
    void testCreateBooking_DurationTooShort() {
        // Arrange
        validRequest.setStartTime(LocalTime.of(10, 0));
        validRequest.setEndTime(LocalTime.of(10, 30));

        // Act & Assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> bookingService.createBooking(validRequest));

        assertEquals("Minimum booking duration is 1 hour", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw ValidationException when booking duration exceeds 4 hours")
    void testCreateBooking_DurationTooLong() {
        // Arrange
        validRequest.setStartTime(LocalTime.of(10, 0));
        validRequest.setEndTime(LocalTime.of(15, 0));

        // Act & Assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> bookingService.createBooking(validRequest));

        assertEquals("Maximum booking duration is 4 hours", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw BookingConflictException when court is already booked")
    void testCreateBooking_ConflictingBooking() {
        // Arrange
        when(userService.findUserById(1L)).thenReturn(testUser);
        when(courtService.findCourtEntityById(1L)).thenReturn(testCourt);

        Booking existingBooking = new Booking();
        existingBooking.setId(2L);
        List<Booking> conflicts = List.of(existingBooking);

        when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), any()))
                .thenReturn(conflicts);

        // Act & Assert
        BookingConflictException exception = assertThrows(
                BookingConflictException.class,
                () -> bookingService.createBooking(validRequest));

        assertEquals("Court is already booked for the selected time slot", exception.getMessage());
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should calculate price correctly for 2-hour booking")
    void testPriceCalculation() {
        // Arrange
        when(userService.findUserById(1L)).thenReturn(testUser);
        when(courtService.findCourtEntityById(1L)).thenReturn(testCourt);
        when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), any()))
                .thenReturn(new ArrayList<>());

        Booking savedBooking = new Booking();
        savedBooking.setId(1L);
        savedBooking.setUser(testUser);
        savedBooking.setCourt(testCourt);
        savedBooking.setBookingDate(validRequest.getBookingDate());
        savedBooking.setStartTime(validRequest.getStartTime());
        savedBooking.setEndTime(validRequest.getEndTime());
        savedBooking.setStatus(BookingStatus.PENDING);
        savedBooking.setTotalPrice(new BigDecimal("50.00")); // 2 hours * $25/hour

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        // Act
        BookingResponse response = bookingService.createBooking(validRequest);

        // Assert
        assertEquals(new BigDecimal("50.00"), response.getTotalPrice());
    }
}
