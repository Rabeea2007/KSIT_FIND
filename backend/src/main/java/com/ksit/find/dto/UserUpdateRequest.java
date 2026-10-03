package com.ksit.find.dto;

import jakarta.validation.constraints.Size;

public class UserUpdateRequest {
    @Size(max = 255)
    private String name;

    @Size(max = 50)
    private String phone;

    @Size(max = 500)
    private String profileImage;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}
