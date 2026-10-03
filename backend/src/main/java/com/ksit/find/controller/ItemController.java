package com.ksit.find.controller;

import com.ksit.find.dto.ItemRequest;
import com.ksit.find.dto.ItemResponse;
import com.ksit.find.dto.ItemReportRequest;
import com.ksit.find.entity.User;
import com.ksit.find.service.ItemService;
import com.ksit.find.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ItemController {
    private final ItemService itemService;
    private final UserService userService;

    public ItemController(ItemService itemService, UserService userService) {
        this.itemService = itemService;
        this.userService = userService;
    }

    @PostMapping("/items")
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody ItemRequest request) {
        User reporter = userService.getCurrentUserEntity();
        return ResponseEntity.ok(itemService.createItem(reporter, request));
    }

    @GetMapping("/items")
    public ResponseEntity<Page<ItemResponse>> getItems(@RequestParam(required = false) String keyword,
                                                      @RequestParam(required = false) String category,
                                                      @RequestParam(required = false) String type,
                                                      @RequestParam(required = false) String location,
                                                      @RequestParam(required = false) String status,
                                                      @RequestParam(required = false) LocalDateTime dateFrom,
                                                      @RequestParam(required = false) LocalDateTime dateTo,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "20") int size,
                                                      @RequestParam(defaultValue = "createdAt") String sortBy,
                                                      @RequestParam(defaultValue = "DESC") String direction) {
        return ResponseEntity.ok(itemService.searchItems(keyword, category, type, location, status, dateFrom, dateTo, page, size, sortBy, direction));
    }

    @GetMapping("/items/mine")
    public ResponseEntity<Page<ItemResponse>> getMyItems(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("Page must be non-negative and size must be between 1 and 100");
        }
        return ResponseEntity.ok(itemService.getMyItems(userService.getCurrentUserEntity(), page, size));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<ItemResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ItemResponse> updateItem(@PathVariable UUID id, @Valid @RequestBody ItemRequest request) {
        User currentUser = userService.getCurrentUserEntity();
        return ResponseEntity.ok(itemService.updateItem(id, currentUser, request));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable UUID id) {
        User currentUser = userService.getCurrentUserEntity();
        itemService.deleteItem(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/items/{id}/reports")
    public ResponseEntity<Void> reportItem(@PathVariable UUID id, @Valid @RequestBody ItemReportRequest request) {
        itemService.reportItem(id, userService.getCurrentUserEntity(), request.getReason());
        return ResponseEntity.noContent().build();
    }
}
