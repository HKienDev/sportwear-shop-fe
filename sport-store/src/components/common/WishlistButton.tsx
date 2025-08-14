'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/authContext';
import { useAuthModal } from '@/context/authModalContext';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showText?: boolean;
}

export function WishlistButton({ 
  productId, 
  size = 'md', 
  variant = 'default',
  className = '',
  showText = false 
}: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isToggling, setIsToggling] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openModal({
        title: 'Đăng nhập để thêm vào yêu thích',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích',
        pendingAction: {
          type: 'addToWishlist',
          data: { productId },
          callback: () => handleToggle(e)
        }
      });
      return;
    }

    setIsToggling(true);
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 WishlistButton - 401 error in handleToggle');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể thao tác với danh sách yêu thích';
        toast.error(errorMessage);
      }
    } finally {
      setIsToggling(false);
    }
  };

  const isWishlisted = isInWishlist(productId);

  const baseClasses = `rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${sizeClasses[size]} ${className}`;
  
  const variantClasses = {
    default: isWishlisted 
      ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
      : 'bg-white/95 backdrop-blur-sm text-gray-700 border-white/50 hover:border-white/80',
    outline: isWishlisted
      ? 'bg-red-500 text-white border-2 border-red-500 hover:bg-red-600'
      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500 hover:text-red-500',
    ghost: isWishlisted
      ? 'bg-red-100 text-red-600 hover:bg-red-200'
      : 'bg-transparent text-gray-600 hover:text-red-500 hover:bg-red-50'
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
    >
      {isToggling ? (
        <div className={`${iconSizes[size]} animate-spin border-2 border-current border-t-transparent rounded-full`} />
      ) : (
        <div className="flex items-center gap-1">
          <Heart className={`${iconSizes[size]} ${isWishlisted ? 'fill-current' : ''}`} />
          {showText && (
            <span className="text-xs font-medium">
              {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
