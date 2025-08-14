'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart, Eye, Star, Clock, TrendingUp } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/authContext';
import { useCartOptimized } from '@/hooks/useCartOptimized';
import { toast } from 'sonner';
import { UserProduct } from '@/types/product';

// Shadcn UI Components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface WishlistItem {
  _id: string;
  product: UserProduct;
  addedAt: string;
}

const WishlistPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartOptimized();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set());

  // Redirect nếu chưa đăng nhập
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromWishlist(productId);
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 WishlistPage - 401 error in handleRemoveFromWishlist');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể xóa sản phẩm khỏi danh sách yêu thích';
        toast.error(errorMessage);
      }
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (product: UserProduct) => {
    setAddingToCart(prev => new Set(prev).add(product._id));
    try {
      await addToCart({
        sku: product.sku,
        color: product.colors?.[0] || 'Mặc định',
        size: product.sizes?.[0] || 'Mặc định',
        quantity: 1
      });
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 WishlistPage - 401 error in handleAddToCart');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể thêm vào giỏ hàng';
        toast.error(errorMessage);
      }
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  const handleViewProduct = (product: UserProduct) => {
    router.push(`/user/products/details/${product.sku}`);
  };

  const calculateDiscountPercentage = (originalPrice: number, salePrice: number) => {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/user" className="text-purple-600 hover:text-purple-800">
                      Trang chủ
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-600">
                    Danh sách yêu thích
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Danh sách yêu thích trống</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá các sản phẩm và thêm vào yêu thích!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/user/products">
                  Khám phá sản phẩm
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/user">
                  Về trang chủ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/user" className="text-purple-600 hover:text-purple-800">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-600">
                  Danh sách yêu thích
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Danh sách yêu thích</h1>
              <p className="text-gray-600">
                {wishlist.length} sản phẩm trong danh sách yêu thích của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.product;
            const discountPercentage = calculateDiscountPercentage(product.originalPrice, product.salePrice);
            const isRemoving = removingItems.has(product._id);
            const isAddingToCart = addingToCart.has(product._id);

            return (
              <div key={item._id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.mainImage || '/default-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-8 h-8 p-0"
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <Clock className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating || 0}</span>
                      <span className="text-sm text-gray-500">({product.numReviews || 0})</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(product.salePrice)}
                      </span>
                      {product.originalPrice > product.salePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleAddToCart(product)}
                      disabled={isAddingToCart || product.stock === 0}
                    >
                      {isAddingToCart ? (
                        <Clock className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      )}
                      {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </Button>
                  </div>

                  {/* Added Date */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Đã thêm: {formatDate(item.addedAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tổng cộng: {wishlist.length} sản phẩm
              </h3>
              <p className="text-gray-600">
                Tổng giá trị: {formatPrice(wishlist.reduce((sum, item) => sum + item.product.salePrice, 0))}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/user/products">
                  Tiếp tục mua sắm
                </Link>
              </Button>
              <Button asChild>
                <Link href="/user/cart">
                  Xem giỏ hàng
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
