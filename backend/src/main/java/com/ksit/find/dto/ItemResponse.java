package com.ksit.find.dto;

import com.ksit.find.entity.ItemStatus;
import com.ksit.find.entity.ItemType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ItemResponse {
    private UUID id;
    private String title;
    private String description;
    private String category;
    private String brand;
    private String color;
    private String location;
    private String custodyLocation;
    private LocalDateTime itemDate;
    private ItemType itemType;
    private ItemStatus status;
    private UserDto reporter;
    private List<String> imageUrls = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getLocation() {
        return location;
    }

    public String getCustodyLocation() {
        return custodyLocation;
    }

    public void setCustodyLocation(String custodyLocation) {
        this.custodyLocation = custodyLocation;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getItemDate() {
        return itemDate;
    }

    public void setItemDate(LocalDateTime itemDate) {
        this.itemDate = itemDate;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }

    public UserDto getReporter() {
        return reporter;
    }

    public void setReporter(UserDto reporter) {
        this.reporter = reporter;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
