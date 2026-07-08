import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

// Client-side mirror of the backend's coupon rules (CouponService), used only
// to give the shopper an instant estimate. The backend re-validates the code
// and computes the authoritative discount when the order is actually placed.
const COUPONS = [
  { code: 'SHOP10', type: 'percent', value: 10, minSubtotal: 999, maxDiscount: 400 },
  { code: 'WELCOME15', type: 'percent', value: 15, minSubtotal: 1500, maxDiscount: 600 },
  { code: 'FIRST50', type: 'flat', value: 50, minSubtotal: 300 },
];

export default function Checkout() {
  const cart = useCart();
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: auth.profile?.name || '',
    phone: '',
    address: auth.profile?.address || '',
    city: '',
    state: '',
    zip: '',
  });
  const [payment, setPayment] = useState('COD');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [placing, setPlacing] = useState(false);

  const shipping = cart.subtotal >= 1999 || cart.subtotal === 0 ? 0 : 79;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cart.subtotal < appliedCoupon.minSubtotal) return 0;
    const raw =
      appliedCoupon.type === 'flat' ? appliedCoupon.value : Math.round((cart.subtotal * appliedCoupon.value) / 100);
    return appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
  }, [appliedCoupon, cart.subtotal]);

  const total = Math.max(0, cart.subtotal - discount + shipping);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === code);
    if (!found) {
      toast.error('That coupon code is not valid.');
      return;
    }
    if (cart.subtotal < found.minSubtotal) {
      toast.error(`Add ₹${found.minSubtotal - cart.subtotal} more to use ${found.code}.`);
      return;
    }
    setAppliedCoupon(found);
    toast.success(`Coupon ${found.code} applied!`);
  }

  const formValid =
    customer.name.trim() && customer.phone.trim() && customer.address.trim() && customer.city.trim() &&
    customer.state.trim() && customer.zip.trim();

  async function placeOrder(e) {
    e.preventDefault();
    if (!formValid || placing) return;
    setPlacing(true);
    try {
      const order = await api.placeOrder({
        customer,
        payment,
        couponCode: appliedCoupon?.code || null,
      });
      await cart.refresh();
      toast.success('Order placed successfully!');
      navigate(`/order-complete?id=${order.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (cart.items.length === 0) {
    return (
      <main className="page container">
        <h1>Checkout</h1>
        <div className="card empty">
          <p>Your cart is empty — add something before checking out.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="form-card card" onSubmit={placeOrder}>
          <h2>Shipping Details</h2>
          <div className="grid">
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                pattern="[0-9]{10}"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                required
              />
            </div>
            <div className="field span2">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                value={customer.state}
                onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="zip">Zip Code</label>
              <input
                id="zip"
                value={customer.zip}
                onChange={(e) => setCustomer({ ...customer, zip: e.target.value })}
                required
              />
            </div>
          </div>

          <h2>Payment Method</h2>
          <div className="pay-options">
            <label className={`pay-option ${payment === 'COD' ? 'active' : ''}`}>
              <input type="radio" name="pay" value="COD" checked={payment === 'COD'} onChange={(e) => setPayment(e.target.value)} />{' '}
              💵 Cash on Delivery
            </label>
            <label className={`pay-option ${payment === 'Card' ? 'active' : ''}`}>
              <input type="radio" name="pay" value="Card" checked={payment === 'Card'} onChange={(e) => setPayment(e.target.value)} />{' '}
              💳 Credit / Debit Card
            </label>
            <label className={`pay-option ${payment === 'UPI' ? 'active' : ''}`}>
              <input type="radio" name="pay" value="UPI" checked={payment === 'UPI'} onChange={(e) => setPayment(e.target.value)} />{' '}
              📱 UPI / Net Banking
            </label>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={!formValid || placing}>
            {placing ? 'Placing order…' : `Place Order · ₹${Math.round(total).toLocaleString('en-IN')}`}
          </button>
        </form>

        <aside className="summary card">
          <h2>Order Summary</h2>
          <div className="lines">
            {cart.items.map((item) => (
              <div key={item.productId} className="row">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{Math.round(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="coupon">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
            />
            <button type="button" className="btn btn-sm btn-ghost" onClick={applyCoupon}>
              Apply
            </button>
          </div>
          {appliedCoupon ? (
            <p className="applied">✓ {appliedCoupon.code} applied</p>
          ) : (
            <p className="hint">Try SHOP10, WELCOME15 or FIRST50</p>
          )}

          <div className="row">
            <span>Subtotal</span>
            <span>₹{Math.round(cart.subtotal).toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 && (
            <div className="row discount">
              <span>Discount</span>
              <span>−₹{Math.round(discount).toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
          </div>
          <div className="row total">
            <strong>Total</strong>
            <strong>₹{Math.round(total).toLocaleString('en-IN')}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
