'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

import { ERROR_MESSAGES } from '@/config/constants';
import type { CartItem } from '@/types/cart';
import Image from 'next/image';
import { useCartOptimized } from '@/hooks/useCartOptimized';

interface OrderItemsProps {
  cartItems: CartItem[];
  loading?: boolean;
  onTotalChange?: (total: number) => void;
}

export default function OrderItems({ cartItems, loading = false, onTotalChange }: OrderItemsProps) {
  const [updating, setUpdating] = useState(false);
  const prevTotalRef = useRef<number>(0);

  // Sử dụng Zustand store actions
  const { updateCartItem, removeFromCart } = useCartOptimized();

  // Memoize the onTotalChange callback to prevent infinite loops
  const memoizedOnTotalChange = useCallback((total: number) => {
    if (onTotalChange) {
      onTotalChange(total);
    }
  }, [onTotalChange]);

  // Tính tổng tiền và cập nhật cho parent component
  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Cập nhật tổng tiền khi cartItems thay đổi, chỉ khi total thực sự thay đổi
  useEffect(() => {
    if (total !== prevTotalRef.current) {
      prevTotalRef.current = total;
      memoizedOnTotalChange(total);
    }
  }, [total, memoizedOnTotalChange]);

  // Update item quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setUpdating(true);
      const item = cartItems.find(i => i._id === itemId);
      if (!item) throw new Error('Không tìm thấy sản phẩm');
      
      // Sử dụng store action thay vì direct API call
      await updateCartItem(itemId, newQuantity);
      
      toast.success('Giỏ hàng đã được cập nhật');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      toast.error(errorMessage);
      console.error('Update quantity error:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      setUpdating(true);
      const item = cartItems.find(i => i._id === itemId);
      if (!item) throw new Error('Không tìm thấy sản phẩm');
      
      // Sử dụng store action thay vì direct API call
      await removeFromCart({
        sku: item.product.sku,
        color: item.color,
        size: item.size
      });
      
      toast.success('Sản phẩm đã được xóa khỏi giỏ hàng');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      toast.error(errorMessage);
      console.error('Remove item error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="text-center">Đang tải giỏ hàng...</div>
        </CardContent>
      </Card>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="text-center text-gray-500">Giỏ hàng trống</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Sản phẩm đặt hàng</h3>
        
        <div className="space-y-3 md:space-y-4">
          {cartItems.map((item, index) => (
            <div key={item._id || `${item.product.sku}-${item.color}-${item.size}-${index}`} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 border rounded-lg gap-3 md:gap-4">
              <div className="flex items-center space-x-3 md:space-x-4 w-full md:w-auto">
                <Image
                  src={item.product.mainImage}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm md:text-base text-gray-900 truncate">{item.product.name}</h4>
                  <p className="text-xs md:text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-xs md:text-sm text-gray-500">Màu: {item.color}</p>
                  <p className="font-medium text-primary text-sm md:text-base mt-1">
                    {item.totalPrice.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={updating}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={updating}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item._id)}
                  disabled={updating}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <span className="text-base md:text-lg font-semibold">Tổng cộng:</span>
          <span className="text-lg md:text-xl font-bold text-primary">
            {total.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 