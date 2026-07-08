import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const wishlist = useWishlist();
  const auth = useAuth();

  if (!auth.isLoggedIn) {
    return (
      <main className="page container">
        <h1>Your Wishlist</h1>
        <div className="card empty">
          <span className="emoji">🔒</span>
          <p>Log in to save products to your wishlist.</p>
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page container">
      <h1>Your Wishlist</h1>
      {wishlist.products.length === 0 ? (
        <div className="card empty">
          <span className="emoji" style={{ color: 'var(--sm-yellow-dark)' }}>
            ♡
          </span>
          <p>Nothing saved yet — tap the heart on any product to keep it here.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
