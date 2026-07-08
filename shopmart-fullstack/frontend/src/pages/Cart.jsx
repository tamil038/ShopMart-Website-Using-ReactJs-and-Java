import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveImage } from '../api/client';

export default function Cart() {
  const cart = useCart();
  const auth = useAuth();
  const navigate = useNavigate();

  const shipping = cart.subtotal >= 1999 || cart.subtotal === 0 ? 0 : 79;

  function proceed() {
    navigate(auth.isLoggedIn ? '/checkout' : '/login');
  }

  if (!auth.isLoggedIn) {
    return (
      <main className="page container">
        <h1>Your Shopping Cart</h1>
        <div className="card empty">
          <span className="emoji">🔒</span>
          <p>Log in to view and manage your cart — it's saved securely to your ShopMart account.</p>
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page container">
      <h1>Your Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="card empty">
          <span className="emoji">🛒</span>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-primary">
            Go to Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-item card">
                <img src={resolveImage(item.image)} alt={item.name} />
                <div className="grow">
                  <h3>{item.name}</h3>
                  <p className="price">₹{Math.round(item.price).toLocaleString('en-IN')}</p>
                </div>
                <div className="qty">
                  <button onClick={() => cart.changeQty(item.productId, -1)} aria-label="Decrease quantity">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => cart.changeQty(item.productId, 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <span className="line-total">₹{Math.round(item.price * item.qty).toLocaleString('en-IN')}</span>
                <button className="remove" onClick={() => cart.remove(item.productId)} aria-label="Remove item">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <aside className="summary card">
            <h2>Order Summary</h2>
            <div className="row">
              <span>Subtotal</span>
              <span>₹{Math.round(cart.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            {cart.subtotal < 1999 && (
              <p className="note">Add ₹{Math.round(1999 - cart.subtotal).toLocaleString('en-IN')} more for free shipping.</p>
            )}
            <div className="row total">
              <strong>Total</strong>
              <strong>₹{Math.round(cart.subtotal + shipping).toLocaleString('en-IN')}</strong>
            </div>
            <button className="btn btn-primary btn-block" onClick={proceed}>
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
