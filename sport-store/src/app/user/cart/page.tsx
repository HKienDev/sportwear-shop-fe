'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cart from '@/components/user/cart/Cart';
import { CartState } from '@/types/cart';
import { cartService } from '@/services/cartService';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalQuantity: 0,
    cartTotal: 0,
    loading: false,
    error: null
  });

  const fetchCart = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      const response = await cartService.getCart();
      if (response.success) {
        setCart({
          ...response.data,
          loading: false,
          error: null
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      if (error instanceof Error && error.message === 'Dữ liệu đã tồn tại') {
        // Nếu lỗi là "Dữ liệu đã tồn tại", không cần hiển thị lỗi
        setCart(prev => ({ ...prev, loading: false }));
      } else {
        setCart(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Không thể lấy thông tin giỏ hàng',
          loading: false 
        }));
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      const item = cart.items.find(item => item._id === itemId);
      if (!item) throw new Error('Không tìm thấy sản phẩm');
      
      const response = await cartService.updateCartItemQuantity({
        sku: item.product.sku,
        color: item.color || '',
        size: item.size || '',
        quantity
      });

      if (response.success) {
        // Cập nhật state trực tiếp thay vì gọi lại fetchCart
        setCart(prev => ({
          ...prev,
          items: prev.items.map(i => 
            i._id === itemId 
              ? { ...i, quantity: quantity }
              : i
          ),
          loading: false
        }));
        toast.success('Đã cập nhật số lượng sản phẩm');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      setCart(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Không thể cập nhật số lượng',
        loading: false 
      }));
      toast.error('Không thể cập nhật số lượng sản phẩm');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      const item = cart.items.find(item => item._id === itemId);
      if (!item) throw new Error('Không tìm thấy sản phẩm');

      const response = await cartService.removeFromCart({
        sku: item.product.sku,
        color: item.color,
        size: item.size
      });

      if (response.success) {
        // Cập nhật state trực tiếp thay vì gọi lại fetchCart
        setCart(prev => ({
          ...prev,
          items: prev.items.filter(i => i._id !== itemId),
          loading: false
        }));
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      setCart(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Không thể xóa sản phẩm',
        loading: false 
      }));
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    router.push('/user/checkout');
  };

  return (
    <Cart
      cart={cart}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  );
}