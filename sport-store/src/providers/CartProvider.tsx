'use client';

import { ReactNode, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { toast } from 'sonner';

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const { fetchCart, error, resetError } = useCartStore();

  // Auto-sync cart on mount and when user logs in
  useEffect(() => {
    const syncCart = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    };

    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      syncCart();
    }

    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        if (e.newValue) {
          syncCart();
        } else {
          // User logged out, clear cart
          useCartStore.setState({ cart: null, error: null });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCart]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      // Auto-reset error after 5 seconds
      const timer = setTimeout(() => {
        resetError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, resetError]);

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
} 