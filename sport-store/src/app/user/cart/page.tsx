'use client';

import { useState } from 'react';
import Cart from '@/components/user/cart/Cart';
import { CartState } from '@/types/cart';

export default function CartPage() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    loading: false,
    error: null
  });

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      // Phiên bản đơn giản: Cập nhật số lượng trong state
      const updatedItems = cart.items.map(item => {
        if (item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      // Tính tổng tiền
      const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      
      // Cập nhật state
      setCart({
        items: updatedItems,
        total,
        loading: false,
        error: null
      });
      
      // TODO: Gọi API để cập nhật số lượng
      // const response = await fetch(`/api/cart/${productId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ quantity })
      // });
      // const updatedCart = await response.json();
      // setCart(updatedCart);
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      setCart(prev => ({ ...prev, error: 'Không thể cập nhật số lượng' }));
    } finally {
      setCart(prev => ({ ...prev, loading: false }));
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      // Phiên bản đơn giản: Xóa sản phẩm khỏi state
      const updatedItems = cart.items.filter(item => item.product._id !== productId);
      
      // Tính tổng tiền
      const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      
      // Cập nhật state
      setCart({
        items: updatedItems,
        total,
        loading: false,
        error: null
      });
      
      // TODO: Gọi API để xóa sản phẩm
      // const response = await fetch(`/api/cart/${productId}`, {
      //   method: 'DELETE'
      // });
      // const updatedCart = await response.json();
      // setCart(updatedCart);
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      setCart(prev => ({ ...prev, error: 'Không thể xóa sản phẩm' }));
    } finally {
      setCart(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCheckout = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      
      // TODO: Chuyển hướng đến trang thanh toán
      // router.push('/checkout');
      
      // Giả lập xử lý thanh toán
      console.log('Đang xử lý thanh toán...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Xóa giỏ hàng sau khi thanh toán thành công
      setCart({
        items: [],
        total: 0,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      setCart(prev => ({ ...prev, error: 'Không thể tiến hành thanh toán' }));
    } finally {
      setCart(prev => ({ ...prev, loading: false }));
    }
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