import { CartItem } from '@/types/cart';

// Lấy selectedItems từ localStorage
export const getSelectedItemsFromStorage = (): string[] => {
  try {
    const saved = localStorage.getItem('checkout_selected_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to parse selected items from storage:', error);
  }
  return [];
};

// Lọc cart items dựa trên selectedItems
export const getSelectedCartItems = (cartItems: CartItem[], selectedItems: string[]): CartItem[] => {
  return cartItems.filter(item => selectedItems.includes(item._id));
};

// Tính tổng giá trị của selected items
export const calculateSelectedItemsTotal = (cartItems: CartItem[], selectedItems: string[]): {
  totalQuantity: number;
  totalPrice: number;
  totalPriceAfterDiscount: number;
  discountAmount: number;
} => {
  const selectedCartItems = getSelectedCartItems(cartItems, selectedItems);
  
  if (selectedCartItems.length === 0) {
    return {
      totalQuantity: 0,
      totalPrice: 0,
      totalPriceAfterDiscount: 0,
      discountAmount: 0
    };
  }

  const totalQuantity = selectedCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = selectedCartItems.reduce((sum, item) => {
    const quantity = item.quantity || 0;
    const price = item.product.salePrice ?? item.product.originalPrice;
    return sum + (price * quantity);
  }, 0);

  const totalPriceAfterDiscount = totalPrice; // Có thể thêm logic discount sau
  const discountAmount = totalPrice - totalPriceAfterDiscount;

  return {
    totalQuantity,
    totalPrice,
    totalPriceAfterDiscount,
    discountAmount
  };
};

// Xóa selectedItems khỏi localStorage sau khi checkout
export const clearSelectedItemsFromStorage = () => {
  localStorage.removeItem('checkout_selected_items');
};

// Validate selected items
export const validateSelectedItems = (cartItems: CartItem[], selectedItems: string[]): {
  isValid: boolean;
  message?: string;
} => {
  if (selectedItems.length === 0) {
    return {
      isValid: false,
      message: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán'
    };
  }

  const selectedCartItems = getSelectedCartItems(cartItems, selectedItems);
  
  if (selectedCartItems.length === 0) {
    return {
      isValid: false,
      message: 'Không tìm thấy sản phẩm đã chọn trong giỏ hàng'
    };
  }

  // Kiểm tra số lượng của từng item
  for (const item of selectedCartItems) {
    if (!item.quantity || item.quantity <= 0) {
      return {
        isValid: false,
        message: `Sản phẩm "${item.product.name}" có số lượng không hợp lệ`
      };
    }
  }

  return { isValid: true };
}; 