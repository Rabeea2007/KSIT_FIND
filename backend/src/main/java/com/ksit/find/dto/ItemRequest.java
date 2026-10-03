package com.ksit.find.dto;

import com.ksit.find.entity.ItemStatus;
import com.ksit.find.entity.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ItemRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String category;

    @Size(max = 100)
    private String brand;

    @Size(max = 100)
    private String color;

    @NotBlank
    private String location;

    @Size(max = 255)
    private String custodyLocation;

    @NotNull
    private LocalDateTime itemDate;

    @NotNull
    private ItemType itemType;

    private ItemStatus status = ItemStatus.LOST;

    private String privateDetails;

    private List<String> imageUrls = new ArrayList<>();

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

    public String getPrivateDetails() {
        return privateDetails;
    }

    public void setPrivateDetails(String privateDetails) {
        this.privateDetails = privateDetails;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCustodyLocation() {
        return custodyLocation;
    }

    public void setCustodyLocation(String custodyLocation) {
        this.custodyLocation = custodyLocation;
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

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
