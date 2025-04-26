import apiClient from '@/lib/api';

export const addToCart = async (cartData: {
  sku: string;
  color: string;
  size: string;
  quantity: number;
}) => {
  try {
    const response = await apiClient.cart.addToCart(cartData);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}; 