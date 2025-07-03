import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { debounce } from 'lodash';
import { calculateCartTotals } from '@/utils/cartUtils';
import { CartItem } from '@/types/cart';

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

  // Tính toán cartTotals bằng useMemo
  const cartTotals = useMemo(() => {
    const items = cart?.items || [];
    const totals = calculateCartTotals(items);
    return totals;
  }, [cart?.items]);

  // Debounced update function
  const debouncedUpdate = useRef(
    debounce(async (productData: { sku: string; color?: string; size?: string; quantity?: number }) => {
      try {
        await updateCartItem(productData);
      } catch (error) {
        console.error('Debounced update failed:', error);
      }
    }, 500)
  ).current;

  // Optimized update quantity with debounce
  const updateQuantityOptimized = useCallback(
    async (itemId: string, quantity: number) => {
      const item = getItemById(itemId);
      if (!item) return;

      // Immediate optimistic update
      useCartStore.setState((state) => {
        if (state.cart) {
          const itemIndex = state.cart.items.findIndex(i => i._id === itemId);
          if (itemIndex !== -1) {
            state.cart.items[itemIndex].quantity = quantity;
            const price = item.product.salePrice ?? item.product.originalPrice;
            state.cart.items[itemIndex].totalPrice = quantity * price;
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
      } catch (error) {
        // Revert optimistic updates on error
        useCartStore.setState((state) => {
          if (state.cart) {
            state.cart.items.push(...items);
          }
        });
        throw error;
      }
    },
    [getItemById, removeFromCart]
  );

  // Auto-refresh cart on mount và khi cart thay đổi
  useEffect(() => {
    if (!cart && !loading) {
      fetchCart();
    }
  }, [cart, loading, fetchCart]);

  // Refresh cart khi window focus (user quay lại tab)
  useEffect(() => {
    const handleFocus = () => {
      if (cart && !loading) {
        fetchCart();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [cart, loading, fetchCart]);

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