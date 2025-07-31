"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { Trash2, Download } from "lucide-react";
import { adminReviewService, AdminReview, ReviewStats as ReviewStatsType } from "@/services/adminReviewService";
import ReviewListTable from "@/components/admin/reviews/reviewListTable";
import ReviewFilters from "@/components/admin/reviews/reviewFilters";
import ReviewStats from "@/components/admin/reviews/reviewStats";

export default function ReviewListPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
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
      const response = await adminReviewService.getReviews(
        currentPage,
        10,
        {
          rating: filters.rating ? parseInt(filters.rating) : undefined,
          productSku: filters.productSku || undefined,
        },
        'createdAt',
        'desc'
      );

      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.totalPages);
      } else {
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
  const handleFiltersChange = (newFilters: any) => {
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
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
        <p className="text-gray-600 mt-2">
          Xem và quản lý đánh giá sản phẩm từ khách hàng
        </p>
      </div>

      {/* Stats */}
      <ReviewStats stats={stats} isLoading={isLoading} />

      {/* Filters */}
      <ReviewFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Actions */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {selectedReviews.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                Đã chọn {selectedReviews.length} review
              </span>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa đã chọn</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <ReviewListTable
        reviews={reviews}
        selectedReviews={selectedReviews}
        onToggleSelectReview={handleToggleSelectReview}
        onToggleSelectAll={handleToggleSelectAll}
        onRefresh={handleRefresh}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm rounded ${
                    isCurrentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">Đang tải...</div>
          </div>
        </div>
      )}
    </div>
  );
} 