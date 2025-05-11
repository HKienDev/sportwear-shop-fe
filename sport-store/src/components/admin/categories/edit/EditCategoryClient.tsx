"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Category } from "@/types/category";
import CategoryForm from "./CategoryForm";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCategoryClient({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchWithAuth<Category>(`/categories/${categoryId}`);
        
        if (response.success && response.data) {
          setCategory(response.data);
        } else {
          setError(response.message || "Không thể tải thông tin danh mục");
          toast.error(response.message || "Không thể tải thông tin danh mục");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải thông tin danh mục";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSave = async (formData: Partial<Category>) => {
    if (!category) return;
    
    try {
      setSaving(true);
      const response = await fetchWithAuth<Category>(`/categories/${category.categoryId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        toast.success("Cập nhật danh mục thành công");
        router.push("/admin/categories/list");
      } else {
        toast.error(response.message || "Không thể cập nhật danh mục");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật danh mục";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/categories/list");
  };

  if (loading) {
    return (
      <div className="relative min-h-[500px] perspective-1000">
        {/* 3D Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-3xl transform-gpu rotate-x-6 rotate-y-6 scale-105 -z-10"></div>
        
        {/* Neumorphic container */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="relative">
                <Skeleton className="h-10 w-72 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
              </div>
              <div className="relative">
                <Skeleton className="h-5 w-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="relative">
                  <Skeleton className="h-14 w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
                <div className="relative">
                  <Skeleton className="h-40 w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="relative">
                <Skeleton className="h-80 w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-[400px] perspective-1000">
        {/* 3D Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-pink-50 to-red-50 rounded-3xl transform-gpu rotate-x-6 rotate-y-6 scale-105 -z-10"></div>
        
        {/* Neumorphic container */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-[20px_20px_60px_#f8d7da,-20px_-20px_60px_#ffffff]">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-red-300 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-10 h-10 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                Không thể tải thông tin danh mục
              </h2>
              <p className="text-red-700 max-w-md leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => router.push("/admin/categories/list")}
              className="relative px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 active:scale-95"
            >
              <span className="relative z-10">Quay lại danh sách</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="relative min-h-[400px] perspective-1000">
        {/* 3D Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 rounded-3xl transform-gpu rotate-x-6 rotate-y-6 scale-105 -z-10"></div>
        
        {/* Neumorphic container */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-[20px_20px_60px_#fff3cd,-20px_-20px_60px_#ffffff]">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-10 h-10 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">
                Không tìm thấy danh mục
              </h2>
              <p className="text-amber-700 max-w-md leading-relaxed">
                Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/categories/list")}
              className="relative px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95"
            >
              <span className="relative z-10">Quay lại danh sách</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[600px] perspective-1000">
      {/* 3D Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-3xl transform-gpu rotate-x-6 rotate-y-6 scale-105 -z-10"></div>
      
      {/* Neumorphic container */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff]">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Chỉnh sửa danh mục
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Cập nhật thông tin danh mục sản phẩm
            </p>
          </div>
          <CategoryForm
            category={category}
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}