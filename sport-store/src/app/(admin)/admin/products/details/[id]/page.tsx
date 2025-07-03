"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit2, Clock, Image } from "lucide-react";
import { AdminProduct } from "@/types/product";
import { fetchApi } from "@/utils/api";
import ProductInfo from "@/components/admin/products/details/ProductInfo";
import ProductImages from "@/components/admin/products/details/ProductImages";
import ProductVariants from "@/components/admin/products/details/ProductVariants";
import { toast } from "sonner";
import { TOKEN_CONFIG } from '@/config/token';
import { useAuth } from "@/context/authContext";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const sku = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [activeTab, setActiveTab] = useState("details");
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 right-0 h-16 w-16 rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute top-0 right-0 h-16 w-16 rounded-full border-4 border-t-transparent border-r-transparent border-b-emerald-300 border-l-transparent animate-spin animate-delay-500"></div>
              </div>
              <p className="mt-6 text-gray-600 font-medium">Đang tải thông tin sản phẩm...</p>
              <p className="text-gray-400 text-sm mt-2">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải sản phẩm</h2>
            <p className="text-red-500 mb-6 text-center">{error || 'Không tìm thấy sản phẩm'}</p>
            <button
              onClick={() => router.push('/admin/products/list')}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200 mb-6 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/admin/dashboard')}>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/admin/products/list')}>Sản phẩm</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Chi tiết</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/products/list')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Quay lại"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                {product.name || 'Chi tiết sản phẩm'}
              </h1>
              <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {product.status || 'Active'}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden md:inline-flex items-center gap-1">
                <Clock className="w-4 h-4" /> Cập nhật: {new Date(product.updatedAt || Date.now()).toLocaleDateString('vi-VN')}
              </span>
              <button
                onClick={() => router.push(`/admin/products/edit?sku=${product.sku}`)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 shadow-sm font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            <button
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "details" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Thông tin sản phẩm
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "variants" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("variants")}
            >
              Kích thước và màu sắc
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Images */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image size={20} className="text-indigo-500" />
                    Hình ảnh sản phẩm
                  </h2>
                </div>
                <div className="p-5">
                  <ProductImages product={product} />
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <ProductInfo product={product} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "variants" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Kính thước và màu sắc</h2>
            <ProductVariants product={product} />
          </div>
        )}
      </div>

      {/* Responsive Footer Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/admin/products/list')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <button
            onClick={() => router.push(`/admin/products/edit?sku=${product.sku}`)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium flex items-center gap-1 text-sm shadow-sm"
          >
            <Edit2 className="w-4 h-4" /> Sửa
          </button>
        </div>
      </div>
    </div>
  );
}