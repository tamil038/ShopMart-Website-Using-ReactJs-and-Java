package com.shopmart.backend.service;

import com.shopmart.backend.dto.ProfileDtos;
import com.shopmart.backend.exception.ApiException;
import com.shopmart.backend.model.User;
import com.shopmart.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Resolves the User entity for whoever the JWT filter authenticated on this request. */
    public User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw ApiException.unauthorized("You must be logged in to do that.");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.unauthorized("Account no longer exists."));
    }

    public ProfileDtos.ProfileResponse toProfileResponse(User user) {
        return new ProfileDtos.ProfileResponse(user.getName(), user.getEmail(), user.getAddress());
    }

    public ProfileDtos.ProfileResponse updateProfile(ProfileDtos.ProfileUpdateRequest request) {
        User user = getCurrentUser();
        user.setName(request.name());
        user.setAddress(request.address());
        userRepository.save(user);
        return toProfileResponse(user);
    }
}
