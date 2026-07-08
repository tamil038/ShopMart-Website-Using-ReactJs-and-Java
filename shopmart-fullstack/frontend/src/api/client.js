const BASE_URL = 'http://localhost:8090/api';

const TOKEN_KEY = 'shopmart.token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage failures (e.g. private browsing) */
  }
}

/**
 * Thin wrapper around fetch() that:
 *  - prefixes the ShopMart API base URL
 *  - attaches the JWT (if we have one) as an Authorization header
 *  - parses JSON responses and throws a readable Error on failure,
 *    using the {message} field the backend's GlobalExceptionHandler returns.
 */
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error(
      'Could not reach the ShopMart server. Is the Spring Boot backend running on http://localhost:8090?'
    );
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // --- auth (public) ------------------------------------------------
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),

  // --- products (public) ---------------------------------------------
  getProducts: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.category) qs.set('category', params.category);
    if (params.term) qs.set('term', params.term);
    if (params.sort) qs.set('sort', params.sort);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return request(`/products${suffix}`);
  },
  getFeatured: () => request('/products/featured'),
  getProduct: (id) => request(`/products/${id}`),
  getReviews: (id) => request(`/products/${id}/reviews`),
  getRelated: (id) => request(`/products/${id}/related`),

  // --- cart (auth required) ------------------------------------------
  getCart: () => request('/cart', { auth: true }),
  addToCart: (productId, qty = 1) =>
    request('/cart', { method: 'POST', auth: true, body: { productId, qty } }),
  updateCartQty: (productId, qty) =>
    request(`/cart/${productId}`, { method: 'PUT', auth: true, body: { qty } }),
  removeFromCart: (productId) => request(`/cart/${productId}`, { method: 'DELETE', auth: true }),
  clearCart: () => request('/cart', { method: 'DELETE', auth: true }),

  // --- wishlist (auth required) --------------------------------------
  getWishlist: () => request('/wishlist', { auth: true }),
  toggleWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'POST', auth: true }),

  // --- orders (auth required) -----------------------------------------
  placeOrder: (payload) => request('/orders', { method: 'POST', auth: true, body: payload }),
  getOrders: () => request('/orders', { auth: true }),
  getOrder: (id) => request(`/orders/${id}`, { auth: true }),
  advanceOrder: (id) => request(`/orders/${id}/advance`, { method: 'PATCH', auth: true }),

  // --- profile (auth required) -----------------------------------------
  getProfile: () => request('/profile', { auth: true }),
  updateProfile: (payload) => request('/profile', { method: 'PUT', auth: true, body: payload }),
};

/** Resolves a product image field (relative path or absolute URL) to something <img> can load. */
export function resolveImage(image) {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  return `/${image.replace(/^\/+/, '')}`;
}
