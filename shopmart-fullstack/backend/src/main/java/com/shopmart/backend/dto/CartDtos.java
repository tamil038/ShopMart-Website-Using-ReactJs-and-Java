package com.shopmart.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public final class CartDtos {

    private CartDtos() {}

    public record CartItemResponse(Long productId, String name, String image, Double price, Integer qty) {}

    public record AddToCartRequest(
            @NotNull Long productId,
            @Min(1) Integer qty
    ) {}

    public record UpdateQtyRequest(@NotNull @Min(1) Integer qty) {}

    public record CartResponse(List<CartItemResponse> items, Double subtotal, Integer count) {}
}
