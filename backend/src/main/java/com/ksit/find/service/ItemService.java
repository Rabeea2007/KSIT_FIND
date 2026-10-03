package com.ksit.find.service;

import com.ksit.find.dto.ItemRequest;
import com.ksit.find.dto.ItemResponse;
import com.ksit.find.dto.UserDto;
import com.ksit.find.entity.Item;
import com.ksit.find.entity.ItemImage;
import com.ksit.find.entity.ItemStatus;
import com.ksit.find.entity.ItemType;
import com.ksit.find.entity.NotificationType;
import com.ksit.find.entity.AuditLog;
import com.ksit.find.entity.User;
import com.ksit.find.exception.ForbiddenException;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.repository.ItemRepository;
import com.ksit.find.repository.AuditLogRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    public ItemService(ItemRepository itemRepository,
                       AuditLogRepository auditLogRepository,
                       NotificationService notificationService) {
        this.itemRepository = itemRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public Page<ItemResponse> searchItems(String keyword,
                                        String category,
                                        String type,
                                        String location,
                                        String status,
                                        LocalDateTime dateFrom,
                                        LocalDateTime dateTo,
                                        int page,
                                        int size,
                                        String sortBy,
                                        String direction) {
        Specification<Item> spec = Specification.where(null);

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(ItemSpecifications.hasKeyword(keyword));
        }
        if (category != null && !category.isBlank()) {
            spec = spec.and(ItemSpecifications.hasCategory(category));
        }
        if (type != null && !type.isBlank()) {
            spec = spec.and(ItemSpecifications.hasType(ItemType.valueOf(type.toUpperCase())));
        }
        if (location != null && !location.isBlank()) {
            spec = spec.and(ItemSpecifications.hasLocation(location));
        }
        if (status != null && !status.isBlank()) {
            spec = spec.and(ItemSpecifications.hasStatus(ItemStatus.valueOf(status.toUpperCase())));
        }
        if (dateFrom != null) {
            spec = spec.and(ItemSpecifications.hasDateAfter(dateFrom));
        }
        if (dateTo != null) {
            spec = spec.and(ItemSpecifications.hasDateBefore(dateTo));
        }

        String sortField = (sortBy == null || sortBy.isBlank()) ? "createdAt" : sortBy;
        Sort sort = Sort.by(Sort.Direction.fromString(direction == null ? "DESC" : direction), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        return itemRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ItemResponse> getMyItems(User reporter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return itemRepository.findByReporterId(reporter.getId(), pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ItemResponse getItem(UUID id) {
        Item item = itemRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        return toResponse(item);
    }

    @Transactional
    public ItemResponse createItem(User reporter, ItemRequest request) {
        Item item = new Item();
        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription().trim());
        item.setCategory(request.getCategory().trim());
        item.setBrand(normalizeOptional(request.getBrand()));
        item.setColor(normalizeOptional(request.getColor()));
        item.setLocation(request.getLocation().trim());
        item.setCustodyLocation(request.getCustodyLocation());
        item.setItemDate(request.getItemDate());
        item.setItemType(request.getItemType());
        item.setStatus(request.getStatus() != null ? request.getStatus() : (request.getItemType() == ItemType.LOST ? ItemStatus.LOST : ItemStatus.FOUND));
        item.setPrivateDetails(request.getPrivateDetails());
        item.setReporter(reporter);

        item = itemRepository.save(item);

        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    ItemImage image = new ItemImage(item, url, null);
                    item.getImages().add(image);
                }
            }
            itemRepository.save(item);
        }

        return toResponse(item);
    }

    @Transactional
    public ItemResponse updateItem(UUID id, User currentUser, ItemRequest request) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!item.getReporter().getId().equals(currentUser.getId()) && currentUser.getRole() != com.ksit.find.entity.Role.ADMIN) {
            throw new ForbiddenException("You can only edit your own reports");
        }

        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription().trim());
        item.setCategory(request.getCategory().trim());
        item.setBrand(normalizeOptional(request.getBrand()));
        item.setColor(normalizeOptional(request.getColor()));
        item.setLocation(request.getLocation().trim());
        item.setCustodyLocation(request.getCustodyLocation());
        item.setItemDate(request.getItemDate());
        item.setItemType(request.getItemType());
        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }
        item.setPrivateDetails(request.getPrivateDetails());

        if (request.getImageUrls() != null) {
            item.getImages().clear();
            for (String url : request.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    item.getImages().add(new ItemImage(item, url, null));
                }
            }
        }

        item = itemRepository.save(item);
        return toResponse(item);
    }

    @Transactional
    public void deleteItem(UUID id, User currentUser) {
        Item item = itemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!item.getReporter().getId().equals(currentUser.getId()) && currentUser.getRole() != com.ksit.find.entity.Role.ADMIN) {
            throw new ForbiddenException("You can only delete your own reports");
        }
        itemRepository.delete(item);
    }

    @Transactional
    public void reportItem(UUID id, User reporter, String reason) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (item.getReporter().getId().equals(reporter.getId())) {
            throw new ForbiddenException("You cannot report your own listing");
        }
        String normalizedReason = reason.trim();
        auditLogRepository.save(new AuditLog(reporter, item, "ITEM_REPORTED", normalizedReason));
        notificationService.notifyAdmins(
            item,
            NotificationType.ITEM_REPORTED,
            "A listing was reported for '" + item.getTitle() + "': " + normalizedReason
        );
    }

    public ItemResponse toResponse(Item item) {
        ItemResponse response = new ItemResponse();
        response.setId(item.getId());
        response.setTitle(item.getTitle());
        response.setDescription(item.getDescription());
        response.setCategory(item.getCategory());
        response.setBrand(item.getBrand());
        response.setColor(item.getColor());
        response.setLocation(item.getLocation());
        response.setCustodyLocation(item.getCustodyLocation());
        response.setItemDate(item.getItemDate());
        response.setItemType(item.getItemType());
        response.setStatus(item.getStatus());
        response.setReporter(UserService.mapToDto(item.getReporter()));
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());

        List<String> urls = new ArrayList<>();
        for (ItemImage image : item.getImages()) {
            urls.add(image.getUrl());
        }
        response.setImageUrls(urls);
        return response;
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
