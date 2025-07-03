import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/authContext';
import { apiClient } from '@/lib/apiClient';
import { safePromise } from '@/utils/promiseUtils';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import type { Product, ProductFormData } from '@/types/product';

interface CartData {
  sku: string;
  color: string;
  size: string;
  quantity: number;
}

export function useProductActions(productId?: string) {
  const router = useRouter();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create product
  const createProduct = useCallback(async (productData: ProductFormData) => {
    try {
      setLoading(true);
      
      const response = await apiClient.createProduct(productData);
      
      if (response.data.success) {
        toast.success(SUCCESS_MESSAGES.PRODUCT_CREATED);
        return response.data.data as Product;
      } else {
        throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      toast.error(errorMessage);
      console.error('Create product error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id: string, productData: ProductFormData) => {
    try {
      setLoading(true);
      
      const response = await apiClient.updateProduct(id, productData);
      
      if (response.data.success) {
        toast.success(SUCCESS_MESSAGES.PRODUCT_UPDATED);
        return response.data.data as Product;
      } else {
        throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      toast.error(errorMessage);
      console.error('Update product error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const response = await apiClient.deleteProduct(id);
      
      if (response.data.success) {
        toast.success(SUCCESS_MESSAGES.PRODUCT_DELETED);
        return response.data.data;
      } else {
        throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      toast.error(errorMessage);
      console.error('Delete product error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (data: CartData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Bắt đầu thêm vào giỏ hàng:', data);

      // Kiểm tra và refresh token nếu cần
      await checkAuthStatus();
      
      console.log('🔐 Token đã được kiểm tra');
      
      const result = await safePromise(
        apiClient.addToCart(data),
        'Không thể thêm sản phẩm vào giỏ hàng'
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
      
      const response = result.data;
      
      if (!response) {
        throw new Error('Response không hợp lệ từ server');
      }
      
      if (response.data && response.data.success) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const buyNow = async (data: CartData) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng');
      router.push('/auth/login');
      return { success: false, message: 'Vui lòng đăng nhập' };
    }

    try {
      setLoading(true);
      setError(null);

      const result = await safePromise(
        apiClient.addToCart(data),
        'Không thể thêm sản phẩm vào giỏ hàng'
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
      
      const response = result.data;
      
      if (!response) {
        throw new Error('Response không hợp lệ từ server');
      }
      
      if (response.data && response.data.success) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        router.push('/user/cart');
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Error buying now:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      router.push('/auth/login');
      return { success: false, message: 'Vui lòng đăng nhập' };
    }

    try {
      setLoading(true);
      setError(null);

      const result = await safePromise(
        fetch('/api/favorites/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId
          }),
          credentials: 'include'
        }),
        'Không thể thêm sản phẩm vào danh sách yêu thích'
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Không thể thêm sản phẩm vào danh sách yêu thích');
      }
      
      const response = result.data;
      
      if (!response) {
        throw new Error('Response không hợp lệ từ server');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Không thể thêm sản phẩm vào danh sách yêu thích');
      }
      
      toast.success('Đã thêm sản phẩm vào danh sách yêu thích');
      return { success: true, data };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào danh sách yêu thích';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    buyNow,
    toggleFavorite,
    error
  };
} 