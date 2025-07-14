"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit2, Clock, Image, Loader2, AlertCircle, Package, Settings, Palette, Ruler } from "lucide-react";
import { AdminProduct } from "@/types/product";
import { fetchApi } from "@/utils/api";
import ProductInfo from "@/components/admin/products/details/ProductInfo";
import ProductImages from "@/components/admin/products/details/ProductImages";
import { toast } from "sonner";
import { TOKEN_CONFIG } from '@/config/token';
import { useAuth } from "@/context/authContext";

const colorNames: Record<string, string> = {
  '#ff0000': 'Đỏ',
  '#00ff00': 'Xanh lá',
  '#0000ff': 'Xanh dương',
  '#ffff00': 'Vàng',
  '#ff00ff': 'Hồng',
  '#00ffff': 'Xanh ngọc',
  '#000000': 'Đen',
  '#ffffff': 'Trắng',
  '#808080': 'Xám',
  '#a52a2a': 'Nâu',
  '#ffa500': 'Cam',
  '#800080': 'Tím'
};

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const sku = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy token từ localStorage
        const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        
        // Kiểm tra token có tồn tại không
        if (!token) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          router.push('/auth/login');
          return;
        }

        const response = await fetchApi(`/products/sku/${sku}`);

        if (!response.success) {
          throw new Error(response.message || 'Không thể tải thông tin sản phẩm');
        }

        setProduct(response.data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku, router]);

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-20"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-slate-700">Đang tải thông tin sản phẩm...</h3>
                <p className="text-sm text-slate-500">Vui lòng chờ trong giây lát</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-red-600">Không thể tải sản phẩm</h3>
                <p className="text-sm text-slate-600 max-w-md">{error || 'Không tìm thấy sản phẩm'}</p>
                <button
                  onClick={() => router.push('/admin/products/list')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Chi Tiết Sản Phẩm
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Quản lý và xem thông tin chi tiết sản phẩm
              </p>
            </div>
          </div>

          {/* Product Header Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">
                    {product.name || 'Chi tiết sản phẩm'}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                    <span className="text-sm text-slate-500">SKU: {product.sku || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4 mr-2" />
                  Cập nhật: {new Date(product.updatedAt || Date.now()).toLocaleDateString('vi-VN')}
                </div>
                <button
                  onClick={() => router.push(`/admin/products/edit?sku=${product.sku}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 border-2 border-blue-600 hover:border-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Chỉnh sửa</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Images */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-300">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Image className="w-5 h-5 text-indigo-500" aria-label="icon hình ảnh sản phẩm" role="img" />
                    Hình ảnh sản phẩm
                  </h2>
                </div>
                <div className="p-6">
                  <ProductImages product={product} />
                </div>
              </div>
              
              {/* Variants Section */}
              <div className="mt-6 bg-white rounded-2xl border-2 border-slate-300 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-500" />
                    Kích thước và màu sắc
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Colors Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                        <Palette className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-slate-800">Màu sắc có sẵn</h5>
                        <p className="text-sm text-slate-600">Danh sách các màu sắc của sản phẩm</p>
                      </div>
                    </div>
                    
                    {product.colors.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {product.colors.map((color, index) => (
                          <div 
                            key={index}
                            className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-300 rounded-xl p-4 text-center hover:border-slate-400 hover:scale-105 transition-all duration-300"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {colorNames[color] || color}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-full">
                          <Palette className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-amber-800 mb-1">Không có màu sắc</h5>
                          <p className="text-amber-700 text-sm">Sản phẩm này chưa có thông tin màu sắc</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sizes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                        <Ruler className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-slate-800">Kích thước có sẵn</h5>
                        <p className="text-sm text-slate-600">Danh sách các kích thước của sản phẩm</p>
                      </div>
                    </div>
                    
                    {product.sizes.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {product.sizes.map((size, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center hover:border-blue-400 hover:scale-105 transition-all duration-300"
                          >
                            <span className="text-sm font-semibold text-slate-700">{size}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-full">
                          <Ruler className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-amber-800 mb-1">Không có kích thước</h5>
                          <p className="text-amber-700 text-sm">Sản phẩm này chưa có thông tin kích thước</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="lg:col-span-2">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-10 shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/admin/products/list')}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <button
            onClick={() => router.push(`/admin/products/edit?sku=${product.sku}`)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center gap-2 text-sm shadow-lg"
          >
            <Edit2 className="w-4 h-4" />
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
}