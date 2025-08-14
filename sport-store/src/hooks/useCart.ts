import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { handleCartError, calculateCartTotals } from '@/utils/cartUtils';
import type { Cart } from '@/types/cart';
import { useAuth } from '@/context/authContext';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getCart();
      
      if (response.data.success) {
        setCart(response.data.data as Cart);
      } else {
        throw new Error(response.data.message || 'Không thể lấy giỏ hàng');
      }
    } catch (err: any) {
      const errorMessage = handleCartError(err, 'fetch');
      setError(errorMessage);
      
      // Xử lý lỗi 401 - token hết hạn
      if (err?.status === 401 || err?.response?.status === 401) {
        console.log('🔍 useCart - 401 error in fetchCart');
        // Không hiển thị toast cho fetchCart 401 vì có thể là guest user
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (productData: { sku: string; color?: string; size?: string; quantity?: number }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.addToCart(productData);

      if (response.data.success) {
        setCart(response.data.data as Cart);
        toast.success('Sản phẩm đã được thêm vào giỏ hàng');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    } catch (err: any) {
      const errorMessage = handleCartError(err, 'add');
      setError(errorMessage);
      
      // Xử lý lỗi 401 - token hết hạn
      if (err?.status === 401 || err?.response?.status === 401) {
        console.log('🔍 useCart - 401 error in addToCart');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update cart item
  const updateCartItem = useCallback(async (productData: { sku: string; color?: string; size?: string; quantity?: number }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.updateCart(productData);

      if (response.data.success) {
        setCart(response.data.data as Cart);
        toast.success('Giỏ hàng đã được cập nhật');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể cập nhật giỏ hàng');
      }
    } catch (err: any) {
      const errorMessage = handleCartError(err, 'update');
      setError(errorMessage);
      
      // Xử lý lỗi 401 - token hết hạn
      if (err?.status === 401 || err?.response?.status === 401) {
        console.log('🔍 useCart - 401 error in updateCartItem');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(async (productData: { sku: string; color?: string; size?: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.removeFromCart(productData);

      if (response.data.success) {
        setCart(response.data.data as Cart);
        toast.success('Sản phẩm đã được xóa khỏi giỏ hàng');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
      }
    } catch (err: any) {
      const errorMessage = handleCartError(err, 'remove');
      setError(errorMessage);
      
      // Xử lý lỗi 401 - token hết hạn
      if (err?.status === 401 || err?.response?.status === 401) {
        console.log('🔍 useCart - 401 error in removeFromCart');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.clearCart() as import('axios').AxiosResponse<{ success: boolean; message: string; data?: unknown }>;

      if (response.data.success) {
        setCart(null);
        toast.success('Giỏ hàng đã được làm trống');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể xóa giỏ hàng');
      }
    } catch (err: any) {
      const errorMessage = handleCartError(err, 'clear');
      setError(errorMessage);
      
      // Xử lý lỗi 401 - token hết hạn
      if (err?.status === 401 || err?.response?.status === 401) {
        console.log('🔍 useCart - 401 error in clearCart');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate cart totals
  const cartTotals = useCallback(() => {
    return calculateCartTotals(cart?.items || []);
  }, [cart?.items]);

  // Load cart on mount - CHỈ KHI USER ĐÃ ĐĂNG NHẬP
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🛒 useCart - Fetching cart for authenticated user');
      fetchCart().catch((error: any) => {
        // Xử lý lỗi 401 - token hết hạn
        if (error?.status === 401 || error?.response?.status === 401) {
          console.log('🔍 useCart - 401 error in useEffect, not showing error');
          // Không hiển thị error cho 401 vì đã được xử lý ở component khác
        }
      });
    } else {
      console.log('👥 useCart - Guest user, skipping cart fetch');
    }
  }, [fetchCart, isAuthenticated, user]);

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartTotals: cartTotals()
  };
} 