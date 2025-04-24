import { API_URL as CONFIG_API_URL } from '@/config/api';

// Sử dụng API_URL từ config
const API_URL = CONFIG_API_URL;

/**
 * Xóa một sản phẩm theo ID
 * @param productId ID của sản phẩm cần xóa
 * @returns Promise với kết quả xóa sản phẩm
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    // Emit sự kiện xóa sản phẩm
    window.dispatchEvent(new Event('productDeleted'));
    
    return;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Xóa nhiều sản phẩm cùng lúc
 * @param productIds Mảng các ID sản phẩm cần xóa
 * @returns Promise với kết quả xóa sản phẩm
 */
export const bulkDeleteProducts = async (productIds: string[]): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/bulk-delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ productIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete products');
    }

    // Emit sự kiện xóa sản phẩm
    window.dispatchEvent(new Event('productDeleted'));
    
    return;
  } catch (error) {
    console.error('Error deleting products:', error);
    throw error;
  }
}; 