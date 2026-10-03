package com.ksit.find.controller;

import com.ksit.find.dto.NotificationResponse;
import com.ksit.find.entity.User;
import com.ksit.find.service.NotificationService;
import com.ksit.find.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(notificationService.getNotifications(currentUser));
    }

    @GetMapping("/notifications/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(notificationService.getUnreadCount(currentUser));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<NotificationResponse> markRead(@PathVariable UUID id) {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(notificationService.markRead(id, currentUser));
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllRead() {
        User currentUser = userService.getCurrentUserEntity();
        notificationService.markAllRead(currentUser);
        return ResponseEntity.noContent().build();
    }
}
