package com.ksit.find.service;

import com.ksit.find.dto.AuthResponse;
import com.ksit.find.dto.LoginRequest;
import com.ksit.find.dto.RegisterRequest;
import com.ksit.find.dto.UserDto;
import com.ksit.find.entity.Role;
import com.ksit.find.entity.User;
import com.ksit.find.exception.ConflictException;
import com.ksit.find.exception.ResourceNotFoundException;
import com.ksit.find.repository.UserRepository;
import com.ksit.find.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase(java.util.Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("User with this email already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, toDto(user));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(java.util.Locale.ROOT);
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("Authentication failed");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, toDto(user));
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toDto(user);
    }

    private UserDto toDto(User user) {
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
}
