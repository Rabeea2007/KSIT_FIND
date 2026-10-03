package com.ksit.find.service;

import com.ksit.find.dto.AdminStatsResponse;
import com.ksit.find.entity.*;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.exception.ConflictException;
import com.ksit.find.repository.AuditLogRepository;
import com.ksit.find.repository.ClaimRepository;
import com.ksit.find.repository.ItemRepository;
import com.ksit.find.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminService(UserRepository userRepository,
                       ItemRepository itemRepository,
                       ClaimRepository claimRepository,
                       AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.claimRepository = claimRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public AdminStatsResponse getStats() {
        long users = userRepository.count();
        long items = itemRepository.count();
        long claims = claimRepository.countByStatus(ClaimStatus.PENDING);
        long resolved = itemRepository.countByStatus(ItemStatus.RESOLVED);

        return new AdminStatsResponse(
            users,
            items,
            claims,
            resolved,
            itemRepository.countByItemType(ItemType.LOST),
            itemRepository.countByItemType(ItemType.FOUND)
        );
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public List<Item> getItems() {
        return itemRepository.findAll();
    }

    public List<Claim> getClaims() {
        return claimRepository.findAll();
    }

    @Transactional
    public Item updateItemStatus(UUID itemId, ItemStatus status, User actor) {
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        ItemStatus previousStatus = item.getStatus();
        item.setStatus(status);
        auditLogRepository.save(new AuditLog(actor, item, "ITEM_STATUS_CHANGED", previousStatus + " -> " + status));
        return itemRepository.save(item);
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Transactional
    public User updateUserRole(UUID userId, Role role, User actor) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.ADMIN && role != Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new ConflictException("The last administrator cannot be demoted");
        }
        user.setRole(role);
        auditLogRepository.save(new AuditLog(actor, null, "USER_ROLE_CHANGED", user.getId() + " -> " + role.name()));
        return userRepository.save(user);
    }
}
