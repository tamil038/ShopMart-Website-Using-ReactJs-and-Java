# 🛍️ ShopMart — Full-Stack E-Commerce Storefront

**ShopMart** is the Flycart project reimagined: a standalone **Spring Boot backend** (`com.shopmart.backend`,
built using Flycart's backend as a reference rather than shipped as-is) paired with a **React 18 +
Vite** frontend that replaces the original Angular app — restyled in a golden-yellow theme, and
actually **wired to the real backend** instead of running on browser storage alone.

```
shopmart-fullstack/
├── backend/      Spring Boot REST API (Java 21, H2 database, JWT auth) — own package, own identity
└── frontend/     ShopMart storefront, rebuilt in React 18 + Vite
```

## Quick start

**1. Start the backend:**
```bash
cd backend
mvn spring-boot:run
```
Runs on **http://localhost:8090** and auto-seeds a 12-product catalog on first run.

**2. Start the frontend**, in a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173**.

**3. Open http://localhost:5173** — sign up for a real account, browse, add to cart, and place an
order. It's genuinely stored in the backend's H2 database, not just your browser.

See `backend/README.md` and `frontend/README.md` for full details, the API reference, and what
changed from the original project.

## What this project demonstrates

- A **Java/Spring Boot REST API** (JWT auth, Spring Data JPA, layered service/controller/DTO
  architecture) in its own `com.shopmart.backend` package — built using Flycart's backend as a
  reference, then separated into its own identity and debugged against a real running frontend
- A **React 18 frontend** built with hooks and Context (no Redux needed at this scale), React
  Router v6, and a hand-written `fetch` API client — no Angular, no `localStorage`-as-database
- Real **end-to-end integration**: signup issues a JWT, the JWT is attached to every protected
  request, and cart/wishlist/orders/profile all round-trip through the actual backend
- A few small UX touches that go beyond "make it work": dark mode, debounced live search, skeleton
  loaders, and a recently-viewed strip — all listed with the reasoning behind them in
  `frontend/README.md`

## Honest caveats

- The frontend was built and run successfully in a sandboxed environment (`npm install`,
  `npm run build`, and a live `npm run dev` session with no console errors). Running it against a
  live backend surfaced two real bugs — `ProductService` and `CartService` were missing
  `@Transactional`, causing `LazyInitializationException`s on lazy-loaded fields — both fixed; see
  `backend/README.md` for details.
- The backend itself has not been build-tested with an actual `mvn` run in the sandbox that produced
  it (no Maven Central access there). Run `mvn clean spring-boot:run` on your machine as the first
  check — the `clean` matters after the recent package rename, so no stale classes linger in `target/`.
