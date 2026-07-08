# 🛍️ ShopMart — Full-Stack E-Commerce Storefront

ShopMart is a full-stack e-commerce application with a **Spring Boot REST API backend** and a
**React 18 + Vite** frontend. It started life as an Angular + Spring Boot project ("Flycart") and
was rebuilt into ShopMart: a new React frontend in a golden-yellow theme, wired to a real backend
instead of browser storage, with the backend restructured into its own `com.shopmart.backend`
package.

```
shopmart-fullstack/
├── backend/      Spring Boot REST API (Java 21, H2 database, JWT auth)
└── frontend/     React 18 + Vite storefront (golden-yellow theme)
```

## Tech stack

| Layer    | Tech |
|---|---|
| Backend  | Java 21, Spring Boot 3.3.5, Spring Security + JWT (`jjwt` 0.11.5), Spring Data JPA, H2 (file-based), Maven |
| Frontend | React 18, Vite 5, React Router v6, Context API (no Redux), hand-written `fetch` API client |

## Features

- **Auth** — signup/login issuing a JWT, attached automatically to protected requests
- **Product catalog** — search, category filter, sort (relevance / price / rating), related products
- **Cart** — add/update/remove items, persisted server-side per user
- **Wishlist** — toggle save/unsave on products
- **Checkout** — coupon codes (`SHOP10`, `WELCOME15`, `FIRST50`), order placement
- **Order tracking** — orders move through tracking stages
- **Profile** — view/update name and address
- **UX extras** — dark mode, debounced live search, skeleton loaders, recently-viewed strip,
  back-to-top button

## Requirements

- **Java 21** (JDK) — check with `java -version`
- **Maven** — check with `mvn -version`
- **Node.js 18+** and npm — check with `node -version`

## Quick start

**1. Start the backend:**
```bash
cd backend
mvn clean spring-boot:run
```
Runs on **http://localhost:8090** and auto-seeds a 12-product catalog on first run. Data persists
to `backend/data/shopmartdb.mv.db`; delete that file for a completely fresh database.

**2. Start the frontend**, in a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173**.

**3. Open http://localhost:5173** — sign up for an account, browse, add to cart, and place an
order. Everything is stored in the backend's H2 database, not just the browser (the coupon preview
at checkout is the one deliberately client-side piece — the backend re-validates and computes the
authoritative discount when the order is placed).

> Note: cart, wishlist, orders, and profile require being logged in — there's no guest cart, since
> the backend requires authentication on those endpoints.

## API Reference

All endpoints are under `/api`. 🔒 = requires `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/signup` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

Both return `{ token, profile: { name, email, address } }`.

### Products (public)
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/products?category=&term=&sort=` | `sort` = `relevance` \| `price-asc` \| `price-desc` \| `rating` |
| GET | `/api/products/featured` | Bestseller-tagged products |
| GET | `/api/products/{id}` | Single product |
| GET | `/api/products/{id}/reviews` | Reviews for a product |
| GET | `/api/products/{id}/related` | Same-category products |

### Cart 🔒
| Method | Endpoint | Body |
|---|---|---|
| GET | `/api/cart` | — |
| POST | `/api/cart` | `{ productId, qty }` |
| PUT | `/api/cart/{productId}` | `{ qty }` (absolute) |
| DELETE | `/api/cart/{productId}` | — |
| DELETE | `/api/cart` | Clears the whole cart |

### Wishlist 🔒
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/wishlist` | List of saved products |
| POST | `/api/wishlist/{productId}` | Toggles saved/unsaved, returns `{ saved: true/false }` |

### Orders 🔒
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/orders` | `{ customer: {name, phone, address, city, state, zip}, payment, couponCode }` |
| GET | `/api/orders` | List your orders, most recent first |
| GET | `/api/orders/{id}` | One order |
| PATCH | `/api/orders/{id}/advance` | Moves the order to its next tracking stage (demo/simulation) |

### Profile 🔒
| Method | Endpoint | Body |
|---|---|---|
| GET | `/api/profile` | — |
| PUT | `/api/profile` | `{ name, address }` |

## Project structure

```
backend/src/main/java/com/shopmart/backend/
  model/        User, Product, Review, CartItem, WishlistItem, Order, OrderItem, OrderStage
  repository/   Spring Data JPA repositories
  dto/          Request/response records (AuthDtos, ProductDtos, CartDtos, OrderDtos, ProfileDtos)
  service/      Business logic (AuthService, ProductService, CartService, WishlistService, ...)
  controller/   REST endpoints
  security/     JwtService, JwtAuthFilter, CustomUserDetailsService
  config/       SecurityConfig (JWT filter chain, CORS, password encoding)
  exception/    ApiException + global @RestControllerAdvice
  seed/         DataSeeder — inserts the product catalog on first run

frontend/src/
  api/client.js          fetch wrapper: base URL, JWT header, error parsing
  context/                AuthContext, CartContext, WishlistContext, ToastContext, ThemeContext
  utils/recentlyViewed.js localStorage-backed recently-viewed helper
  components/             Navbar, Footer, Toast, StarRating, ProductCard, SkeletonCard, ...
  pages/                  Auth, Home, Products, ProductDetail, Cart, Wishlist, Checkout, ...
  index.css               design tokens + all component/page styling
```

## H2 console (optional)

Visit **http://localhost:8090/h2-console** with:
- JDBC URL: `jdbc:h2:file:./data/shopmartdb`
- User: `sa`, Password: *(blank)*

## Configuration

Backend config lives in `backend/src/main/resources/application.properties`:
- `server.port` — defaults to `8090`
- `app.cors.allowed-origins` — defaults to `http://localhost:5173,http://localhost:4200`
- `app.jwt.secret` / `app.jwt.expiration-ms` — **change the JWT secret before deploying anywhere real**

## What changed from the Angular (Flycart) version

- **Framework**: Angular standalone components + signals → React 18 function components + hooks,
  with Context API for global state
- **Routing**: Angular Router → `react-router-dom` v6, with a `ProtectedRoute` wrapper standing in
  for the old `authGuard`
- **Data**: `localStorage` services → a real `fetch`-based API client hitting the Spring Boot backend
- **Branding**: Flycart → ShopMart, crimson/coral palette → golden-yellow
- **Backend package**: renamed from `com.flycart.backend` to `com.shopmart.backend` across all
  source files and `pom.xml`

## Known notes / troubleshooting

- Run `mvn clean spring-boot:run` (not just `spring-boot:run`) the first time, so no stale compiled
  classes from an old package name linger in `target/`.
- If port `8090` or `5173` is already in use, change `server.port` in
  `application.properties` (backend) or the `server.port` in `vite.config.js` (frontend), and update
  `app.cors.allowed-origins` to match.
- If the frontend shows a "Could not reach the ShopMart server" toast, make sure the backend is
  running first and check the CORS origin list matches your frontend's actual port.

## License

This project is for educational/portfolio purposes.
