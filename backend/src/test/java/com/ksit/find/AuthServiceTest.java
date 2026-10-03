package com.ksit.find;

import com.ksit.find.dto.AuthResponse;
import com.ksit.find.dto.LoginRequest;
import com.ksit.find.dto.RegisterRequest;
import com.ksit.find.entity.Role;
import com.ksit.find.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {
    @Autowired
    private AuthService authService;

    @Test
    void registerAndLoginShouldCreateJwtForStudent() {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Rahul Kumar");
        registerRequest.setEmail("rahul.kumar@ksit.edu.in");
        registerRequest.setPassword("Password123");
        registerRequest.setPhone("9876543210");

        AuthResponse registerResponse = authService.register(registerRequest);

        assertThat(registerResponse.getToken()).isNotBlank();
        assertThat(registerResponse.getUser().getEmail()).isEqualTo("rahul.kumar@ksit.edu.in");
        assertThat(registerResponse.getUser().getRole()).isEqualTo(Role.STUDENT);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("rahul.kumar@ksit.edu.in");
        loginRequest.setPassword("Password123");

        AuthResponse loginResponse = authService.login(loginRequest);
        assertThat(loginResponse.getToken()).isNotBlank();
        assertThat(loginResponse.getUser().getRole()).isEqualTo(Role.STUDENT);
    }
}
