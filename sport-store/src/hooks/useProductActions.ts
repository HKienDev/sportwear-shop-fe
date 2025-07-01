import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/authContext';
import apiClient from '@/lib/api';

interface CartData {
  sku: string;
  color: string;
  size: string;
  quantity: number;
}

export const useProductActions = (productId: string) => {
  const router = useRouter();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (data: CartData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Kiểm tra và refresh token nếu cần
      await checkAuthStatus();
      
      const response = await apiClient.cart.addToCart(data);
      
      if (response.data.success) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const buyNow = async (data: CartData) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng');
      router.push('/auth/login');
      return { success: false, message: 'Vui lòng đăng nhập' };
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.cart.addToCart(data);
      
      if (response.data.success) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        router.push('/user/cart');
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Error buying now:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      router.push('/auth/login');
      return { success: false, message: 'Vui lòng đăng nhập' };
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
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
      setIsLoading(false);
    }
  };

  return {
    addToCart,
    buyNow,
    toggleFavorite,
    isLoading,
    error
  };
}; 