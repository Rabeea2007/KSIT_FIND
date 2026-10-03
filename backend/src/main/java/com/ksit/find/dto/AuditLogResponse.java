package com.ksit.find.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditLogResponse(
    UUID id,
    UUID actorId,
    UUID itemId,
    String action,
    String details,
    LocalDateTime createdAt
) {
}
