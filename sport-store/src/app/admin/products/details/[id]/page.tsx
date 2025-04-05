"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2 } from "lucide-react";
import { Product } from "@/types/product";
import { fetchApi } from "@/utils/api";
import ProductInfo from "@/components/admin/products/details/ProductInfo";
import ProductImages from "@/components/admin/products/details/ProductImages";
import ProductVariants from "@/components/admin/products/details/ProductVariants";
import { toast } from "react-hot-toast";

type PageProps = {
  params: {
    id: string;
  };
};

export default function ProductDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const productId = use(Promise.resolve(params.id));
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching product with ID:', productId);
        const response = await fetchApi(`/products/${productId}`);
        
        console.log('API response:', response);
        
        if (!response.success) {
          // Kiểm tra nếu lỗi là do xác thực
          if (response.message === 'Vui lòng đăng nhập lại' || response.message === 'Unauthorized') {
            toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            router.push('/auth/login');
            return;
          }
          
          throw new Error(response.message || 'Không thể tải thông tin sản phẩm');
        }

        if (!response.data) {
          throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        setProduct(response.data);
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
  }, [productId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Không tìm thấy sản phẩm'}</p>
        <button
          onClick={() => router.push('/admin/products/list')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/products/list')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
        </div>
        <button
          onClick={() => router.push(`/admin/products/edit/${productId}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Edit2 className="w-4 h-4" />
          Chỉnh sửa
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          <ProductImages product={product} />
          <ProductVariants product={product} />
        </div>

        {/* Right column */}
        <div>
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
} 