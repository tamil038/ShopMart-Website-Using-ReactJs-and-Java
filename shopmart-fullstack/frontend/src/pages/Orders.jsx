import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

const STAGES = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function Orders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .getOrders()
      .then(setOrders)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function advance(id) {
    try {
      const updated = await api.advanceOrder(id);
      setOrders((list) => list.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return null;

  return (
    <main className="page container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="card empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((o) => (
            <div key={o.id} className="order-card card">
              <div className="order-head">
                <div>
                  <h3>Order #{o.id}</h3>
                  <span className="date">{new Date(o.placedAt).toLocaleString()}</span>
                </div>
                <span className="stage-badge">{o.stage}</span>
              </div>

              <div className="items">
                {o.items.map((i) => (
                  <div key={i.productId} className="row">
                    <span>
                      {i.name} × {i.qty}
                    </span>
                    <span>₹{Math.round(i.price * i.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                {o.discount > 0 && (
                  <div className="row discount">
                    <span>Discount ({o.couponCode})</span>
                    <span>−₹{Math.round(o.discount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="row">
                  <strong>Total</strong>
                  <strong>₹{Math.round(o.total).toLocaleString('en-IN')}</strong>
                </div>
                <div className="row muted">
                  <span>Payment: {o.payment}</span>
                </div>
              </div>

              <div className="tracker">
                {STAGES.map((stage, i) => {
                  const currentIdx = STAGES.indexOf(o.stage);
                  return (
                    <div
                      key={stage}
                      className={`step ${currentIdx >= i ? 'done' : ''} ${currentIdx === i ? 'current' : ''}`}
                    >
                      <span className="dot"></span>
                      <span className="label">{stage}</span>
                    </div>
                  );
                })}
              </div>

              {o.stage !== 'Delivered' && (
                <button className="btn btn-sm btn-outline" onClick={() => advance(o.id)}>
                  Simulate Next Update
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
