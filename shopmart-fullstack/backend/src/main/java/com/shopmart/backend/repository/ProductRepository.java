package com.shopmart.backend.repository;

import com.shopmart.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    @Query("select p from Product p where " +
           "(:category = 'All' or p.category = :category) and " +
           "(:term = '' or lower(p.name) like concat('%', :term, '%') or lower(p.category) like concat('%', :term, '%'))")
    List<Product> search(@Param("category") String category, @Param("term") String term);

    List<Product> findByCategoryAndIdNot(String category, Long id);
}
