const KEY = 'shopmart.recentlyViewed';
const MAX_ITEMS = 8;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

/** Records a product (lightweight shape) as recently viewed, most-recent first. */
export function recordView(product) {
  try {
    const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
    const entry = {
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: product.category,
      stock: product.stock,
    };
    const next = [entry, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore storage failures */
  }
}
