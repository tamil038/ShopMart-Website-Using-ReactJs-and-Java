import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  // On load, if we have a token, fetch the profile it belongs to.
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const p = await api.getProfile();
        if (!cancelled) setProfile(p);
      } catch {
        // token expired / invalid — clear it silently
        if (!cancelled) {
          setToken(null);
          setTokenState(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyAuthResponse = useCallback((res) => {
    setToken(res.token);
    setTokenState(res.token);
    setProfile(res.profile);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await api.login({ email, password });
      applyAuthResponse(res);
      return res;
    },
    [applyAuthResponse]
  );

  const signup = useCallback(
    async (name, email, password) => {
      const res = await api.signup({ name, email, password });
      applyAuthResponse(res);
      return res;
    },
    [applyAuthResponse]
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setProfile(null);
  }, []);

  const saveProfile = useCallback(async (form) => {
    const updated = await api.updateProfile(form);
    setProfile(updated);
    return updated;
  }, []);

  const value = {
    isLoggedIn: !!token,
    ready,
    profile,
    login,
    signup,
    logout,
    saveProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
