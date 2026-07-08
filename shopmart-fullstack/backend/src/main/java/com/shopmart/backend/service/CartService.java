package com.shopmart.backend.service;

import com.shopmart.backend.dto.CartDtos;
import com.shopmart.backend.exception.ApiException;
import com.shopmart.backend.model.CartItem;
import com.shopmart.backend.model.Product;
import com.shopmart.backend.model.User;
import com.shopmart.backend.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final UserService userService;

    public CartService(CartItemRepository cartItemRepository, ProductService productService, UserService userService) {
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
        this.userService = userService;
    }

    public CartDtos.CartResponse getCart() {
        User user = userService.getCurrentUser();
        return toResponse(cartItemRepository.findByUserId(user.getId()));
    }

    public CartDtos.CartResponse add(CartDtos.AddToCartRequest request) {
        User user = userService.getCurrentUser();
        Product product = productService.findEntity(request.productId());
        int qtyToAdd = request.qty() == null ? 1 : request.qty();

        CartItem item = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId())
                .orElseGet(() -> new CartItem(user, product, 0));
        item.setQty(item.getQty() + qtyToAdd);
        cartItemRepository.save(item);

        return toResponse(cartItemRepository.findByUserId(user.getId()));
    }

    public CartDtos.CartResponse updateQty(Long productId, Integer qty) {
        User user = userService.getCurrentUser();
        CartItem item = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> ApiException.notFound("That item isn't in your cart."));

        if (qty <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQty(qty);
            cartItemRepository.save(item);
        }
        return toResponse(cartItemRepository.findByUserId(user.getId()));
    }

    public CartDtos.CartResponse remove(Long productId) {
        User user = userService.getCurrentUser();
        cartItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
        return toResponse(cartItemRepository.findByUserId(user.getId()));
    }

    public CartDtos.CartResponse clear() {
        User user = userService.getCurrentUser();
        cartItemRepository.deleteByUserId(user.getId());
        return toResponse(List.of());
    }

    private CartDtos.CartResponse toResponse(List<CartItem> items) {
        List<CartDtos.CartItemResponse> mapped = items.stream()
                .map(i -> new CartDtos.CartItemResponse(
                        i.getProduct().getId(), i.getProduct().getName(), i.getProduct().getImage(),
                        i.getProduct().getPrice(), i.getQty()))
                .toList();

        double subtotal = items.stream().mapToDouble(i -> i.getProduct().getPrice() * i.getQty()).sum();
        int count = items.stream().mapToInt(CartItem::getQty).sum();

        return new CartDtos.CartResponse(mapped, subtotal, count);
    }
}
