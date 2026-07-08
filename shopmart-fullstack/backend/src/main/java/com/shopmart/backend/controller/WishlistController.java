package com.shopmart.backend.controller;

import com.shopmart.backend.dto.ProductDtos;
import com.shopmart.backend.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<ProductDtos.ProductResponse> list() {
        return wishlistService.list();
    }

    @PostMapping("/{productId}")
    public Map<String, Boolean> toggle(@PathVariable Long productId) {
        return wishlistService.toggle(productId);
    }
}
