import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setProducts([]);
      return;
    }
    try {
      const list = await api.getWishlist();
      setProducts(list || []);
    } catch (err) {
      toast.error(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ids = useMemo(() => products.map((p) => p.id), [products]);
  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (product) => {
      if (!isLoggedIn) {
        toast.info('Please log in to save items to your wishlist.');
        return;
      }
      try {
        const res = await api.toggleWishlist(product.id);
        if (res.saved) {
          setProducts((list) => [...list, product]);
          toast.success(`${product.name} saved to wishlist`);
        } else {
          setProducts((list) => list.filter((p) => p.id !== product.id));
          toast.info(`${product.name} removed from wishlist`);
        }
      } catch (err) {
        toast.error(err.message);
      }
    },
    [isLoggedIn, toast]
  );

  const value = { products, ids, has, toggle, count: ids.length, refresh };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}
