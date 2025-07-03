import React, { useState } from 'react';
import { ShoppingCart, Heart } from "lucide-react";
import { UserProduct } from "@/types/product";
import { formatCurrency, calculateDiscountPercentage, getCategoryDisplay, getBrandDisplay } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/authContext';
import { useProductActions } from '@/hooks/useProductActions';

interface ProductInfoProps {
  product: UserProduct;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, buyNow, toggleFavorite, loading } = useProductActions();

  const discountPercentage = calculateDiscountPercentage(product.originalPrice, product.salePrice);
  const categoryDisplay = getCategoryDisplay(product.categoryId);
  const brandDisplay = getBrandDisplay(product.brand);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size: string): void => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Vui lòng chọn màu sắc và kích thước");
      return;
    }

    const cartData = {
      sku: product.sku,
      color: selectedColor,
      size: selectedSize,
      quantity
    };

    const result = await addToCart(cartData);
    if (result.success) {
      // Có thể thêm animation hoặc feedback khác ở đây
    }
  };

  const handleBuyNow = async () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Vui lòng chọn màu sắc và kích thước");
      return;
    }

    const cartData = {
      sku: product.sku,
      color: selectedColor,
      size: selectedSize,
      quantity
    };

    await buyNow(cartData);
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite();
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          {categoryDisplay}
        </span>
      </div>

      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

      {/* Brand */}
      <div>
        <p className="text-gray-600">Thương hiệu: {brandDisplay}</p>
      </div>

      {/* Price */}
      <div className="space-y-2">
        {product.salePrice > 0 ? (
          <>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(product.salePrice)}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
              <span className="text-red-500 font-medium">
                -{discountPercentage}%
              </span>
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(product.originalPrice)}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Mô tả sản phẩm</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Màu sắc</h2>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color: string) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`px-4 py-2 border rounded-full transition-colors
                  ${selectedColor === color 
                    ? 'border-red-600 bg-red-50 text-red-600' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-900'
                  }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Kích thước</h2>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className={`px-4 py-2 border rounded-full transition-colors
                  ${selectedSize === size 
                    ? 'border-red-600 bg-red-50 text-red-600' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-900'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Tình trạng</h2>
        <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
          {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
        </p>
      </div>

      {/* Quantity Selector - Only show if authenticated */}
      {isAuthenticated && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Số lượng</h2>
          <div className="flex items-center space-x-2">
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded p-2"
              disabled={loading}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 pt-4">
        {isAuthenticated ? (
          <>
            <button
              className={`flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2
                ${(!selectedSize || !selectedColor || product.stock === 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedSize || !selectedColor || product.stock === 0 || loading}
              onClick={handleBuyNow}
            >
              {loading ? (
                <span className="animate-spin mr-2">⌛</span>
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              {product.stock === 0 ? 'Hết hàng' : 'Mua Ngay'}
            </button>
            <button 
              className={`flex-1 py-3 px-6 border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors flex items-center justify-center gap-2
                ${(!selectedSize || !selectedColor || product.stock === 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedSize || !selectedColor || product.stock === 0 || loading}
              onClick={handleAddToCart}
            >
              {loading ? (
                <span className="animate-spin mr-2">⌛</span>
              ) : (
                <Heart className="h-5 w-5 mr-2" />
              )}
              {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </button>
            <button
              className={`p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleToggleFavorite}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <Heart className="h-6 w-6" />
              )}
            </button>
          </>
        ) : (
          <div className="text-center w-full">
            <p className="text-gray-600 mb-2">Để mua hàng hoặc thêm vào yêu thích, vui lòng đăng nhập</p>
            <button
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
              onClick={() => router.push('/auth/login')}
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>Đã bán: {product.soldCount || 0}</p>
        <p>Lượt xem: {product.viewCount || 0}</p>
        <p>Tồn kho: {product.stock}</p>
      </div>
    </div>
  );
}; 