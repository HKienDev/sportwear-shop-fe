import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/stores/cartStore';
import { calculateCartTotals } from '@/utils/cartUtils';
import { debounce } from 'lodash';
import type { Cart, CartItem } from '@/types/cart';
import { useAuth } from '@/context/authContext';
import { logInfo, logDebug } from '@/utils/logger';

export function useCartOptimized() {
  const {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    resetError,
    getItemById,
    getItemBySku,
  } = useCartStore();
  
  const { isAuthenticated, user } = useAuth();

  // Tính toán cartTotals bằng useMemo
  const cartTotals = useMemo(() => {
    const items = cart?.items || [];
    const totals = calculateCartTotals(items);
    return totals;
  }, [cart?.items]);

  // Debounced update function
  const debouncedUpdate = useMemo(
    () => debounce(async (data: { sku: string; color?: string; size?: string; quantity: number }) => {
      try {
        await updateCartItem(data);
      } catch (error: any) {
        console.error('Failed to update cart item:', error);
        
        // Xử lý lỗi 401 - token hết hạn
        if (error?.status === 401 || error?.response?.status === 401) {
          console.log('🔍 useCartOptimized - 401 error in debouncedUpdate');
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          toast.error('Không thể cập nhật giỏ hàng');
        }
      }
    }, 500),
    [updateCartItem]
  );

  // Optimized update quantity function
  const updateQuantityOptimized = useCallback(
    async (itemId: string, quantity: number) => {
      const item = getItemById(itemId);
      if (!item) {
        console.warn('Item not found in cart:', itemId);
        return;
      }

      // Optimistic update
      useCartStore.setState((state) => {
        if (state.cart) {
          const item = state.cart.items.find(i => i._id === itemId);
          if (item) {
            item.quantity = quantity;
          }
        }
      });

      // Debounced API call
      debouncedUpdate({
        sku: item.product.sku,
        color: item.color,
        size: item.size,
        quantity,
      });
    },
    [getItemById, debouncedUpdate]
  );

  // Batch remove items
  const removeItemsBatch = useCallback(
    async (itemIds: string[]) => {
      const items: CartItem[] = itemIds
        .map(id => getItemById(id))
        .filter((item): item is CartItem => Boolean(item));
      
      // Optimistic updates
      useCartStore.setState((state) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter(item => !itemIds.includes(item._id));
        }
      });

      // Batch API calls
      const promises = items.map(item => 
        removeFromCart({
          sku: item.product.sku,
          color: item.color,
          size: item.size,
        })
      );

      try {
        await Promise.all(promises);
      } catch (error: any) {
        // Revert optimistic updates on error
        useCartStore.setState((state) => {
          if (state.cart) {
            state.cart.items.push(...items);
          }
        });
        
        // Xử lý lỗi 401 - token hết hạn
        if (error?.status === 401 || error?.response?.status === 401) {
          console.log('🔍 useCartOptimized - 401 error in removeItemsBatch');
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        
        throw error;
      }
    },
    [getItemById, removeFromCart]
  );

  // CartProvider đã handle fetchCart, không cần tự động fetch ở đây
  // useEffect(() => {
  //   if (isAuthenticated && user && !cart && !loading) {
  //     logInfo(`🛒 useCartOptimized - Fetching cart for authenticated user at ${new Date().toISOString()}`);
  //     fetchCart();
  //   } else if (!isAuthenticated || !user) {
  //     // Clear cart khi user logout
  //     logInfo(`🛒 useCartOptimized - User logged out, clearing cart at ${new Date().toISOString()}`);
  //     useCartStore.setState({ cart: null, error: null, loading: false });
  //   }
  // }, [isAuthenticated, user]); // Chỉ depend vào auth state, không depend vào cart/loading/fetchCart

  // Refresh cart khi window focus (user quay lại tab) - CHỈ KHI USER ĐÃ ĐĂNG NHẬP
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && user && cart && !loading) {
        logInfo(`🛒 useCartOptimized - Refreshing cart on window focus at ${new Date().toISOString()}`);
        fetchCart().catch((error: any) => {
          // Xử lý lỗi 401 - token hết hạn
          if (error?.status === 401 || error?.response?.status === 401) {
            console.log('🔍 useCartOptimized - 401 error in handleFocus, not showing error');
            // Không hiển thị error cho 401 vì đã được xử lý ở component khác
          }
        });
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, user]); // Chỉ depend vào auth state, không depend vào cart/loading/fetchCart

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return {
    // State
    cart,
    loading,
    error,
    cartTotals,
    
    // Actions
    fetchCart,
    addToCart,
    updateCartItem: updateQuantityOptimized,
    removeFromCart,
    removeItemsBatch,
    clearCart,
    resetError,
    
    // Utilities
    getItemById,
    getItemBySku,
    
    // Computed
    isEmpty: !cart?.items || cart.items.length === 0,
    itemCount: cart?.items.length || 0,
  };
} 