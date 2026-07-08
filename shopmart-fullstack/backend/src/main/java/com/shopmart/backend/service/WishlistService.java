package com.shopmart.backend.service;

import com.shopmart.backend.dto.ProductDtos;
import com.shopmart.backend.model.Product;
import com.shopmart.backend.model.User;
import com.shopmart.backend.model.WishlistItem;
import com.shopmart.backend.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductService productService;
    private final UserService userService;

    public WishlistService(WishlistItemRepository wishlistItemRepository, ProductService productService, UserService userService) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productService = productService;
        this.userService = userService;
    }

    public List<ProductDtos.ProductResponse> list() {
        User user = userService.getCurrentUser();
        return wishlistItemRepository.findByUserId(user.getId()).stream()
                .map(item -> productService.getById(item.getProduct().getId()))
                .toList();
    }

    /** Adds the product if it isn't saved yet, removes it if it is. Returns the new saved state. */
    public Map<String, Boolean> toggle(Long productId) {
        User user = userService.getCurrentUser();
        var existing = wishlistItemRepository.findByUserIdAndProductId(user.getId(), productId);

        if (existing.isPresent()) {
            wishlistItemRepository.delete(existing.get());
            return Map.of("saved", false);
        }

        Product product = productService.findEntity(productId);
        wishlistItemRepository.save(new WishlistItem(user, product));
        return Map.of("saved", true);
    }
}
