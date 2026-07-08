package com.shopmart.backend.controller;

import com.shopmart.backend.dto.ProfileDtos;
import com.shopmart.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ProfileDtos.ProfileResponse getProfile() {
        return userService.toProfileResponse(userService.getCurrentUser());
    }

    @PutMapping
    public ProfileDtos.ProfileResponse updateProfile(@Valid @RequestBody ProfileDtos.ProfileUpdateRequest request) {
        return userService.updateProfile(request);
    }
}
