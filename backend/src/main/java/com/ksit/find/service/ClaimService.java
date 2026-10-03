package com.ksit.find.service;

import com.ksit.find.dto.ClaimRequest;
import com.ksit.find.dto.ClaimResponse;
import com.ksit.find.entity.*;
import com.ksit.find.exception.ConflictException;
import com.ksit.find.exception.ForbiddenException;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.repository.ClaimRepository;
import com.ksit.find.repository.ItemRepository;
import com.ksit.find.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ClaimService {
    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;
    private final AuditLogRepository auditLogRepository;

    public ClaimService(ClaimRepository claimRepository,
                        ItemRepository itemRepository,
                        NotificationService notificationService,
                        AuditLogRepository auditLogRepository) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.notificationService = notificationService;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public ClaimResponse submitClaim(User currentUser, UUID itemId, ClaimRequest request) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (item.getItemType() != ItemType.FOUND || item.getStatus() != ItemStatus.FOUND) {
            throw new ConflictException("Only available found items can be claimed");
        }
        if (item.getReporter().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You cannot claim your own item");
        }

        boolean hasActiveClaim = claimRepository.existsByItemAndUserAndStatusIn(
            item,
            currentUser,
            List.of(ClaimStatus.PENDING, ClaimStatus.APPROVED)
        );
        if (hasActiveClaim) {
            throw new ConflictException("You already have an active claim for this item");
        }

        Claim claim = new Claim();
        claim.setItem(item);
        claim.setUser(currentUser);
        claim.setEvidence(request.getEvidence());
        claim.setStatus(ClaimStatus.PENDING);
        claim = claimRepository.save(claim);

        notificationService.createNotification(
            item.getReporter(),
            item,
            NotificationType.CLAIM_SUBMITTED,
            "A new claim was submitted for '" + item.getTitle() + "'"
        );
        notificationService.createNotification(
            currentUser,
            item,
            NotificationType.CLAIM_SUBMITTED,
            "Your claim for '" + item.getTitle() + "' is pending review"
        );

        return toResponse(claim);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaims(User user) {
        return claimRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ClaimResponse getClaim(UUID id, User user) {
        Claim claim = claimRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (!claim.getUser().getId().equals(user.getId())
            && !claim.getItem().getReporter().getId().equals(user.getId())
            && user.getRole() != Role.ADMIN
            && user.getRole() != Role.STAFF) {
            throw new ForbiddenException("You are not allowed to view this claim");
        }
        return toResponse(claim);
    }

    @Transactional
    public ClaimResponse updateClaim(UUID id, User user, ClaimStatus status) {
        Claim claim = claimRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        boolean reviewer = user.getRole() == Role.ADMIN || user.getRole() == Role.STAFF;
        boolean claimant = claim.getUser().getId().equals(user.getId());
        if (reviewer) {
            if (status != ClaimStatus.APPROVED && status != ClaimStatus.REJECTED) {
                throw new ConflictException("Reviewers can only approve or reject claims");
            }
        } else if (!claimant || status != ClaimStatus.CANCELLED) {
            throw new ForbiddenException("Claimants can only cancel their own pending claims");
        }
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new ConflictException("Only pending claims can be updated");
        }
        if (status == ClaimStatus.APPROVED
            && claim.getItem().getStatus() != ItemStatus.FOUND) {
            throw new ConflictException("This item is no longer available to claim");
        }
        claim.setStatus(status);
        claim = claimRepository.save(claim);

        if (status == ClaimStatus.APPROVED) {
            claim.getItem().setStatus(ItemStatus.CLAIMED);
            for (Claim other : claimRepository.findByItemAndStatus(claim.getItem(), ClaimStatus.PENDING)) {
                if (!other.getId().equals(claim.getId())) {
                    other.setStatus(ClaimStatus.REJECTED);
                    notificationService.createNotification(
                        other.getUser(),
                        claim.getItem(),
                        NotificationType.CLAIM_REJECTED,
                        "Another claim for '" + claim.getItem().getTitle() + "' was approved"
                    );
                }
            }
            notificationService.createNotification(
                claim.getUser(),
                claim.getItem(),
                NotificationType.CLAIM_APPROVED,
                "Your claim for '" + claim.getItem().getTitle() + "' was approved"
            );
        } else if (status == ClaimStatus.REJECTED) {
            notificationService.createNotification(
                claim.getUser(),
                claim.getItem(),
                NotificationType.CLAIM_REJECTED,
                "Your claim for '" + claim.getItem().getTitle() + "' was rejected"
            );
        }
        if (reviewer) {
            auditLogRepository.save(new AuditLog(user, claim.getItem(), "CLAIM_" + status.name(), "Claim " + claim.getId()));
        }
        return toResponse(claim);
    }

    @Transactional
    public void completeHandover(UUID id, User staff) {
        if (staff.getRole() != Role.ADMIN && staff.getRole() != Role.STAFF) {
            throw new ForbiddenException("Only staff can complete a handover");
        }
        Claim claim = claimRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (claim.getStatus() != ClaimStatus.APPROVED || claim.getItem().getStatus() != ItemStatus.CLAIMED) {
            throw new ConflictException("Only approved claims awaiting collection can be handed over");
        }
        claim.getItem().setStatus(ItemStatus.RESOLVED);
        notificationService.createNotification(
            claim.getUser(),
            claim.getItem(),
            NotificationType.ITEM_RESOLVED,
            "The handover for '" + claim.getItem().getTitle() + "' is complete"
        );
        notificationService.createNotification(
            claim.getItem().getReporter(),
            claim.getItem(),
            NotificationType.ITEM_RESOLVED,
            "The item '" + claim.getItem().getTitle() + "' was returned to its owner"
        );
        auditLogRepository.save(new AuditLog(staff, claim.getItem(), "HANDOVER_COMPLETED", "Claim " + claim.getId()));
    }

    public ClaimResponse toResponse(Claim claim) {
        ClaimResponse response = new ClaimResponse();
        response.setId(claim.getId());
        response.setItemId(claim.getItem().getId());
        response.setUserId(claim.getUser().getId());
        response.setItemTitle(claim.getItem().getTitle());
        response.setStatus(claim.getStatus());
        response.setEvidence(claim.getEvidence());
        response.setCreatedAt(claim.getCreatedAt());
        response.setUpdatedAt(claim.getUpdatedAt());
        return response;
    }
}
