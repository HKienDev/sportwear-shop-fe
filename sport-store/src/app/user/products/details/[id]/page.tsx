'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/user/productDetail/Breadcrumb';
import ProductGallery from '@/components/user/productDetail/ProductGallery';
import ProductRating from '@/components/user/productDetail/ProductRating';
import ProductPrice from '@/components/user/productDetail/ProductPrice';
import ColorSelector from '@/components/user/productDetail/ColorSelector';
import SizeSelector from '@/components/user/productDetail/SizeSelector';
import QuantitySelector from '@/components/user/productDetail/QuantitySelector';
import ProductActions from '@/components/user/productDetail/ProductActions';
import ProductBenefits from '@/components/user/productDetail/ProductBenefits';
import ProductDescription from '@/components/user/productDetail/ProductDescription';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  mainImage: string;
  subImages: string[];
  colors: string[];
  sizes: string[];
  sku: string;
  tags: string[];
  rating: number;
  numReviews: number;
  viewCount: number;
  soldCount: number;
  discountPercentage: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export default function ProductDetail() {
  const params = useParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Đang gọi API với ID:', params.id);
        const response = await fetch(`/api/products/${params.id}`);
        
        // Log response để debug
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('Dữ liệu nhận được:', result);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Không có quyền truy cập. Vui lòng đăng nhập để xem thông tin sản phẩm.');
          }
          throw new Error(result.message || 'Không thể tải thông tin sản phẩm');
        }
        
        // Kiểm tra cấu trúc dữ liệu
        if (!result.success || !result.data || !result.data.product) {
          console.error('Cấu trúc dữ liệu không hợp lệ:', result);
          throw new Error('Dữ liệu sản phẩm không hợp lệ');
        }
        
        // Cập nhật state với dữ liệu sản phẩm
        setProduct(result.data.product);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thông tin sản phẩm');
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleSizeSelect = (size: string): void => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number): void => {
    setQuantity(newQuantity);
  };

  const handleBuyNow = () => {
    // Xử lý logic mua ngay
    console.log('Mua ngay', { size: selectedSize, quantity });
  };

  const handleAddToCart = () => {
    // Xử lý logic thêm vào giỏ hàng
    console.log('Thêm vào giỏ', { size: selectedSize, quantity });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-lg text-red-500 mb-4">{error || 'Không tìm thấy sản phẩm'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      <Breadcrumb 
        productName={product.name}
        categoryName="Giày bóng đá"
        categorySlug="giay-bong-da"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery 
          images={[product.mainImage, ...product.subImages]}
          productName={product.name}
          discountPercentage={product.discountPercentage}
        />

        <div>
          <ProductRating rating={product.rating} numReviews={product.numReviews} />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <ProductPrice originalPrice={product.originalPrice} salePrice={product.salePrice} />

          <div className="h-px bg-gray-200 my-6"></div>

          <ColorSelector 
            colors={product.colors} 
          />
          
          <SizeSelector 
            sizes={product.sizes} 
            onSizeSelect={handleSizeSelect} 
          />

          <QuantitySelector 
            initialQuantity={quantity}
            onQuantityChange={handleQuantityChange}
          />

          <ProductActions 
            isSizeSelected={!!selectedSize}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            isOutOfStock={product.isOutOfStock}
          />

          <ProductBenefits />
        </div>
      </div>

      <ProductDescription 
        description={product.description}
      />
    </div>
  );
}