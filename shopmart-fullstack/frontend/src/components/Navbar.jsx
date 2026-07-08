import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api, resolveImage } from '../api/client';

export default function Navbar() {
  const cart = useCart();
  const wishlist = useWishlist();
  const auth = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);

  // debounced live search suggestions (innovation)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await api.getProducts({ term: query.trim() });
        setSuggestions(results.slice(0, 5));
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setShowSuggestions(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function submitSearch(e) {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(`/products?term=${encodeURIComponent(query.trim())}`);
  }

  function goToSuggestion(id) {
    setShowSuggestions(false);
    setQuery('');
    navigate(`/products/${id}`);
  }

  function logout() {
    auth.logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="container inner">
        <Link className="logo" to="/home">
          <span className="mark">
            <svg viewBox="0 0 48 48" width="30" height="30" aria-hidden="true">
              <path
                d="M14 18 L10 40 H38 L34 18 Z"
                fill="url(#sm-grad)"
              />
              <path d="M18 18 a6 6 0 0 1 12 0" fill="none" stroke="var(--sm-yellow-deep)" strokeWidth="2.5" />
              <circle cx="18" cy="27" r="2" fill="#fff" />
              <circle cx="30" cy="27" r="2" fill="#fff" />
              <defs>
                <linearGradient id="sm-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--sm-yellow)" />
                  <stop offset="1" stopColor="var(--sm-amber)" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          ShopMart
        </Link>

        <button
          className="burger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="search-box" ref={boxRef}>
          <form className="search-form" onSubmit={submitSearch}>
            <span aria-hidden="true">🔎</span>
            <input
              type="search"
              placeholder="Search ShopMart..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              aria-label="Search products"
            />
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((p) => (
                <button key={p.id} className="suggestion" onClick={() => goToSuggestion(p.id)}>
                  <img src={resolveImage(p.image)} alt="" />
                  <span>
                    <strong>{p.name}</strong>
                    <span className="muted">{p.category}</span>
                  </span>
                  <span className="price">₹{Math.round(p.price).toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/home" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/orders" onClick={() => setMenuOpen(false)}>
            My Orders
          </NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button className="icon-link theme-btn" onClick={theme.toggle} aria-label="Toggle dark mode" title="Toggle dark mode">
            {theme.theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link className="icon-link" to="/wishlist" aria-label="Wishlist">
            ♥
            {wishlist.count > 0 && <span className="dot">{wishlist.count}</span>}
          </Link>
          <Link className="icon-link" to="/cart" aria-label="Cart">
            🛒
            {cart.count > 0 && <span className="dot">{cart.count}</span>}
          </Link>
          {auth.isLoggedIn ? (
            <>
              <Link className="icon-link profile" to="/profile" aria-label="Profile">
                👤
              </Link>
              <button className="btn btn-sm btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-sm btn-primary" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
