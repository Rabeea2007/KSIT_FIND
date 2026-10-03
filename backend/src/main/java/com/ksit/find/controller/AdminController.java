package com.ksit.find.controller;

import com.ksit.find.dto.AdminStatsResponse;
import com.ksit.find.dto.AuditLogResponse;
import com.ksit.find.dto.ClaimResponse;
import com.ksit.find.dto.ItemResponse;
import com.ksit.find.dto.UserDto;
import com.ksit.find.entity.AuditLog;
import com.ksit.find.entity.Claim;
import com.ksit.find.entity.ItemStatus;
import com.ksit.find.entity.Role;
import com.ksit.find.entity.User;
import com.ksit.find.service.AdminService;
import com.ksit.find.service.ClaimService;
import com.ksit.find.service.ItemService;
import com.ksit.find.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;
    private final ItemService itemService;
    private final ClaimService claimService;
    private final UserService userService;

    public AdminController(AdminService adminService, ItemService itemService, ClaimService claimService, UserService userService) {
        this.adminService = adminService;
        this.itemService = itemService;
        this.claimService = claimService;
        this.userService = userService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> stats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    @Transactional(readOnly = true)
    public ResponseEntity<List<UserDto>> users() {
        return ResponseEntity.ok(adminService.getUsers().stream().map(UserService::mapToDto).toList());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable UUID id, @RequestParam Role role) {
        return ResponseEntity.ok(UserService.mapToDto(
            adminService.updateUserRole(id, role, userService.getCurrentUserEntity())
        ));
    }

    @GetMapping("/items")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ItemResponse>> items() {
        return ResponseEntity.ok(adminService.getItems().stream().map(itemService::toResponse).toList());
    }

    @GetMapping("/claims")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ClaimResponse>> claims() {
        return ResponseEntity.ok(adminService.getClaims().stream().map(claimService::toResponse).toList());
    }

    @GetMapping("/audit-logs")
    @Transactional(readOnly = true)
    public ResponseEntity<List<AuditLogResponse>> auditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs().stream().map(log -> new AuditLogResponse(
            log.getId(),
            log.getActor() == null ? null : log.getActor().getId(),
            log.getItem() == null ? null : log.getItem().getId(),
            log.getAction(),
            log.getDetails(),
            log.getCreatedAt()
        )).toList());
    }

    @PutMapping("/items/{id}/status")
    public ResponseEntity<ItemResponse> updateItemStatus(@PathVariable UUID id, @RequestParam ItemStatus status) {
        return ResponseEntity.ok(itemService.toResponse(
            adminService.updateItemStatus(id, status, userService.getCurrentUserEntity())
        ));
    }
}
