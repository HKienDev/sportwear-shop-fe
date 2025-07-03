import { ERROR_MESSAGES } from '@/config/constants';
import type { CartItem, Cart } from '@/types/cart';

// Utility function để xử lý lỗi cart
export const handleCartError = (error: unknown, operation: string): string => {
  const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
  console.error(`Cart ${operation} error:`, error);
  return errorMessage;
};

// Utility function để validate cart item
export const validateCartItem = (item: CartItem): boolean => {
  if (!item.product.sku) {
    return false;
  }
  
  if (item.quantity < 1) {
    return false;
  }
  
  if (!item.color || !item.size) {
    return false;
  }
  
  return true;
};

// Utility function để tính tổng giỏ hàng
export const calculateCartTotals = (items: CartItem[]): {
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
  totalPriceAfterDiscount: number;
  discountAmount: number;
} => {
  if (!items || items.length === 0) {
    return {
      totalItems: 0,
      totalQuantity: 0,
      totalPrice: 0,
      totalPriceAfterDiscount: 0,
      discountAmount: 0
    };
  }

  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = items.reduce((sum, item) => {
    const quantity = item.quantity || 0;
    const price = item.product.salePrice ?? item.product.originalPrice;
    return sum + (price * quantity);
  }, 0);

  const totalPriceAfterDiscount = totalPrice; // Có thể thêm logic discount sau
  const discountAmount = totalPrice - totalPriceAfterDiscount;

  return {
    totalItems,
    totalQuantity,
    totalPrice,
    totalPriceAfterDiscount,
    discountAmount
  };
};

// Utility function để format giá tiền
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Utility function để tìm item trong cart
export const findCartItem = (items: CartItem[], sku: string, color: string, size: string): CartItem | undefined => {
  return items.find(item => 
    item.product.sku === sku && 
    item.color === color && 
    item.size === size
  );
};

// Utility function để tạo cart item ID
export const createCartItemId = (sku: string, color: string, size: string): string => {
  return `${sku}-${color}-${size}`;
};

// Utility function để validate cart data
export const validateCartData = (cart: Cart | null): boolean => {
  if (!cart) {
    console.error('Cart data is null or undefined');
    return false;
  }
  
  if (!Array.isArray(cart.items)) {
    console.error('Cart items is not an array:', cart.items);
    return false;
  }
  
  for (const item of cart.items) {
    if (!item._id) {
      console.error('Cart item missing _id:', item);
      return false;
    }

    if (!item.product) {
      console.error('Cart item missing product:', item);
      return false;
    }

    if (!item.product.sku) {
      console.error('Cart item product missing sku:', item);
      return false;
    }

    if (!item.quantity || item.quantity <= 0) {
      console.error('Cart item has invalid quantity:', item);
      return false;
    }
  }
  
  return true;
}; 