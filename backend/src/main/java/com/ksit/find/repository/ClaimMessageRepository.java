package com.ksit.find.repository;

import com.ksit.find.entity.ClaimMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClaimMessageRepository extends JpaRepository<ClaimMessage, UUID> {
    List<ClaimMessage> findByClaim_IdOrderByCreatedAtAsc(UUID claimId);
}
