# ShopMart Frontend ⚛️

The Flycart Angular storefront, rebuilt from scratch in **React 18 + Vite**, rebranded as
**ShopMart**, restyled in a golden-yellow theme, and — unlike the original — **wired to the real
Spring Boot backend** over HTTP instead of `localStorage`.

## Requirements

- **Node.js 18+**
- The **ShopMart backend** running at `http://localhost:8090` (see `../backend/README.md`) — the
  frontend calls it directly for auth, products, cart, wishlist, orders and profile.

## Run it

```bash
cd frontend
npm install
npm run dev
```

Opens on **http://localhost:5173**. Start the backend first (or alongside it) or you'll see a
"Could not reach the ShopMart server" toast on actions that need it.

**Build for production:**
```bash
npm run build
```
Output goes to `dist/` — deploy to any static host. `npm run preview` serves the built output locally.

## What's real vs. client-side

Because the backend enforces auth on cart/wishlist/orders/profile (`anyRequest().authenticated()`
in `SecurityConfig`), those features **require logging in** — there's no guest cart. Trying to add
to cart or wishlist while logged out shows a toast prompting login instead.

Signup/login call the real `/api/auth/*` endpoints and store the returned JWT; every cart, wishlist,
order and profile action sends that JWT as `Authorization: Bearer <token>` and reflects whatever the
backend actually persisted — refresh the page and everything is still there, because it's coming from
the database, not the browser.

The one deliberately client-side piece is the **coupon estimate at checkout**: the discount shown
while typing a code is a local mirror of the backend's rules, purely for instant feedback. The order
is only ever placed by calling `/api/orders`, and the backend re-validates the coupon and computes
the authoritative discount — the preview is just UX, not the source of truth.

## What changed from the Angular version

- **Framework**: Angular standalone components + signals → React 18 function components + hooks
  (`useState`/`useEffect`/`useMemo`) and React Context for global state (auth, cart, wishlist, theme, toasts)
- **Routing**: Angular Router → `react-router-dom` v6, with the same route list and a `ProtectedRoute`
  wrapper standing in for the old `authGuard`
- **Data**: `localStorage` services → a small `fetch` wrapper (`src/api/client.js`) hitting the real API
- **Branding**: Flycart → **ShopMart**, crimson/coral palette → golden-yellow, new logo mark
- **Styling**: Angular SCSS per-component → one global `src/index.css` using CSS custom properties
  (easy to re-theme; see `:root` and `[data-theme="dark"]`)

## Extra features added (beyond the original Angular app)

- **Real API integration** — the headline change; every write actually persists server-side
- **Dark mode toggle** (🌙/☀️ in the navbar), persisted in `localStorage`, driven entirely by CSS variables
- **Live search suggestions** in the navbar — debounced, hits the real `/api/products?term=` endpoint
- **Skeleton loading placeholders** on the product grid instead of a blank screen while data loads
- **Recently viewed products** — a lightweight `localStorage` history shown on the Home page
- **Back-to-top button** that fades in after scrolling
- A profile email field that's correctly **read-only**, since the backend only supports updating
  name/address — the Angular version let you "edit" an email that was never actually saved anywhere

## Project structure

```
src/
  api/client.js          fetch wrapper: base URL, JWT header, error parsing
  context/                AuthContext, CartContext, WishlistContext, ToastContext, ThemeContext
  utils/recentlyViewed.js localStorage-backed recently-viewed helper
  components/             Navbar, Footer, Toast, StarRating, ProductCard, SkeletonCard,
                           LoaderBar, ProtectedRoute, BackToTop
  pages/                  Auth, Home, Products, ProductDetail, Cart, Wishlist, Checkout,
                           OrderComplete, Orders, Profile, About, Contact, NotFound
  index.css               all styling — design tokens + every component/page's CSS
public/assets/img/        product photos (same images the backend's seed data points to)
```

## Notes

- This was built and successfully run (`npm install && npm run build`, plus a live `npm run dev`
  session) in a sandboxed environment, so the React code itself is verified to compile and render.
  It has **not** been tested against a live instance of the backend in that same sandbox (no Maven
  Central access there to build it) — so give the full signup → shop → checkout → track order flow
  a real run once both are up on your machine, and let me know if anything doesn't line up.
- Google Fonts (Fraunces, Inter) are loaded from `fonts.googleapis.com` in `index.html` — swap for
  self-hosted fonts if you need to work offline.
