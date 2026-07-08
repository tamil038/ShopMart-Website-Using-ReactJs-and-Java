package com.shopmart.backend.dto;

import java.time.LocalDate;
import java.util.List;

public final class ProductDtos {

    private ProductDtos() {}

    public record ProductResponse(
            Long id,
            String name,
            String category,
            Double price,
            Double mrp,
            String image,
            Double rating,
            Integer reviewCount,
            String description,
            Integer stock,
            List<String> highlights,
            List<String> tags
    ) {}

    public record ReviewResponse(
            Long id,
            Long productId,
            String author,
            Integer rating,
            String comment,
            LocalDate date
    ) {}
}
