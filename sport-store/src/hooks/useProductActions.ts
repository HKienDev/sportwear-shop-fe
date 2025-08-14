import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { useAuthModal } from '@/context/authModalContext';
import { useCartOptimized } from './useCartOptimized';
import { useWishlist } from './useWishlist';
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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
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
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 useProductActions - 401 error in addToCartAction');
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
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
    } catch (error: any) {
      console.error('Error buying now:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 useProductActions - 401 error in buyNow');
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!productId) {
      toast.error('Không tìm thấy sản phẩm');
      return { success: false, message: 'Không tìm thấy sản phẩm' };
    }

    try {
      setLoading(true);
      setError(null);

      if (isInWishlist(productId)) {
        // Nếu đã có trong wishlist thì xóa
        const success = await removeFromWishlist(productId);
        return { success, message: success ? 'Đã xóa khỏi danh sách yêu thích' : 'Không thể xóa khỏi danh sách yêu thích' };
      } else {
        // Nếu chưa có thì thêm vào
        const success = await addToWishlist(productId);
        return { success, message: success ? 'Đã thêm vào danh sách yêu thích' : 'Không thể thêm vào danh sách yêu thích' };
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 useProductActions - 401 error in toggleFavorite');
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể thao tác với danh sách yêu thích';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
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