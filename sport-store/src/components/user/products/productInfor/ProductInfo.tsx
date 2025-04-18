import React, { useState } from 'react';
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { formatCurrency, calculateDiscountPercentage, getCategoryDisplay, getBrandDisplay } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/authContext';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const discountPercentage = calculateDiscountPercentage(product.originalPrice, product.salePrice);
  const categoryDisplay = getCategoryDisplay(product.category);
  const brandDisplay = getBrandDisplay(product.brand);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      router.push('/auth/login');
      return;
    }

    try {
      setIsAddingToCart(true);
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
      
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      router.push('/auth/login');
      return;
    }

    try {
      setIsTogglingFavorite(true);
      
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể thêm sản phẩm vào danh sách yêu thích');
      }
      
      toast.success('Đã thêm sản phẩm vào danh sách yêu thích');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào danh sách yêu thích');
    } finally {
      setIsTogglingFavorite(false);
    }
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
                className="px-4 py-2 border border-gray-300 rounded-full hover:border-purple-500 hover:text-purple-600"
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
                className="px-4 py-2 border border-gray-300 rounded-full hover:border-purple-500 hover:text-purple-600"
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
              disabled={isAddingToCart}
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
              className={`flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
                product.stock > 0
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={product.stock === 0 || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <span className="animate-spin mr-2">⌛</span>
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
            <button 
              className={`p-3 rounded-full border border-gray-300 hover:bg-gray-100`}
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
            >
              {isTogglingFavorite ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <Heart className={`h-6 w-6`} />
              )}
            </button>
          </>
        ) : (
          <div className="text-center w-full">
            <p className="text-gray-600 mb-2">Để mua hàng hoặc thêm vào yêu thích, vui lòng đăng nhập</p>
            <button
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
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