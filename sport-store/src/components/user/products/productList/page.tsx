"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from '../productCard/page';
import { Product } from '@/types/product';
import productService from '@/services/productService';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        if (response.success && response.data.products) {
          setProducts(response.data.products);
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList; 