import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, resolveImage } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { recordView } from '../utils/recentlyViewed';

export default function ProductDetail() {
  const { id } = useParams();
  const cart = useCart();
  const wishlist = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setQty(1);

    Promise.all([api.getProduct(id), api.getReviews(id), api.getRelated(id)])
      .then(([p, r, rel]) => {
        if (cancelled) return;
        setProduct(p);
        setReviews(r);
        setRelated(rel);
        recordView(p);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return null;

  if (notFound || !product) {
    return (
      <div className="container not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">
          Back to products
        </Link>
      </div>
    );
  }

  const discountPct =
    product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const saved = wishlist.has(product.id);

  return (
    <main className="page container">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/home">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
      </nav>

      <div className="detail-grid">
        <div className="gallery">
          <img src={resolveImage(product.image)} alt={product.name} />
          {discountPct > 0 && <span className="discount">{discountPct}% OFF</span>}
        </div>

        <div className="info">
          <span className="cat">{product.category}</span>
          <h1>{product.name}</h1>
          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="price-row">
            <span className="price">₹{Math.round(product.price).toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <>
                <span className="mrp">₹{Math.round(product.mrp).toLocaleString('en-IN')}</span>
                <span className="save">You save ₹{Math.round(product.mrp - product.price).toLocaleString('en-IN')}</span>
              </>
            )}
          </div>

          <p className="desc">{product.description}</p>

          <ul className="highlights">
            {(product.highlights || []).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <p className={`stock ${product.stock <= 5 ? 'low' : ''}`}>
            {product.stock > 5 ? '✔ In stock' : `⚠ Only ${product.stock} left in stock`}
          </p>

          <div className="actions">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => cart.add(product, qty)}>
              Add to Cart
            </button>
            <button className="btn btn-outline" onClick={() => wishlist.toggle(product)}>
              {saved ? '♥ Saved' : '♡ Save for later'}
            </button>
          </div>

          <div className="perks">
            <span>🚚 Free delivery over ₹1,999</span>
            <span>↩ 7-day easy returns</span>
            <span>🔒 Secure checkout</span>
          </div>
        </div>
      </div>

      <section className="reviews">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="muted">No reviews yet for this product.</p>
        ) : (
          <div className="review-list">
            {reviews.map((r) => (
              <div key={r.id} className="review card">
                <div className="review-head">
                  <strong>{r.author}</strong>
                  <StarRating rating={r.rating} showCount={false} />
                </div>
                <p>{r.comment}</p>
                <span className="date">{r.date}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="related">
          <h2>You may also like</h2>
          <div className="product-grid">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
