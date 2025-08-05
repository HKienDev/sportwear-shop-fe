"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { adminReviewService, AdminReview, ReviewStats as ReviewStatsType } from "@/services/adminReviewService";
import ReviewListTable from "@/components/admin/reviews/reviewListTable";
import ReviewFilters from "@/components/admin/reviews/reviewFilters";
import { ReviewStatusCards } from "@/components/admin/reviews/reviewStatusCards";
import Pagination from "@/components/admin/categories/list/pagination";

export default function ReviewListPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [stats, setStats] = useState<ReviewStatsType>({
    total: 0,
    averageRating: 0,
    totalHelpful: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    rating: "",
    productSku: "",
    searchTerm: ""
  });

  // Check authentication
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 ReviewListPage - Fetching reviews with filters:', filters);
      
      const response = await adminReviewService.getReviews(
        currentPage,
        5,
        {
          rating: filters.rating ? parseInt(filters.rating) : undefined,
          productSku: filters.productSku || undefined,
        },
        'createdAt',
        'desc'
      );

      console.log('🔍 ReviewListPage - Reviews response:', response);

      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.totalPages);
        console.log('🔍 ReviewListPage - Reviews set:', response.data.reviews.length);
        console.log('🔍 ReviewListPage - Pagination:', response.data.pagination);
      } else {
        console.error('🔍 ReviewListPage - Response not successful:', response);
        toast.error(response.message || "Lỗi khi tải danh sách review");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách review:", error);
      toast.error("Có lỗi xảy ra khi lấy danh sách review");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      console.log('🔍 ReviewListPage - Fetching stats...');
      const response = await adminReviewService.getReviewStats();
      console.log('🔍 ReviewListPage - Stats response:', response);
      if (response.success) {
        setStats(response.data);
        console.log('🔍 ReviewListPage - Stats set:', response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thống kê review:", error);
    }
  }, []);

  // Load data
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchReviews();
      fetchStats();
    }
  }, [user, fetchReviews, fetchStats]);

  // Handle filters change
  const handleFiltersChange = (newFilters: {
    rating: string;
    productSku: string;
    searchTerm: string;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      rating: "",
      productSku: "",
      searchTerm: ""
    });
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle select review
  const handleToggleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Handle select all
  const handleToggleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map(review => review._id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) {
      toast.error("Vui lòng chọn review để xóa");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedReviews.length} review đã chọn?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await adminReviewService.bulkDeleteReviews(selectedReviews);
      
      if (response.success) {
        toast.success(`Đã xóa ${response.deletedCount} review thành công`);
        setSelectedReviews([]);
        fetchReviews();
        fetchStats();
      } else {
        toast.error(response.message || "Lỗi khi xóa review");
      }
    } catch (error) {
      console.error("Lỗi khi xóa review:", error);
      toast.error("Có lỗi xảy ra khi xóa review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchReviews();
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with Enhanced 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                    Quản lý đánh giá
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                    Xem và quản lý tất cả đánh giá sản phẩm từ khách hàng với giao diện hiện đại
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

        {/* Search and Filter Section */}
        <div className="mb-6">
          <ReviewFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Status Cards Section */}
        <div className="mb-6">
          <ReviewStatusCards reviews={reviews} stats={stats} />
        </div>

        {/* Actions Section */}
        <div className="mb-6">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {selectedReviews.length > 0 && (
                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl border border-indigo-200/60">
                      <span className="text-sm font-semibold text-indigo-700">
                        Đã chọn {selectedReviews.length} đánh giá
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedReviews([])}
                    disabled={selectedReviews.length === 0}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20 flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Bỏ chọn tất cả</span>
                  </button>
                  {selectedReviews.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg shadow-red-500/25 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa đã chọn</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section with Enhanced Glass Effect */}
        <div className="relative">
          {isLoading ? (
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="loading-animation mb-6">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p className="text-lg font-semibold text-slate-700 mb-2">Đang tải dữ liệu...</p>
                <p className="text-slate-500 text-center max-w-sm">Vui lòng chờ trong giây lát, chúng tôi đang xử lý yêu cầu của bạn</p>
                <style jsx>{`
                  .loading-animation {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                  }
                  
                  .dot {
                    width: 16px;
                    height: 16px;
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
                    0%, 100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-20px);
                    }
                  }
                `}</style>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy đánh giá</h3>
                <p className="text-slate-600 max-w-md mb-6 text-lg">
                  Hiện không có đánh giá nào phù hợp với điều kiện tìm kiếm của bạn. 
                  Hãy thử điều chỉnh bộ lọc hoặc chờ khách hàng đánh giá.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-emerald-100 transition-all duration-300 font-semibold border border-indigo-200/60"
                  >
                    Xóa bộ lọc
                  </button>
                  <button 
                    onClick={handleRefresh}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl hover:from-indigo-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25"
                  >
                    Làm mới
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl overflow-hidden">
              <ReviewListTable
                reviews={reviews}
                selectedReviews={selectedReviews}
                onToggleSelectReview={handleToggleSelectReview}
                onToggleSelectAll={handleToggleSelectAll}
                onRefresh={handleRefresh}
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={5}
              totalItems={stats.total}
            />
          </div>
        )}
      </div>
    </div>
  );
} 