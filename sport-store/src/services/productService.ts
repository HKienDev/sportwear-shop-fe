import { Product, ProductQueryParams, ProductResponse, SingleProductResponse } from "@/types/product";
import { fetchApi } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ProductService {
  async getProductsByCategory(categoryId: string): Promise<ProductResponse> {
    try {
      const response = await fetch(
        `${API_URL}/products?categoryId=${categoryId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  }

  async getAllProducts(params?: ProductQueryParams): Promise<ProductResponse> {
    try {
      const queryString = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryString.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `${API_URL}/products?${queryString.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<SingleProductResponse> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService; 