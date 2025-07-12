"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import CategoryFilter from "@/components/admin/categories/list/categoryFilter";
import CategoryTable from "@/components/admin/categories/list/categoryTable";
import CategoryStatusCards from "@/components/admin/categories/list/categoryStatusCards";
import Pagination from "@/components/admin/categories/list/pagination";
import { Category } from "@/types/category";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";


export default function CategoryListPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetchWithAuth<{
        categories: Category[];
        pagination?: { total: number; page: number; limit: number; totalPages: number }
      }>(`/categories/admin?${queryParams}`);

      if (!response.success) {
        throw new Error(response.message || "Có lỗi xảy ra khi lấy danh sách danh mục");
      }

      if (!response.data) {
        throw new Error("Không nhận được dữ liệu từ server");
      }

      setCategories(response.data.categories);
      setTotal(response.data.pagination?.total || response.data.categories.length);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy danh sách danh mục");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, page, limit]);

  // Delete categories
  const handleDeleteCategories = useCallback(async () => {
    if (selectedCategories.length === 0) {
      toast.error("Vui lòng chọn danh mục cần xóa");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedCategories.length} danh mục đã chọn?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetchWithAuth<{ success: boolean; message: string }>("/categories/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryIds: selectedCategories }),
      });

      if (!response.success) {
        throw new Error(response.message || "Có lỗi xảy ra khi xóa danh mục");
      }

      // Cập nhật state categories ngay lập tức
      setCategories(prevCategories => 
        prevCategories.filter(category => !selectedCategories.includes(category._id))
      );
      
      toast.success("Xóa danh mục thành công");
      setSelectedCategories([]);
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa danh mục");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchCategories();
    }
  }, [fetchCategories, isAuthenticated, user?.role]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleAddCategory = useCallback(() => {
    router.push("/admin/categories/add");
  }, [router]);

  const handleToggleSelectAll = useCallback(() => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(category => category._id));
    }
  }, [categories, selectedCategories]);

  const handleToggleSelectCategory = useCallback((id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) 
        ? prev.filter(categoryId => categoryId !== id)
        : [...prev, id]
    );
  }, []);

  // Redirect if not authenticated or not admin
  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                    Quản lý danh mục
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                    Xem và quản lý tất cả danh mục trong hệ thống với giao diện hiện đại
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Hệ thống hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <CategoryFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onAddCategory={handleAddCategory}
          />
        </div>

        {/* Bulk Actions - With Enhanced Animation */}
        {selectedCategories.length > 0 && (
          <div 
            className="mb-6 relative overflow-hidden" 
            style={{
              animation: "slideInFromTop 0.4s ease-out forwards"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/60 shadow-xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
                    <span className="text-white font-bold text-lg">{selectedCategories.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 font-semibold">danh mục đã được chọn</span>
                    <p className="text-sm text-slate-500">Sẵn sàng thực hiện thao tác hàng loạt</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20 flex items-center text-sm font-medium shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Bỏ chọn tất cả
                  </button>
                  <button
                    onClick={handleDeleteCategories}
                    disabled={isDeleting}
                    className="group px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transform hover:scale-105"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Xóa đã chọn ({selectedCategories.length})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Status Cards - Statistics Overview */}
        <div className="mb-6">
          <CategoryStatusCards categories={categories} />
        </div>

        {/* Table Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 opacity-5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-emerald-500 opacity-5 rounded-2xl transform -rotate-1"></div>
          <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="loading-animation">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p className="mt-6 text-slate-500 font-medium">Đang tải dữ liệu...</p>
                <style jsx>{`
                  .loading-animation {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                  }
                  
                  .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: linear-gradient(to right, #4f46e5, #10b981);
                    animation: bounce 1.5s infinite ease-in-out;
                  }
                  
                  .dot:nth-child(1) {
                    animation-delay: 0s;
                  }
                  
                  .dot:nth-child(2) {
                    animation-delay: 0.2s;
                  }
                  
                  .dot:nth-child(3) {
                    animation-delay: 0.4s;
                  }
                  
                  @keyframes bounce {
                    0%, 80%, 100% {
                      transform: scale(0);
                    }
                    40% {
                      transform: scale(1);
                    }
                  }
                `}</style>
              </div>
            ) : (
              <CategoryTable
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelectCategory={handleToggleSelectCategory}
                searchQuery={searchTerm}
                filters={{ status: statusFilter }}
              />
            )}
          </div>
        </div>
        {/* Pagination - tách block riêng, glass morphism, đồng bộ products */}
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={limit}
            totalItems={total}
          />
        </div>
      </div>
    </div>
  );
}