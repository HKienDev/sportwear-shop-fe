"use client";

import CategoryForm from "@/components/admin/categories/add/categoryForm";
import { FileText } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <FileText size={28} className="text-white/90 mr-3" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Thêm Danh Mục Mới</h1>
                </div>
                <p className="text-white/80 mt-2 ml-1">Điền thông tin chi tiết về danh mục của bạn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <CategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
} 