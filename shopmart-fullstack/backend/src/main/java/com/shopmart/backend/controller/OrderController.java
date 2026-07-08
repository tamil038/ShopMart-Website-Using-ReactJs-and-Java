package com.shopmart.backend.controller;

import com.shopmart.backend.dto.OrderDtos;
import com.shopmart.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderDtos.OrderResponse placeOrder(@Valid @RequestBody OrderDtos.PlaceOrderRequest request) {
        return orderService.placeOrder(request);
    }

    @GetMapping
    public List<OrderDtos.OrderResponse> list() {
        return orderService.listOrders();
    }

    @GetMapping("/{id}")
    public OrderDtos.OrderResponse getById(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    @PatchMapping("/{id}/advance")
    public OrderDtos.OrderResponse advance(@PathVariable Long id) {
        return orderService.advanceStage(id);
    }
}
