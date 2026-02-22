package com.courtbooking.service;

import com.courtbooking.dto.response.CourtResponse;
import com.courtbooking.entity.Court;
import com.courtbooking.exception.ResourceNotFoundException;
import com.courtbooking.repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourtService {

    private final CourtRepository courtRepository;

    public List<CourtResponse> getAllActiveCourts() {
        return courtRepository.findByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CourtResponse> getCourtsByType(String courtType) {
        return courtRepository.findByCourtTypeAndIsActiveTrue(courtType)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourtResponse getCourtById(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + id));
        return toResponse(court);
    }

    public Court findCourtEntityById(Long id) {
        return courtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Court not found with id: " + id));
    }

    private CourtResponse toResponse(Court court) {
        return CourtResponse.builder()
                .id(court.getId())
                .courtName(court.getCourtName())
                .courtType(court.getCourtType())
                .hourlyRate(court.getHourlyRate())
                .isActive(court.getIsActive())
                .build();
    }
}
