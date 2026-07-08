package com.shopmart.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public final class OrderDtos {

    private OrderDtos() {}

    public record CustomerInfo(
            @NotBlank String name,
            @NotBlank String phone,
            @NotBlank String address,
            @NotBlank String city,
            @NotBlank String state,
            @NotBlank String zip
    ) {}

    public record PlaceOrderRequest(
            @Valid @NotNull CustomerInfo customer,
            @NotBlank String payment,
            String couponCode
    ) {}

    public record OrderItemResponse(Long productId, String name, String image, Double price, Integer qty) {}

    public record OrderResponse(
            Long id,
            List<OrderItemResponse> items,
            CustomerInfo customer,
            String payment,
            Double subtotal,
            Double discount,
            String couponCode,
            Double shipping,
            Double total,
            LocalDateTime placedAt,
            String stage
    ) {}
}
