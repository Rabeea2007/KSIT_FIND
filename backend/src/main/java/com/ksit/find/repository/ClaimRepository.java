package com.ksit.find.repository;

import com.ksit.find.entity.Claim;
import com.ksit.find.entity.ClaimStatus;
import com.ksit.find.entity.Item;
import com.ksit.find.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClaimRepository extends JpaRepository<Claim, UUID> {
    List<Claim> findByUserOrderByCreatedAtDesc(User user);
    List<Claim> findByItemOrderByCreatedAtDesc(Item item);
    Optional<Claim> findFirstByItemAndUserAndStatusIn(Item item, User user, List<ClaimStatus> statuses);
    boolean existsByItemAndUserAndStatusIn(Item item, User user, List<ClaimStatus> statuses);
    long countByStatus(ClaimStatus status);
    long countByItemId(UUID itemId);
    List<Claim> findByItemAndStatus(Item item, ClaimStatus status);
}
