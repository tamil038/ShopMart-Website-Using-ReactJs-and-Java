import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { resolveImage } from '../api/client';

export default function ProductCard({ product }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const discountPct =
    product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const saved = wishlist.has(product.id);

  function onWish(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    wishlist.toggle(product);
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="thumb-link">
        <img src={resolveImage(product.image)} alt={product.name} loading="lazy" />
        {discountPct > 0 && <span className="discount">{discountPct}% OFF</span>}
        {product.stock <= 5 && <span className="low-stock">Only {product.stock} left</span>}
        <button className="wish-btn" onClick={onWish} aria-pressed={saved} aria-label="Toggle wishlist">
          {saved ? '♥' : '♡'}
        </button>
      </Link>
      <div className="body">
        <span className="cat">{product.category}</span>
        <Link to={`/products/${product.id}`} className="name">
          {product.name}
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="price-row">
          <span className="price">₹{Math.round(product.price).toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <span className="mrp">₹{Math.round(product.mrp).toLocaleString('en-IN')}</span>
          )}
        </div>
        <button className="btn btn-primary btn-sm btn-block" onClick={() => cart.add(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
