import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export default function Profile() {
  const auth = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', address: '' });
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (auth.profile) setForm({ name: auth.profile.name || '', address: auth.profile.address || '' });
  }, [auth.profile]);

  useEffect(() => {
    api.getOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  function initials() {
    const n = form.name || 'ShopMart Shopper';
    return n
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  async function save() {
    setSaving(true);
    try {
      await auth.saveProfile(form);
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page container">
      <h1>My Profile</h1>
      <div className="profile-layout">
        <div className="card form-card">
          <div className="avatar">{initials()}</div>
          <div className="field">
            <label htmlFor="pname">Name</label>
            <input id="pname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="pemail">Email</label>
            <input id="pemail" type="email" value={auth.profile?.email || ''} disabled placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="paddr">Address</label>
            <textarea
              id="paddr"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Full address"
            />
          </div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>

        <div className="recent">
          <h2>Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="muted">No orders yet.</p>
          ) : (
            orders.slice(0, 3).map((o) => (
              <div key={o.id} className="order-card card">
                <div className="row">
                  <strong>#{o.id}</strong>
                  <span className="muted">{new Date(o.placedAt).toLocaleDateString()}</span>
                </div>
                <div className="row">
                  <span>Total</span>
                  <strong>₹{Math.round(o.total).toLocaleString('en-IN')}</strong>
                </div>
                <span className="stage">{o.stage}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
