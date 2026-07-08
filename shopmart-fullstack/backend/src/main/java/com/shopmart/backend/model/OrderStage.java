package com.shopmart.backend.model;

public enum OrderStage {
    PROCESSING("Processing"),
    PACKED("Packed"),
    SHIPPED("Shipped"),
    OUT_FOR_DELIVERY("Out for Delivery"),
    DELIVERED("Delivered");

    private final String label;

    OrderStage(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public OrderStage next() {
        OrderStage[] all = values();
        int idx = this.ordinal();
        return idx < all.length - 1 ? all[idx + 1] : this;
    }
}
