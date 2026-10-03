package com.ksit.find.service;

import com.ksit.find.dto.UserDto;
import com.ksit.find.entity.Role;
import com.ksit.find.entity.User;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getCurrentUserEntity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("No authenticated user found");
        }
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + auth.getName()));
    }

    public UserDto getCurrentUser() {
        return mapToDto(getCurrentUserEntity());
    }

    public UserDto updateCurrentUser(String name, String phone, String profileImage) {
        User user = getCurrentUserEntity();
        if (name != null && !name.isBlank()) user.setName(name);
        if (phone != null) user.setPhone(phone);
        if (profileImage != null) user.setProfileImage(profileImage);
        userRepository.save(user);
        return mapToDto(user);
    }

    public UserDto getUserDtoById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDto(user);
    }

    public static UserDto mapToDto(User user) {
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole(),
            user.getProfileImage(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    public User createUser(String name, String email, String phone, String rawPassword) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.STUDENT);
        return userRepository.save(user);
    }
}
