package com.shopmart.backend.service;

import com.shopmart.backend.dto.ProductDtos;
import com.shopmart.backend.exception.ApiException;
import com.shopmart.backend.model.Product;
import com.shopmart.backend.repository.ProductRepository;
import com.shopmart.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository, ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ProductDtos.ProductResponse> search(String category, String term, String sort) {
        String safeCategory = (category == null || category.isBlank()) ? "All" : category;
        String safeTerm = (term == null) ? "" : term.trim().toLowerCase();

        List<Product> results = productRepository.search(safeCategory, safeTerm);

        Comparator<Product> comparator = switch (sort == null ? "" : sort) {
            case "price-asc" -> Comparator.comparing(Product::getPrice);
            case "price-desc" -> Comparator.comparing(Product::getPrice).reversed();
            case "rating" -> Comparator.comparing(Product::getRating).reversed();
            default -> null;
        };
        if (comparator != null) {
            results = results.stream().sorted(comparator).toList();
        }

        return results.stream().map(this::toResponse).toList();
    }

    public ProductDtos.ProductResponse getById(Long id) {
        Product product = findEntity(id);
        return toResponse(product);
    }

    public Product findEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product " + id + " was not found."));
    }

    public List<ProductDtos.ProductResponse> getFeatured() {
        return productRepository.findAll().stream()
                .filter(p -> p.getTags().contains("bestseller"))
                .limit(4)
                .map(this::toResponse)
                .toList();
    }

    public List<ProductDtos.ProductResponse> getRelated(Long id) {
        Product product = findEntity(id);
        return productRepository.findByCategoryAndIdNot(product.getCategory(), id).stream()
                .limit(4)
                .map(this::toResponse)
                .toList();
    }

    public List<ProductDtos.ReviewResponse> getReviews(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(r -> new ProductDtos.ReviewResponse(r.getId(), productId, r.getAuthor(), r.getRating(), r.getComment(), r.getDate()))
                .toList();
    }

    private ProductDtos.ProductResponse toResponse(Product p) {
        // .getHighlights()/.getTags() return Hibernate's lazy-backed collections. Copying them
        // into a plain ArrayList *here* forces Hibernate to actually load their contents now,
        // while this method's @Transactional session is still open. Without this copy, Jackson
        // would try to serialize the still-uninitialized proxy after the transaction has already
        // closed (once we're back in the controller), which throws LazyInitializationException.
        List<String> highlights = new ArrayList<>(p.getHighlights());
        List<String> tags = new ArrayList<>(p.getTags());

        return new ProductDtos.ProductResponse(
                p.getId(), p.getName(), p.getCategory(), p.getPrice(), p.getMrp(), p.getImage(),
                p.getRating(), p.getReviewCount(), p.getDescription(), p.getStock(),
                highlights, tags
        );
    }
}
