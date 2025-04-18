"use client";

import { useEffect, useState, use } from 'react';
import { toast } from 'react-hot-toast';
import type { Product } from '@/types/product';
import { ProductInfo } from '@/components/user/products/productInfor/ProductInfo';
import { ProductImages } from '@/components/user/products/productImages/ProductImages';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetails({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${resolvedParams.id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Bạn cần đăng nhập để xem sản phẩm này');
            return;
          }
          if (response.status === 404) {
            toast.error('Không tìm thấy sản phẩm');
            return;
          }
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        if (!data.data) {
          throw new Error('Invalid response format');
        }
        setProduct(data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Có lỗi xảy ra khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImages 
          mainImage={product.mainImage} 
          subImages={product.subImages || []} 
          productName={product.name}
        />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}