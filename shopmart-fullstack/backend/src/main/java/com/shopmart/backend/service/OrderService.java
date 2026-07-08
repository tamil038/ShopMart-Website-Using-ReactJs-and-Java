package com.shopmart.backend.service;

import com.shopmart.backend.dto.OrderDtos;
import com.shopmart.backend.exception.ApiException;
import com.shopmart.backend.model.CartItem;
import com.shopmart.backend.model.Order;
import com.shopmart.backend.model.OrderItem;
import com.shopmart.backend.model.OrderStage;
import com.shopmart.backend.model.User;
import com.shopmart.backend.repository.CartItemRepository;
import com.shopmart.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private static final double FREE_SHIPPING_THRESHOLD = 1999.0;
    private static final double SHIPPING_FEE = 79.0;

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final CouponService couponService;
    private final UserService userService;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository,
                         CouponService couponService, UserService userService) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.couponService = couponService;
        this.userService = userService;
    }

    @Transactional
    public OrderDtos.OrderResponse placeOrder(OrderDtos.PlaceOrderRequest request) {
        User user = userService.getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw ApiException.badRequest("Your cart is empty — add something before checking out.");
        }

        double subtotal = cartItems.stream().mapToDouble(i -> i.getProduct().getPrice() * i.getQty()).sum();

        double discount;
        try {
            discount = couponService.apply(request.couponCode(), subtotal);
        } catch (IllegalArgumentException ex) {
            throw ApiException.badRequest(ex.getMessage());
        }

        double shipping = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal == 0) ? 0 : SHIPPING_FEE;
        double total = Math.max(0, subtotal - discount + shipping);

        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(request.customer().name());
        order.setPhone(request.customer().phone());
        order.setAddress(request.customer().address());
        order.setCity(request.customer().city());
        order.setState(request.customer().state());
        order.setZip(request.customer().zip());
        order.setPayment(request.payment());
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setCouponCode(request.couponCode());
        order.setShipping(shipping);
        order.setTotal(total);
        order.setPlacedAt(LocalDateTime.now());
        order.setStage(OrderStage.PROCESSING);

        List<OrderItem> orderItems = cartItems.stream().map(ci -> {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductId(ci.getProduct().getId());
            oi.setName(ci.getProduct().getName());
            oi.setImage(ci.getProduct().getImage());
            oi.setPrice(ci.getProduct().getPrice());
            oi.setQty(ci.getQty());
            return oi;
        }).toList();
        order.setItems(orderItems);

        orderRepository.save(order);
        cartItemRepository.deleteByUserId(user.getId());

        return toResponse(order);
    }

    public List<OrderDtos.OrderResponse> listOrders() {
        User user = userService.getCurrentUser();
        return orderRepository.findByUserIdOrderByPlacedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderDtos.OrderResponse getOrder(Long id) {
        User user = userService.getCurrentUser();
        Order order = orderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> ApiException.notFound("Order " + id + " was not found."));
        return toResponse(order);
    }

    @Transactional
    public OrderDtos.OrderResponse advanceStage(Long id) {
        User user = userService.getCurrentUser();
        Order order = orderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> ApiException.notFound("Order " + id + " was not found."));
        order.setStage(order.getStage().next());
        orderRepository.save(order);
        return toResponse(order);
    }

    private OrderDtos.OrderResponse toResponse(Order order) {
        List<OrderDtos.OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderDtos.OrderItemResponse(i.getProductId(), i.getName(), i.getImage(), i.getPrice(), i.getQty()))
                .toList();

        OrderDtos.CustomerInfo customer = new OrderDtos.CustomerInfo(
                order.getCustomerName(), order.getPhone(), order.getAddress(),
                order.getCity(), order.getState(), order.getZip());

        return new OrderDtos.OrderResponse(
                order.getId(), items, customer, order.getPayment(),
                order.getSubtotal(), order.getDiscount(), order.getCouponCode(),
                order.getShipping(), order.getTotal(), order.getPlacedAt(),
                order.getStage().getLabel()
        );
    }
}
