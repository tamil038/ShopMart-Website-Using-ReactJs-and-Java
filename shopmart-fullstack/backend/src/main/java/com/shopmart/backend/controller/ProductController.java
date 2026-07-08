package com.shopmart.backend.controller;

import com.shopmart.backend.dto.ProductDtos;
import com.shopmart.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductDtos.ProductResponse> search(
            @RequestParam(required = false, defaultValue = "All") String category,
            @RequestParam(required = false, defaultValue = "") String term,
            @RequestParam(required = false, defaultValue = "relevance") String sort) {
        return productService.search(category, term, sort);
    }

    @GetMapping("/featured")
    public List<ProductDtos.ProductResponse> featured() {
        return productService.getFeatured();
    }

    @GetMapping("/{id}")
    public ProductDtos.ProductResponse getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @GetMapping("/{id}/reviews")
    public List<ProductDtos.ReviewResponse> reviews(@PathVariable Long id) {
        return productService.getReviews(id);
    }

    @GetMapping("/{id}/related")
    public List<ProductDtos.ProductResponse> related(@PathVariable Long id) {
        return productService.getRelated(id);
    }
}
