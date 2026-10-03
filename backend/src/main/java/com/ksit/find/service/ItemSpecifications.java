package com.ksit.find.service;

import com.ksit.find.entity.Item;
import com.ksit.find.entity.ItemStatus;
import com.ksit.find.entity.ItemType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public final class ItemSpecifications {
    private ItemSpecifications() {
    }

    public static Specification<Item> hasKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        final String q = "%" + keyword.toLowerCase() + "%";
        return (root, query, cb) -> {
            Predicate title = cb.like(cb.lower(root.get("title")), q);
            Predicate desc = cb.like(cb.lower(root.get("description")), q);
            Predicate location = cb.like(cb.lower(root.get("location")), q);
            Predicate category = cb.like(cb.lower(root.get("category")), q);
            return cb.or(title, desc, location, category);
        };
    }

    public static Specification<Item> hasCategory(String category) {
        if (category == null || category.isBlank()) {
            return null;
        }
        return (root, query, cb) -> cb.equal(cb.lower(root.get("category")), category.toLowerCase());
    }

    public static Specification<Item> hasType(ItemType type) {
        if (type == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("itemType"), type);
    }

    public static Specification<Item> hasLocation(String location) {
        if (location == null || location.isBlank()) {
            return null;
        }
        return (root, query, cb) -> cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
    }

    public static Specification<Item> hasStatus(ItemStatus status) {
        if (status == null) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Item> hasDateAfter(LocalDateTime date) {
        if (date == null) {
            return null;
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("itemDate"), date);
    }

    public static Specification<Item> hasDateBefore(LocalDateTime date) {
        if (date == null) {
            return null;
        }
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("itemDate"), date);
    }
}
