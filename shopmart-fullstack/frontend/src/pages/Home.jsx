import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { getRecentlyViewed } from '../utils/recentlyViewed';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Fitness', 'Beauty'];

const CATEGORY_EMOJI = {
  Electronics: '🎧',
  Fashion: '🕶️',
  'Home & Kitchen': '☕',
  'Sports & Fitness': '🏃',
  Beauty: '💄',
};

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const recentlyViewed = getRecentlyViewed();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await api.getFeatured();
        if (!cancelled) setFeatured(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container inner">
          <div className="copy sm-animate-in">
            <span className="eyebrow">Free delivery on orders over ₹1,999</span>
            <h1>
              Shop smart.
              <br />
              Save big.
            </h1>
            <p>
              ShopMart curates the good stuff — electronics, fashion, home and more — and gets it to your door
              quicker than you'd expect.
            </p>
            <div className="cta-row">
              <button className="btn btn-primary" onClick={() => navigate('/products')}>
                Shop Now
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/products')}>
                Browse Categories
              </button>
            </div>
            <div className="stats">
              <div>
                <strong>12k+</strong>
                <span>Happy shoppers</span>
              </div>
              <div>
                <strong>4.4★</strong>
                <span>Average rating</span>
              </div>
              <div>
                <strong>24hr</strong>
                <span>Express dispatch</span>
              </div>
            </div>
          </div>
          <div className="art" aria-hidden="true">
            <div className="orbit"></div>
            <div className="card1">🛍️ New Arrivals</div>
            <div className="card2">🚚 Fast Delivery</div>
            <div className="card3">⭐ Top Rated</div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Browse</span>
            <h2>Shop by Category</h2>
          </div>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat} className="category-card" to={`/products?category=${encodeURIComponent(cat)}`}>
              <span className="emoji">{CATEGORY_EMOJI[cat] || '🛍️'}</span>
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Handpicked</span>
            <h2>Bestsellers Right Now</h2>
          </div>
          <Link to="/products" className="see-all">
            See all products →
          </Link>
        </div>
        {error && <p className="muted">{error}</p>}
        <div className="product-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Pick up where you left off</span>
              <h2>Recently Viewed</h2>
            </div>
          </div>
          <div className="product-grid">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="promo container">
        <div className="promo-card">
          <div>
            <span className="eyebrow" style={{ color: '#26210f99' }}>
              Limited time
            </span>
            <h2>Take 10% off your first order</h2>
            <p>
              Use code <strong>SHOP10</strong> at checkout on any order over ₹999.
            </p>
          </div>
          <button className="btn" style={{ background: '#fff', color: 'var(--sm-yellow-deep)' }} onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
      </section>
    </>
  );
}
