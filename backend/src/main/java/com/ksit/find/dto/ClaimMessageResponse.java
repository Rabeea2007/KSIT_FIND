package com.ksit.find.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ClaimMessageResponse(
    UUID id,
    UUID senderId,
    String content,
    LocalDateTime createdAt,
    boolean mine
) {
}
