import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { useAuthModal } from '@/context/authModalContext';
import { toast } from 'sonner';
import { UserProduct } from '@/types/product';
import { apiClient } from '@/lib/apiClient';
import { TOKEN_CONFIG } from '@/config/token';
import { WishlistResponse, WishlistActionResponse } from '@/services/wishlistService';

interface WishlistItem {
  _id: string;
  product: UserProduct;
  addedAt: string;
}

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  fetchWishlist: () => Promise<void>;
  clearWishlist: () => void;
}

export function useWishlist(): UseWishlistReturn {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const { openModal } = useAuthModal();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra sản phẩm có trong wishlist không
  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.some(item => item.product._id === productId);
  }, [wishlist]);

  // Lấy danh sách wishlist từ server
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) {
        console.log('🔍 useWishlist - No token found, checking auth status...');
        await checkAuthStatus();
        return;
      }

      const response = await apiClient.get('/api/favorites');
      const data = response.data as WishlistResponse;
      
      if (data.success) {
        setWishlist(data.data?.favorites || []);
      } else {
        throw new Error(data.message || 'Không thể lấy danh sách yêu thích');
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 useWishlist - 401 error, checking auth status...');
        await checkAuthStatus();
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(error instanceof Error ? error.message : 'Không thể lấy danh sách yêu thích');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, checkAuthStatus]);

  // Thêm sản phẩm vào wishlist
  const addToWishlist = useCallback(async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      openModal({
        title: 'Đăng nhập để thêm vào yêu thích',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích',
        pendingAction: {
          type: 'addToWishlist',
          data: { productId },
          callback: () => addToWishlist(productId)
        }
      });
      return false;
    }

    if (isInWishlist(productId)) {
      toast.info('Sản phẩm đã có trong danh sách yêu thích');
      return true;
    }

    try {
      setLoading(true);
      setError(null);

      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) {
        console.log('🔍 useWishlist - No token found for addToWishlist, checking auth status...');
        await checkAuthStatus();
        return false;
      }

      const response = await apiClient.post('/api/favorites/add', { productId });
      const data = response.data as WishlistActionResponse;
      
      if (data.success) {
        // Refresh wishlist sau khi thêm
        await fetchWishlist();
        toast.success('Đã thêm vào danh sách yêu thích');
        return true;
      } else {
        throw new Error(data.message || 'Không thể thêm sản phẩm vào danh sách yêu thích');
      }
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 useWishlist - 401 error in addToWishlist, checking auth status...');
        await checkAuthStatus();
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào danh sách yêu thích';
        setError(errorMessage);
        toast.error(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isInWishlist, openModal, fetchWishlist, checkAuthStatus]);

  // Xóa sản phẩm khỏi wishlist
  const removeFromWishlist = useCallback(async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) {
        console.log('🔍 useWishlist - No token found for removeFromWishlist, checking auth status...');
        await checkAuthStatus();
        return false;
      }

      const response = await apiClient.post('/api/favorites/remove', { productId });
      const data = response.data as WishlistActionResponse;
      
      if (data.success) {
        // Cập nhật local state
        setWishlist(prev => prev.filter(item => item.product._id !== productId));
        toast.success('Đã xóa khỏi danh sách yêu thích');
        return true;
      } else {
        throw new Error(data.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích');
      }
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 useWishlist - 401 error in removeFromWishlist, checking auth status...');
        await checkAuthStatus();
        const errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể xóa sản phẩm khỏi danh sách yêu thích';
        setError(errorMessage);
        toast.error(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, checkAuthStatus]);

  // Xóa toàn bộ wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
    setError(null);
  }, []);

  // Tự động fetch wishlist khi user đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      // Thêm delay nhỏ để đảm bảo token đã được cập nhật
      const timer = setTimeout(() => {
        fetchWishlist();
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  return {
    wishlist,
    loading,
    error,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    clearWishlist
  };
}
