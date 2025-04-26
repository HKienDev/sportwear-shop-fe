'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
import { checkAuth } from '@/services/authService';
import apiClient from '@/lib/api';

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
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
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
        const response = await fetch(`/api/products/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        // Log response để debug
        console.log('Response status:', response.status);
        
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

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size: string): void => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number): void => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!product || !selectedColor || !selectedSize) {
      toast.error("Vui lòng chọn màu sắc và kích thước");
      return;
    }

    try {
      // Kiểm tra đăng nhập
      const authResponse = await checkAuth();
      if (!authResponse.success || !authResponse.data?.user) {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
        router.push('/auth/login');
        return;
      }

      // Thêm vào giỏ hàng
      const response = await apiClient.cart.addToCart({
        sku: product.sku,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      });
      
      if (response.data.success) {
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        toast.error(response.data.message || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      // Kiểm tra nếu lỗi là do token không hợp lệ
      if (error instanceof Error && error.message.includes("No token found")) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        router.push('/auth/login');
        return;
      }
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedColor || !selectedSize) {
      toast.error("Vui lòng chọn màu sắc và kích thước");
      return;
    }

    try {
      // Kiểm tra đăng nhập
      const authResponse = await checkAuth();
      if (!authResponse.success || !authResponse.data?.user) {
        toast.error("Vui lòng đăng nhập để mua hàng");
        router.push('/auth/login');
        return;
      }

      // Thêm vào giỏ hàng
      const response = await apiClient.cart.addToCart({
        sku: product.sku,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      });
      
      if (response.data.success) {
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        // Chuyển hướng đến trang giỏ hàng
        router.push('/user/cart');
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      // Kiểm tra nếu lỗi là do token không hợp lệ
      if (error instanceof Error && error.message.includes("No token found")) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        router.push('/auth/login');
        return;
      }
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
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
            onColorSelect={handleColorSelect}
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
            isSizeSelected={!!selectedSize && !!selectedColor}
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