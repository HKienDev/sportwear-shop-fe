'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cart from '@/components/user/cart/Cart';
import { useCartOptimized } from '@/hooks/useCartOptimized';
import { useSelectedItems } from '@/hooks/useSelectedItems';
import { validateCartData } from '@/utils/cartUtils';
import { validateSelectedItems } from '@/utils/checkoutUtils';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const {
    selectedItems,
    toggleSelect,
    toggleSelectAll,
    removeItem: removeSelectedItem,
    clearSelection
  } = useSelectedItems();
  
  const {
    cart,
    loading,
    error,
    cartTotals,
    fetchCart,
    updateCartItem,
    removeFromCart,
    removeItemsBatch,
    isEmpty,
  } = useCartOptimized();

  // Force refresh cart khi vào trang
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const item = cart?.items.find(item => item._id === itemId);
      if (!item) return;

      await removeFromCart({
        sku: item.product.sku,
        color: item.color,
        size: item.size,
      });
      
      // Xóa item khỏi selectedItems nếu có
      removeSelectedItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleToggleSelect = (itemId: string) => {
    toggleSelect(itemId);
  };

  const handleSelectAll = () => {
    const itemIds = cart?.items?.map(item => item._id) || [];
    toggleSelectAll(itemIds);
  };

  const handleCheckout = () => {
    // Validate selected items
    const validation = validateSelectedItems(cart?.items || [], selectedItems);
    if (!validation.isValid) {
      toast.error(validation.message || 'Vui lòng chọn sản phẩm để thanh toán');
      return;
    }

    // Kiểm tra xem cart có hợp lệ không
    if (!validateCartData(cart)) {
      return;
    }

    // Lọc ra các sản phẩm được chọn
    const selectedCartItems = cart?.items?.filter(item => selectedItems.includes(item._id)) || [];
    
    if (selectedCartItems.length === 0) {
      toast.error('Không tìm thấy sản phẩm đã chọn');
      return;
    }

    // Lưu selectedItems vào localStorage để checkout page có thể sử dụng
    localStorage.setItem('checkout_selected_items', JSON.stringify(selectedItems));
    
    toast.success(`Đang chuyển đến trang thanh toán với ${selectedCartItems.length} sản phẩm`);
    router.push('/user/checkout');
  };

  // Transform cart data to match CartState interface
  const cartState = {
    items: cart?.items || [],
    totalQuantity: cartTotals?.totalQuantity || 0,
    cartTotal: cartTotals?.totalPrice || 0,
    loading,
    error,
  };

  return (
    <Cart
      cart={cartState}
      selectedItems={selectedItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onToggleSelect={handleToggleSelect}
      onSelectAll={handleSelectAll}
      onCheckout={handleCheckout}
    />
  );
}