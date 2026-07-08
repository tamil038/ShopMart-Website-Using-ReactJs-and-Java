import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Auth() {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const valid =
    mode === 'login'
      ? email.trim() && password.length >= 4
      : name.trim() && email.trim() && password.length >= 4;

  async function submit(e) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await auth.signup(name.trim(), email.trim(), password);
        toast.success('Account created — welcome to ShopMart!');
      } else {
        await auth.login(email.trim(), password);
        toast.success('Welcome back!');
      }
      const redirectTo = location.state?.from || '/home';
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-art" aria-hidden="true">
        <div className="path"></div>
        <span className="spark">✦</span>
        <h2>
          Shop smart.
          <br />
          Save big.
        </h2>
        <p>ShopMart brings great deals to your door — quick, simple and genuinely rewarding.</p>
      </div>

      <div className="auth-box sm-animate-in">
        <div className="tabs">
          <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            Log In
          </button>
          <button className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
            Sign Up
          </button>
        </div>

        <form className="stack" onSubmit={submit}>
          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              placeholder={mode === 'signup' ? 'Create a password' : '••••••••'}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={!valid || submitting}>
            {submitting ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Log In'}
          </button>
        </form>
        <p className="hint">Signs up against the real ShopMart API — your account is saved in the backend's database.</p>
      </div>
    </div>
  );
}
