package com.shopmart.backend.seed;

import com.shopmart.backend.model.Product;
import com.shopmart.backend.model.Review;
import com.shopmart.backend.repository.ProductRepository;
import com.shopmart.backend.repository.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public DataSeeder(ProductRepository productRepository, ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return; // already seeded
        }

        Product p1 = product("Pulse Smart Watch", "Electronics", 4999, 6499, "assets/img/smartwatch.jpg", 4.4, 128,
                "Track workouts, sleep and heart rate with a bright always-on display and a battery that lasts a week.",
                List.of("7-day battery life", "Heart-rate & SpO2 sensor", "5 ATM water resistance", "Works with iOS & Android"),
                34, List.of("bestseller"));

        Product p2 = product("Aero Wireless Headphones", "Electronics", 2499, 3299, "assets/img/headphone.jpg", 4.2, 94,
                "Over-ear comfort with active noise cancellation, tuned for warm, punchy bass on any commute.",
                List.of("Active noise cancellation", "30-hour playback", "Plush memory-foam ear cups", "Quick-charge: 10 min = 3 hrs"),
                51, List.of("bestseller"));

        Product p3 = product("Trailblaze Running Shoes", "Sports & Fitness", 2999, 3999, "assets/img/runningshoe.jpg", 4.5, 210,
                "A responsive foam midsole and breathable knit upper built for daily miles, rain or shine.",
                List.of("Breathable knit mesh", "Responsive foam cushioning", "Reflective details for night runs", "Available true to size"),
                60, List.of("bestseller", "new"));

        Product p4 = product("Aroma Brew Coffee Maker", "Home & Kitchen", 2599, 3199, "assets/img/coffeemaker.jpg", 4.1, 67,
                "Café-style drip coffee at home, with a keep-warm plate and a reusable gold-tone filter.",
                List.of("12-cup carafe", "Programmable auto-start", "Reusable filter — no paper needed", "Auto shut-off for safety"),
                22, List.of());

        Product p5 = product("Horizon Polarized Sunglasses", "Fashion", 1799, 2399, "assets/img/sunglass.jpg", 4.3, 45,
                "UV400 polarized lenses cut glare without dulling colour, set in a lightweight matte frame.",
                List.of("UV400 polarized lenses", "Lightweight matte frame", "Anti-scratch coating", "Unisex fit"),
                80, List.of("new"));

        Product p6 = product("Voyager Laptop Backpack", "Fashion", 1899, 2499, "assets/img/lapbackpack.jpg", 4.6, 156,
                "A padded 15.6\" laptop sleeve, a USB charging port and water-resistant fabric for daily carry.",
                List.of("Fits up to 15.6\" laptops", "Built-in USB charging port", "Water-resistant fabric", "Anti-theft back pocket"),
                40, List.of("bestseller"));

        Product p7 = product("Pulse True Wireless Earbuds", "Electronics", 1299, 1799, "assets/img/earbuds.jpg", 4.0, 88,
                "Pocket-sized earbuds with a snug fit, punchy bass and a case that tops up on the go.",
                List.of("24-hour case battery", "Touch controls", "IPX5 sweat resistant", "Auto-pair with last device"),
                70, List.of());

        Product p8 = product("Nova X Smartphone", "Electronics", 27000, 31000, "assets/img/mobile.jpg", 4.3, 302,
                "A smooth 120 Hz display, all-day battery and a capable triple-camera system.",
                List.of("6.5\" 120 Hz display", "5000 mAh battery", "Triple rear camera", "128 GB storage"),
                15, List.of("bestseller"));

        Product p9 = product("Silky Shine Shampoo", "Beauty", 899, 1199, "assets/img/shampoo.jpg", 4.2, 74,
                "A sulfate-free formula that smooths frizz and adds shine, gentle enough for daily use.",
                List.of("Sulfate-free formula", "Adds visible shine", "Safe for colour-treated hair", "350 ml bottle"),
                120, List.of());

        Product p10 = product("Skyline Yoga Mat", "Sports & Fitness", 1299, 1699, "https://placehold.co/600x600/d62839/fff?text=Yoga+Mat", 4.4, 51,
                "Extra-thick non-slip cushioning for yoga, pilates and floor workouts, with a carry strap.",
                List.of("6 mm non-slip cushioning", "Includes carry strap", "Sweat and moisture resistant", "Lightweight at 900 g"),
                45, List.of("new"));

        Product p11 = product("Ember Scented Candle Set", "Home & Kitchen", 999, 1399, "https://placehold.co/600x600/a11627/fff?text=Candle+Set", 4.5, 39,
                "Three hand-poured soy candles in warm, cosy scents — a small ritual for the end of the day.",
                List.of("Set of 3, 40-hr burn each", "100% soy wax", "Cotton wicks, no lead", "Reusable glass jars"),
                55, List.of("new"));

        Product p12 = product("Velvet Matte Lipstick Trio", "Beauty", 1299, 1699, "https://placehold.co/600x600/ff7a59/fff?text=Lipstick+Trio", 4.3, 62,
                "Three long-wear matte shades that glide on light and stay put through the day.",
                List.of("Long-wear matte finish", "Set of 3 shades", "Enriched with vitamin E", "Cruelty-free"),
                65, List.of("bestseller"));

        List<Product> all = List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12);
        productRepository.saveAll(all);

        reviewRepository.saveAll(List.of(
                review(p1, "Ananya R.", 5, "Battery genuinely lasts a week, and the display is easy to read outdoors.", "2026-05-12"),
                review(p1, "Karthik S.", 4, "Great value. Wish the strap came in more colours.", "2026-04-02"),
                review(p2, "Meera V.", 4, "Noise cancellation works well on flights. Comfortable for long wear.", "2026-03-21"),
                review(p3, "Rahul D.", 5, "My feet stay comfortable even after a 10K. Great cushioning.", "2026-05-30"),
                review(p6, "Priya N.", 5, "The charging port is so convenient. Fits my 15\" laptop with room to spare.", "2026-02-14"),
                review(p8, "Suresh K.", 4, "Snappy performance and the camera is excellent in daylight.", "2026-06-01")
        ));
    }

    private Product product(String name, String category, double price, double mrp, String image,
                             double rating, int reviewCount, String description, List<String> highlights,
                             int stock, List<String> tags) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setPrice(price);
        p.setMrp(mrp);
        p.setImage(image);
        p.setRating(rating);
        p.setReviewCount(reviewCount);
        p.setDescription(description);
        p.setHighlights(highlights);
        p.setStock(stock);
        p.setTags(tags);
        return p;
    }

    private Review review(Product product, String author, int rating, String comment, String isoDate) {
        Review r = new Review();
        r.setProduct(product);
        r.setAuthor(author);
        r.setRating(rating);
        r.setComment(comment);
        r.setDate(LocalDate.parse(isoDate));
        return r;
    }
}
