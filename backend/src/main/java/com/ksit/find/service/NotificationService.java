package com.ksit.find.service;

import com.ksit.find.dto.NotificationResponse;
import com.ksit.find.entity.Item;
import com.ksit.find.entity.Notification;
import com.ksit.find.entity.NotificationType;
import com.ksit.find.entity.User;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.exception.ForbiddenException;
import com.ksit.find.repository.NotificationRepository;
import com.ksit.find.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void createNotification(User user, Item item, NotificationType type, String message) {
        if (user == null) {
            return;
        }
        Notification notification = new Notification(user, item, type, message);
        notificationRepository.save(notification);
    }

    public void notifyAdmins(Item item, NotificationType type, String message) {
        userRepository.findByRole(com.ksit.find.entity.Role.ADMIN)
            .forEach(admin -> createNotification(admin, item, type, message));
    }

    public List<NotificationResponse> getNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    public NotificationResponse markRead(UUID id, User user) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You do not own this notification");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
        return toResponse(notification);
    }

    public void markAllRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setItemId(notification.getItem() != null ? notification.getItem().getId() : null);
        response.setType(notification.getType());
        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
