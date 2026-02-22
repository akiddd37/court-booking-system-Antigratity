package com.courtbooking.repository;

import com.courtbooking.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourtRepository extends JpaRepository<Court, Long> {

    List<Court> findByIsActiveTrue();

    List<Court> findByCourtTypeAndIsActiveTrue(String courtType);
}
