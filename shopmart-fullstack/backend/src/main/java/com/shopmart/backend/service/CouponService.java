package com.shopmart.backend.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CouponService {

    private record Coupon(String code, String type, double value, double minSubtotal, Double maxDiscount) {}

    private final List<Coupon> coupons = List.of(
            new Coupon("SHOP10", "percent", 10, 999, 400.0),
            new Coupon("WELCOME15", "percent", 15, 1500, 600.0),
            new Coupon("FIRST50", "flat", 50, 300, null)
    );

    /** Returns the discount amount for a coupon code against a subtotal, or throws if invalid. */
    public double apply(String code, double subtotal) {
        if (code == null || code.isBlank()) return 0;

        Coupon coupon = findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("That coupon code is not valid."));

        if (subtotal < coupon.minSubtotal()) {
            throw new IllegalArgumentException(
                    "Add " + (coupon.minSubtotal() - subtotal) + " more to use " + coupon.code() + ".");
        }

        double raw = coupon.type().equals("flat") ? coupon.value() : Math.round(subtotal * coupon.value() / 100.0);
        return coupon.maxDiscount() != null ? Math.min(raw, coupon.maxDiscount()) : raw;
    }

    private Optional<Coupon> findByCode(String code) {
        return coupons.stream().filter(c -> c.code().equalsIgnoreCase(code)).findFirst();
    }
}
