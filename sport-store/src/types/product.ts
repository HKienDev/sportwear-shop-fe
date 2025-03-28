export interface Product {
  _id?: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  isActive: boolean;
  images: {
    main: string;
    sub: string[];
  };
  color: string[];
  size: string[];
  sku: string;
  tags: string[];
  ratings?: {
    average: number;
    count: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData extends Omit<Product, 'images'> {
  mainImage: string;
  additionalImages: string[];
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
} 