import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const cart = await api.getCart();
      setItems(cart.items || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const requireLogin = useCallback(() => {
    toast.info('Please log in to use your cart.');
  }, [toast]);

  const add = useCallback(
    async (product, qty = 1) => {
      if (!isLoggedIn) return requireLogin();
      try {
        const cart = await api.addToCart(product.id, qty);
        setItems(cart.items || []);
        toast.success(`${product.name} added to cart`);
      } catch (err) {
        toast.error(err.message);
      }
    },
    [isLoggedIn, requireLogin, toast]
  );

  const changeQty = useCallback(
    async (productId, delta) => {
      const current = items.find((i) => i.productId === productId);
      if (!current) return;
      const nextQty = current.qty + delta;
      try {
        const cart =
          nextQty <= 0 ? await api.removeFromCart(productId) : await api.updateCartQty(productId, nextQty);
        setItems(cart.items || []);
      } catch (err) {
        toast.error(err.message);
      }
    },
    [items, toast]
  );

  const remove = useCallback(
    async (productId) => {
      try {
        const cart = await api.removeFromCart(productId);
        setItems(cart.items || []);
      } catch (err) {
        toast.error(err.message);
      }
    },
    [toast]
  );

  const clear = useCallback(async () => {
    try {
      const cart = await api.clearCart();
      setItems(cart.items || []);
    } catch (err) {
      toast.error(err.message);
    }
  }, [toast]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items]);

  const value = { items, loading, count, subtotal, add, changeQty, remove, clear, refresh };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
