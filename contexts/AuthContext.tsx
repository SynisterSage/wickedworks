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
} from '../lib/auth';

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

        // Check if tokens are expired
        if (isTokenExpired(storedTokens)) {
          localStorage.removeItem('auth_tokens');
          localStorage.removeItem('customer');
          setIsLoading(false);
          return;
        }

        setTokens(storedTokens);

        // Try to load customer from localStorage first
        const storedCustomer = localStorage.getItem('customer');
        if (storedCustomer) {
          setCustomer(JSON.parse(storedCustomer));
        } else {
          // Fetch from API if not in localStorage
          const customerData = await fetchCustomer(storedTokens.accessToken);
          setCustomer(customerData);
          localStorage.setItem('customer', JSON.stringify(customerData));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
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
    authLogout();
  };

  const refreshCustomer = async () => {
    if (!tokens) return;

    try {
      const customerData = await fetchCustomer(tokens.accessToken);
      setCustomer(customerData);
      localStorage.setItem('customer', JSON.stringify(customerData));
    } catch (error) {
      console.error('Failed to refresh customer:', error);
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
