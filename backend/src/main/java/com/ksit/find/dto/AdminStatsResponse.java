package com.ksit.find.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalItems;
    private long activeClaims;
    private long resolvedItems;
    private long lostItems;
    private long foundItems;

    public AdminStatsResponse(long totalUsers, long totalItems, long activeClaims, long resolvedItems, long lostItems, long foundItems) {
        this.totalUsers = totalUsers;
        this.totalItems = totalItems;
        this.activeClaims = activeClaims;
        this.resolvedItems = resolvedItems;
        this.lostItems = lostItems;
        this.foundItems = foundItems;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public long getActiveClaims() {
        return activeClaims;
    }

    public void setActiveClaims(long activeClaims) {
        this.activeClaims = activeClaims;
    }

    public long getResolvedItems() {
        return resolvedItems;
    }

    public void setResolvedItems(long resolvedItems) {
        this.resolvedItems = resolvedItems;
    }

    public long getLostItems() {
        return lostItems;
    }

    public void setLostItems(long lostItems) {
        this.lostItems = lostItems;
    }

    public long getFoundItems() {
        return foundItems;
    }

    public void setFoundItems(long foundItems) {
        this.foundItems = foundItems;
    }
}
