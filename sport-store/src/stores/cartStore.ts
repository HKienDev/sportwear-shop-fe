import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { handleCartError, calculateCartTotals } from '@/utils/cartUtils';
import type { CartItem, Cart } from '@/types/cart';

interface CartState {
  // State
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productData: { sku: string; color?: string; size?: string; quantity?: number }) => Promise<void>;
  updateCartItem: (productData: { sku: string; color?: string; size?: string; quantity?: number }) => Promise<void>;
  removeFromCart: (productData: { sku: string; color?: string; size?: string }) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Utilities
  resetError: () => void;
  getItemById: (itemId: string) => CartItem | undefined;
  getItemBySku: (sku: string, color: string, size: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        cart: null,
        loading: false,
        error: null,
        
        // Actions
        fetchCart: async () => {
          try {
            set((state) => {
              state.loading = true;
              state.error = null;
            });
            
            const response = await apiClient.getCart();
            
            if (response.data.success) {
              const cartData = response.data.data as Cart;
              
              set((state) => {
                state.cart = cartData;
                state.loading = false;
              });
            } else {
              throw new Error(response.data.message || 'Không thể lấy giỏ hàng');
            }
          } catch (error) {
            const errorMessage = handleCartError(error, 'fetch');
            set((state) => {
              state.error = errorMessage;
              state.loading = false;
            });
          }
        },
        
        addToCart: async (productData) => {
          try {
            set((state) => {
              state.loading = true;
              state.error = null;
            });
            
            const response = await apiClient.addToCart(productData);
            
            if (response.data.success) {
              set((state) => {
                state.cart = response.data.data as Cart;
                state.loading = false;
              });
              toast.success('Sản phẩm đã được thêm vào giỏ hàng');
            } else {
              throw new Error(response.data.message || 'Không thể thêm sản phẩm vào giỏ hàng');
            }
          } catch (error) {
            const errorMessage = handleCartError(error, 'add');
            set((state) => {
              state.error = errorMessage;
              state.loading = false;
            });
            throw error;
          }
        },
        
        updateCartItem: async (productData) => {
          const { cart } = get();
          
          // Optimistic update
          const item = cart?.items.find(i => 
            i.product.sku === productData.sku && 
            i.color === productData.color && 
            i.size === productData.size
          );
          
          if (item) {
            set((state) => {
              if (state.cart) {
                const itemIndex = state.cart.items.findIndex(i => i._id === item._id);
                if (itemIndex !== -1 && productData.quantity !== undefined) {
                  state.cart.items[itemIndex].quantity = productData.quantity;
                  const price = item.product.salePrice ?? item.product.originalPrice;
                  state.cart.items[itemIndex].totalPrice = productData.quantity * price;
                }
              }
            });
          }
          
          try {
            const response = await apiClient.updateCart(productData);
            
            if (response.data.success) {
              set((state) => {
                state.cart = response.data.data as Cart;
                state.loading = false;
              });
              toast.success('Giỏ hàng đã được cập nhật');
            } else {
              throw new Error(response.data.message || 'Không thể cập nhật giỏ hàng');
            }
          } catch (error) {
            // Revert optimistic update by refetching cart
            try {
              await get().fetchCart();
            } catch (refetchError) {
              console.error('Failed to refetch cart after error:', refetchError);
            }
            
            const errorMessage = handleCartError(error, 'update');
            set((state) => {
              state.error = errorMessage;
              state.loading = false;
            });
            throw error;
          }
        },
        
        removeFromCart: async (productData) => {
          const { cart } = get();
          
          // Optimistic update
          const item = cart?.items.find(i => 
            i.product.sku === productData.sku && 
            i.color === productData.color && 
            i.size === productData.size
          );
          
          if (item) {
            set((state) => {
              if (state.cart) {
                state.cart.items = state.cart.items.filter(i => i._id !== item._id);
              }
            });
          }
          
          try {
            const response = await apiClient.removeFromCart(productData);
            
            if (response.data.success) {
              set((state) => {
                state.cart = response.data.data as Cart;
                state.loading = false;
              });
              toast.success('Sản phẩm đã được xóa khỏi giỏ hàng');
            } else {
              // Revert optimistic update
              if (item) {
                set((state) => {
                  if (state.cart) {
                    state.cart.items.push(item);
                  }
                });
              }
              throw new Error(response.data.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
            }
          } catch (error) {
            // Revert optimistic update
            if (item) {
              set((state) => {
                if (state.cart) {
                  state.cart.items.push(item);
                }
              });
            }
            
            const errorMessage = handleCartError(error, 'remove');
            set((state) => {
              state.error = errorMessage;
              state.loading = false;
            });
            throw error;
          }
        },
        
        clearCart: async () => {
          try {
            set((state) => {
              state.loading = true;
              state.error = null;
            });
            
            const response = await apiClient.clearCart();
            
            const data = response.data as { success: boolean; message?: string; data?: any };
            if (data.success) {
              set((state) => {
                state.cart = null;
                state.loading = false;
              });
              toast.success('Giỏ hàng đã được làm trống');
            } else {
              throw new Error(data.message || 'Không thể xóa giỏ hàng');
            }
          } catch (error) {
            const errorMessage = handleCartError(error, 'clear');
            set((state) => {
              state.error = errorMessage;
              state.loading = false;
            });
            throw error;
          }
        },
        

        
        // Utilities
        resetError: () => {
          set((state) => {
            state.error = null;
          });
        },
        
        getItemById: (itemId) => {
          const { cart } = get();
          return cart?.items.find(item => item._id === itemId);
        },
        
        getItemBySku: (sku, color, size) => {
          const { cart } = get();
          return cart?.items.find(item => 
            item.product.sku === sku && 
            item.color === color && 
            item.size === size
          );
        },
      })),
      {
        name: 'cart-storage',
        partialize: (state) => ({ 
          cart: state.cart
        }),
      }
    ),
    {
      name: 'cart-store',
    }
  )
);

// Selector để tính cartTotals
export const useCartTotals = () => {
  return useCartStore((state) => {
    const items = state.cart?.items || [];
    return calculateCartTotals(items);
  });
}; 