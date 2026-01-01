import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AuthTokens,
  Customer,
  getStoredTokens,
  storeTokens,
  isTokenExpired,
  fetchCustomer,
  initiateLogin as authInitiateLogin,
  logout as authLogout,
  refreshAccessToken,
} from '../lib/auth';
import { handleError, notifySuccess } from '../lib/toast';

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  // Load auth state on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedTokens = getStoredTokens();
        if (!storedTokens) {
          setIsLoading(false);
          return;
        }

        // Refresh if expired or close to expiring
        const needsRefresh = storedTokens.expiresAt ? Date.now() >= storedTokens.expiresAt - 60000 : false;
        let activeTokens = storedTokens;

        if (needsRefresh && storedTokens.refreshToken) {
          try {
            const refreshed = await refreshAccessToken(storedTokens.refreshToken);
            activeTokens = refreshed;
            storeTokens(refreshed);
          } catch (err) {
            console.error('[AuthContext] Refresh failed, clearing session', err);
            localStorage.removeItem('auth_tokens');
            localStorage.removeItem('customer');
            setIsLoading(false);
            return;
          }
        } else if (isTokenExpired(storedTokens)) {
          localStorage.removeItem('auth_tokens');
          localStorage.removeItem('customer');
          setIsLoading(false);
          return;
        }

        setTokens(activeTokens);

        // Try to load customer from localStorage first
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
          setCustomer(JSON.parse(storedCustomer));
        } else {
          // Fetch from API if not in localStorage
          const customerData = await fetchCustomer(activeTokens.accessToken);
          setCustomer(customerData);
          localStorage.setItem('customer', JSON.stringify(customerData));
        }
      } catch (error) {
        handleError('[AuthContext] Failed to load auth state', error, false);
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('customer');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = () => {
    authInitiateLogin();
  };

  const logout = () => {
    setCustomer(null);
    setTokens(null);
    authLogout({ redirect: false });
    notifySuccess('Logged out successfully');
  };

  const refreshCustomer = async () => {
    if (!tokens) return;

    try {
      let activeTokens = tokens;

      // If token expired but refresh token exists, refresh first
      if (isTokenExpired(tokens) && tokens.refreshToken) {
        const refreshed = await refreshAccessToken(tokens.refreshToken);
        activeTokens = refreshed;
        setTokens(refreshed);
        storeTokens(refreshed);
      }

      const customerData = await fetchCustomer(activeTokens.accessToken);
      setCustomer(customerData);
      localStorage.setItem('customer', JSON.stringify(customerData));
    } catch (error) {
      handleError('[AuthContext] Failed to refresh customer', error);
    }
  };

  // Helper to update tokens and customer (called from callback handler)
  const setAuth = (newTokens: AuthTokens, newCustomer: Customer) => {
    setTokens(newTokens);
    setCustomer(newCustomer);
    storeTokens(newTokens);
    localStorage.setItem('customer', JSON.stringify(newCustomer));
  };

  const value: AuthContextType = {
    customer,
    isAuthenticated: !!customer,
    isLoading,
    login,
    logout,
    refreshCustomer,
  };

  // Expose setAuth for callback handler
  (window as any).__setAuth = setAuth;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
