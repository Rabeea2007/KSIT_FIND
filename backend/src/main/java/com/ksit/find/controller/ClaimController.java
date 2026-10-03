package com.ksit.find.controller;

import com.ksit.find.dto.ClaimRequest;
import com.ksit.find.dto.ClaimResponse;
import com.ksit.find.entity.ClaimStatus;
import com.ksit.find.entity.User;
import com.ksit.find.service.ClaimService;
import com.ksit.find.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ClaimController {
    private final ClaimService claimService;
    private final UserService userService;

    public ClaimController(ClaimService claimService, UserService userService) {
        this.claimService = claimService;
        this.userService = userService;
    }

    @PostMapping("/items/{id}/claims")
    public ResponseEntity<ClaimResponse> submitClaim(@PathVariable("id") UUID itemId, @Valid @RequestBody ClaimRequest request) {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(claimService.submitClaim(currentUser, itemId, request));
    }

    @GetMapping("/claims/my")
    public ResponseEntity<List<ClaimResponse>> getMyClaims() {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(claimService.getMyClaims(currentUser));
    }

    @GetMapping("/claims/{id}")
    public ResponseEntity<ClaimResponse> getClaim(@PathVariable UUID id) {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(claimService.getClaim(id, currentUser));
    }

    @PutMapping("/claims/{id}")
    public ResponseEntity<ClaimResponse> updateClaim(@PathVariable UUID id, @RequestParam ClaimStatus status) {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(claimService.updateClaim(id, currentUser, status));
    }

    @PostMapping("/claims/{id}/handover")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Void> completeHandover(@PathVariable UUID id) {
        claimService.completeHandover(id, userService.getCurrentUserEntity());
        return ResponseEntity.noContent().build();
    }
}
