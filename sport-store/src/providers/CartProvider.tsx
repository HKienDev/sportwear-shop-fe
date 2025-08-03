'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/cartStore';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAuth } from '@/context/authContext';
import { logInfo, logDebug } from '@/utils/logger';

interface CartProviderProps {
  children: React.ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const { fetchCart, error, resetError } = useCartStore();
  const { isAuthenticated, user } = useAuth();
  const isSyncing = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-sync cart on mount and when user logs in
  useEffect(() => {
    const syncCart = async () => {
      // Prevent multiple simultaneous requests
      if (isSyncing.current) {
        logDebug('Cart sync already in progress, skipping...');
        return;
      }

      try {
        isSyncing.current = true;
        logInfo('🛒 Starting cart sync...');
        await fetchCart();
        logInfo('✅ Cart sync completed');
      } catch (error) {
        logInfo('❌ Failed to sync cart:', error);
        // Don't show error toast for 409 conflicts as they're usually temporary
        if (error instanceof Error && !error.message.includes('409')) {
          logDebug('Cart sync failed but continuing...');
        }
      } finally {
        isSyncing.current = false;
      }
    };

    // Chỉ fetch cart khi user thực sự đã đăng nhập
    if (isAuthenticated && user) {
      logInfo('👤 User authenticated, syncing cart...');
      // Add delay to prevent immediate sync on page load
      syncTimeoutRef.current = setTimeout(() => {
        syncCart();
      }, 1000);
    } else {
      logInfo('👥 Guest user, skipping cart sync');
      // Clear cart for guest users
      useCartStore.setState({ cart: null, error: null, loading: false });
    }

    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        // Clear any pending sync
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }

        if (e.newValue) {
          // Add delay to prevent race conditions
          syncTimeoutRef.current = setTimeout(() => {
            syncCart();
          }, 500);
        } else {
          // User logged out, clear cart
          useCartStore.setState({ cart: null, error: null });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isAuthenticated, user]); // Chỉ depend vào auth state, không depend vào fetchCart

  // Handle errors
  useEffect(() => {
    if (error) {
      // Don't show error toast for 409 conflicts as they're usually temporary
      if (!error.includes('409')) {
        toast.error(error);
      }
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