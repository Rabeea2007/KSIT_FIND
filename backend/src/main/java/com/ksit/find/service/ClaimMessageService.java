package com.ksit.find.service;

import com.ksit.find.dto.ClaimMessageRequest;
import com.ksit.find.dto.ClaimMessageResponse;
import com.ksit.find.entity.Claim;
import com.ksit.find.entity.ClaimMessage;
import com.ksit.find.entity.Role;
import com.ksit.find.entity.User;
import com.ksit.find.exception.ForbiddenException;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.repository.ClaimMessageRepository;
import com.ksit.find.repository.ClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ClaimMessageService {
    private final ClaimRepository claimRepository;
    private final ClaimMessageRepository messageRepository;

    public ClaimMessageService(ClaimRepository claimRepository, ClaimMessageRepository messageRepository) {
        this.claimRepository = claimRepository;
        this.messageRepository = messageRepository;
    }

    @Transactional(readOnly = true)
    public List<ClaimMessageResponse> getMessages(UUID claimId, User user) {
        requireClaimAccess(claimId, user);
        return messageRepository.findByClaim_IdOrderByCreatedAtAsc(claimId).stream()
            .map(message -> toResponse(message, user))
            .toList();
    }

    @Transactional
    public ClaimMessageResponse sendMessage(UUID claimId, User user, ClaimMessageRequest request) {
        Claim claim = requireClaimAccess(claimId, user);
        ClaimMessage message = new ClaimMessage();
        message.setClaim(claim);
        message.setSender(user);
        message.setContent(request.getContent().trim());
        return toResponse(messageRepository.save(message), user);
    }

    private Claim requireClaimAccess(UUID claimId, User user) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        boolean participant = claim.getUser().getId().equals(user.getId())
            || claim.getItem().getReporter().getId().equals(user.getId());
        boolean staff = user.getRole() == Role.STAFF || user.getRole() == Role.ADMIN;
        if (!participant && !staff) {
            throw new ForbiddenException("You are not allowed to access this claim discussion");
        }
        return claim;
    }

    private ClaimMessageResponse toResponse(ClaimMessage message, User currentUser) {
        return new ClaimMessageResponse(
            message.getId(),
            message.getSender().getId(),
            message.getContent(),
            message.getCreatedAt(),
            message.getSender().getId().equals(currentUser.getId())
        );
    }
}
