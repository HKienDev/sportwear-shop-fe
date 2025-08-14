'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { Badge } from '@/components/ui/badge';

interface WishlistCounterProps {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  variant?: 'default' | 'minimal';
}

export function WishlistCounter({ 
  className = '', 
  showIcon = true, 
  showText = false,
  variant = 'default'
}: WishlistCounterProps) {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showIcon && <Heart className="w-4 h-4 animate-pulse" />}
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const count = wishlist.length;

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showIcon && <Heart className="w-4 h-4 text-gray-600" />}
        <span className="text-sm font-medium text-gray-700">
          {count}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <div className="relative">
          <Heart className="w-5 h-5 text-red-500" />
          {count > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </div>
      )}
      {showText && (
        <span className="text-sm font-medium text-gray-700">
          {count === 0 ? 'Chưa có sản phẩm yêu thích' : `${count} sản phẩm yêu thích`}
        </span>
      )}
    </div>
  );
}
