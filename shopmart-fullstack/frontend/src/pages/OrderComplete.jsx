import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export default function OrderComplete() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    api.getOrder(id).then(setOrder).catch(() => setOrder(null));
  }, [id]);

  return (
    <main className="center container">
      <div className="card">
        <div className="big-check">✔</div>
        <h2>Order Placed Successfully!</h2>
        <p>
          Thanks for shopping with <strong>ShopMart</strong>. Your order is already being packed.
        </p>
        {order && (
          <>
            <p className="order-id">
              Order ID: <span>#{order.id}</span>
            </p>
            <p className="total-line">
              Total paid: <strong>₹{Math.round(order.total).toLocaleString('en-IN')}</strong> · {order.payment}
            </p>
          </>
        )}
        <div className="actions">
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
