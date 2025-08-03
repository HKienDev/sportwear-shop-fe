import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useAuthModal } from '@/context/authModalContext';
import { useCartOptimized } from './useCartOptimized';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { safePromise } from '@/utils/promiseUtils';

interface CartData {
  sku: string;
  color: string;
  size: string;
  quantity: number;
}

export function useProductActions(productId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { addToCart, fetchCart } = useCartOptimized();
  const router = useRouter();

  const handleAuthRequired = (action: string, callback: () => void) => {
    if (!isAuthenticated) {
      const configs = {
        'addToCart': {
          title: 'Đăng nhập để thêm vào giỏ hàng',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
        },
        'buyNow': {
          title: 'Đăng nhập để mua hàng',
          description: 'Vui lòng đăng nhập để tiếp tục mua hàng'
        },
        'addToFavorites': {
          title: 'Đăng nhập để thêm vào yêu thích',
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích'
        }
      };

      const config = configs[action as keyof typeof configs] || {
        title: 'Đăng nhập để tiếp tục',
        description: 'Vui lòng đăng nhập để sử dụng tính năng này'
      };

      openModal({
        ...config,
        pendingAction: {
          type: action as any,
          callback
        }
      });
      return true; // Indicates auth is required
    }
    return false; // Indicates auth is not required
  };

  const addToCartAction = async (data: CartData) => {
    if (handleAuthRequired('addToCart', () => addToCartAction(data))) {
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
        fetchCart();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const buyNow = async (data: CartData) => {
    if (handleAuthRequired('buyNow', () => buyNow(data))) {
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
    if (handleAuthRequired('addToFavorites', () => toggleFavorite())) {
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
    addToCart: addToCartAction,
    buyNow,
    toggleFavorite,
    loading,
    error
  };
} 