package com.ksit.find.repository;

import com.ksit.find.entity.Item;
import com.ksit.find.entity.ItemType;
import com.ksit.find.entity.ItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID>, JpaSpecificationExecutor<Item> {
    Page<Item> findByReporterId(UUID reporterId, Pageable pageable);

    @Query("select i from Item i left join fetch i.images left join fetch i.reporter where i.id = :id")
    Optional<Item> findByIdWithDetails(UUID id);

    long countByItemType(ItemType itemType);
    long countByStatus(ItemStatus status);
}
