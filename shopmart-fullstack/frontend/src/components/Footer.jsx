import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container grid">
        <div>
          <div className="brand">ShopMart</div>
          <p className="tag">Shop smart. Save big.</p>
        </div>
        <div className="col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">Track Order</Link>
        </div>
        <div className="col">
          <h4>Company</h4>
          <Link to="/about">About ShopMart</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="col">
          <h4>Stay in the loop</h4>
          <p className="tag">Get deals before they're gone.</p>
        </div>
      </div>
      <div className="bottom container">
        <span>© {year} ShopMart. All rights reserved.</span>
        <span className="dashes" aria-hidden="true">
          ✦ - - - - - - - - - -
        </span>
      </div>
    </footer>
  );
}
