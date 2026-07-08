package com.shopmart.backend.controller;

import com.shopmart.backend.dto.CartDtos;
import com.shopmart.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartDtos.CartResponse getCart() {
        return cartService.getCart();
    }

    @PostMapping
    public CartDtos.CartResponse add(@Valid @RequestBody CartDtos.AddToCartRequest request) {
        return cartService.add(request);
    }

    @PutMapping("/{productId}")
    public CartDtos.CartResponse updateQty(@PathVariable Long productId, @Valid @RequestBody CartDtos.UpdateQtyRequest request) {
        return cartService.updateQty(productId, request.qty());
    }

    @DeleteMapping("/{productId}")
    public CartDtos.CartResponse remove(@PathVariable Long productId) {
        return cartService.remove(productId);
    }

    @DeleteMapping
    public CartDtos.CartResponse clear() {
        return cartService.clear();
    }
}
