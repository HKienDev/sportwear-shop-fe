export interface Brand {
  _id?: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  productsCount: number;
  features: string[];
  isPremium: boolean;
  isTrending: boolean;
  isNew: boolean;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandFormData {
  name: string;
  logo: string;
  description: string;
  rating: number;
  productsCount: number;
  features: string[];
  isPremium: boolean;
  isTrending: boolean;
  isNew: boolean;
  featured: boolean;
  status: 'active' | 'inactive';
}

export interface BrandFilters {
  search?: string;
  status?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 