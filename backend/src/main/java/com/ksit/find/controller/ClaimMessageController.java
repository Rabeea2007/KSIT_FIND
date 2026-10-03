package com.ksit.find.controller;

import com.ksit.find.dto.ClaimMessageRequest;
import com.ksit.find.dto.ClaimMessageResponse;
import com.ksit.find.service.ClaimMessageService;
import com.ksit.find.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/claims/{claimId}/messages")
public class ClaimMessageController {
    private final ClaimMessageService messageService;
    private final UserService userService;

    public ClaimMessageController(ClaimMessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ClaimMessageResponse>> getMessages(@PathVariable UUID claimId) {
        return ResponseEntity.ok(messageService.getMessages(claimId, userService.getCurrentUserEntity()));
    }

    @PostMapping
    public ResponseEntity<ClaimMessageResponse> sendMessage(@PathVariable UUID claimId,
                                                            @Valid @RequestBody ClaimMessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(claimId, userService.getCurrentUserEntity(), request));
    }
}
