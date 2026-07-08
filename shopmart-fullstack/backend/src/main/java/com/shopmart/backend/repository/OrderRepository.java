package com.shopmart.backend.repository;

import com.shopmart.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByPlacedAtDesc(Long userId);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
}
