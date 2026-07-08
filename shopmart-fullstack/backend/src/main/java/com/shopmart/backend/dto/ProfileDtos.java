package com.shopmart.backend.dto;

import jakarta.validation.constraints.NotBlank;

public final class ProfileDtos {

    private ProfileDtos() {}

    public record ProfileResponse(String name, String email, String address) {}

    public record ProfileUpdateRequest(@NotBlank String name, String address) {}
}
