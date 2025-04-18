import { Product, ProductQueryParams, SingleProductResponse, ProductsResponse } from "@/types/product";

const API_URL = "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ProductsApiResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ProductService {
  async getAllProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
    try {
      const queryString = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryString.append(key, value.toString());
          }
        });
      }

      const url = `${API_URL}/products${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      console.log("API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductBySku(sku: string): Promise<SingleProductResponse> {
    try {
      const url = `${API_URL}/products/${sku}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product by SKU:", error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string, params?: ProductQueryParams): Promise<ProductsResponse> {
    try {
      const queryString = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryString.append(key, value.toString());
          }
        });
      }

      const url = `${API_URL}/products/category/${categoryId}${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  }

  async searchProducts(keyword: string, params?: ProductQueryParams): Promise<ProductsResponse> {
    try {
      const queryString = new URLSearchParams({ keyword });
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryString.append(key, value.toString());
          }
        });
      }

      const url = `${API_URL}/products/search${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<SingleProductResponse> {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<SingleProductResponse> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<SingleProductResponse> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  async updateProductStatus(id: string, isActive: boolean): Promise<SingleProductResponse> {
    try {
      const response = await fetch(`${API_URL}/products/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
  }

  async updateSizeStatus(id: string, size: string, isActive: boolean): Promise<SingleProductResponse> {
    try {
      const response = await fetch(`${API_URL}/products/${id}/size-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ size, isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating size status:", error);
      throw error;
    }
  }

  async getAdminProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
    try {
      const queryString = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryString.append(key, value.toString());
          }
        });
      }

      const url = `${API_URL}/admin/products${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching admin products:", error);
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService; 