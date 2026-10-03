package com.ksit.find;

import com.ksit.find.entity.*;
import com.ksit.find.repository.ItemRepository;
import com.ksit.find.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Profile("demo")
public class DemoDataInitializer implements ApplicationRunner {
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataInitializer(UserRepository userRepository, ItemRepository itemRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = new User("KSIT Admin", "admin@ksit.edu.in", "0000000000", passwordEncoder.encode("Admin@123"), Role.ADMIN, null);
        User rahul = new User("Rahul Kumar", "rahul.kumar@ksit.edu.in", "9876543210", passwordEncoder.encode("Password123"), Role.STUDENT, null);
        User sneha = new User("Sneha Nair", "sneha.nair@ksit.edu.in", "9123456780", passwordEncoder.encode("Password123"), Role.STAFF, null);

        userRepository.save(admin);
        userRepository.save(rahul);
        userRepository.save(sneha);

        Item lostItem = new Item();
        lostItem.setTitle("AirPods Pro");
        lostItem.setDescription("White AirPods Pro lost near the canteen west entrance");
        lostItem.setCategory("Electronics");
        lostItem.setLocation("Canteen");
        lostItem.setItemDate(LocalDateTime.now().minusDays(1));
        lostItem.setItemType(ItemType.LOST);
        lostItem.setStatus(ItemStatus.LOST);
        lostItem.setPrivateDetails("Small scratch beneath the charging case");
        lostItem.setReporter(rahul);
        lostItem.getImages().add(new ItemImage(lostItem, "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46", null));
        itemRepository.save(lostItem);

        Item foundItem = new Item();
        foundItem.setTitle("Black Backpack");
        foundItem.setDescription("Black college backpack found outside the library");
        foundItem.setCategory("Bags");
        foundItem.setLocation("Library");
        foundItem.setItemDate(LocalDateTime.now().minusHours(5));
        foundItem.setItemType(ItemType.FOUND);
        foundItem.setStatus(ItemStatus.FOUND);
        foundItem.setPrivateDetails("Contains a blue key tag");
        foundItem.setReporter(sneha);
        foundItem.getImages().add(new ItemImage(foundItem, "https://images.unsplash.com/photo-1542291026-7eec264c27ff", null));
        itemRepository.save(foundItem);
    }
}
