import { API_URL } from '@/utils/api';
import { ProductResponse, ProductsResponse } from '@/types/product';

/**
 * Lấy danh sách tất cả sản phẩm
 */
export const getAllProducts = async (page = 1, limit = 10): Promise<ProductsResponse> => {
  try {
    const response = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết sản phẩm theo SKU
 */
export const getProductBySku = async (sku: string): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/products/sku/${sku}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Lấy sản phẩm theo danh mục
 */
export const getProductsByCategory = async (categoryId: string, page = 1, limit = 10): Promise<ProductsResponse> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${categoryId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

/**
 * Xóa một sản phẩm theo SKU
 */
export const deleteProduct = async (sku: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/${sku}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    window.dispatchEvent(new Event('productDeleted'));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Cập nhật sản phẩm
 */
export const updateProduct = async (sku: string, formData: FormData): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/products/${sku}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái sản phẩm
 */
export const updateProductStatus = async (sku: string, status: 'active' | 'inactive'): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/products/${sku}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update product status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái size
 */
export const updateSizeStatus = async (
  sku: string, 
  size: string, 
  status: 'active' | 'inactive'
): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${API_URL}/products/${sku}/size-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ size, status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update size status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating size status:', error);
    throw error;
  }
}; 