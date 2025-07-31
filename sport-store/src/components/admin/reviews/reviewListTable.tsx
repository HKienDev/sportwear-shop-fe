"use client";

import React, { useState } from "react";
import { 
  Star, 
  Trash2, 
  Edit,
  MoreHorizontal,
  MessageSquare
} from "lucide-react";
import { AdminReview } from "@/services/adminReviewService";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "sonner";
import { adminReviewService } from "@/services/adminReviewService";
import AdminReplyModal from "./adminReplyModal";

interface ReviewListTableProps {
  reviews: AdminReview[];
  selectedReviews: string[];
  onToggleSelectReview: (id: string) => void;
  onToggleSelectAll: () => void;
  onRefresh: () => void;
}



const ReviewListTable: React.FC<ReviewListTableProps> = ({
  reviews,
  selectedReviews,
  onToggleSelectReview,
  onToggleSelectAll,
  onRefresh
}) => {
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const [replyModal, setReplyModal] = useState<{
    isOpen: boolean;
    reviewId: string;
    reviewTitle: string;
    currentReply?: string;
    mode: 'create' | 'edit';
  }>({
    isOpen: false,
    reviewId: "",
    reviewTitle: "",
    currentReply: "",
    mode: 'create'
  });



  const handleDelete = async (reviewId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa review này?")) return;
    
    setLoadingActions(prev => ({ ...prev, [reviewId]: true }));
    try {
      await adminReviewService.deleteReview(reviewId);
      toast.success("Xóa review thành công");
      onRefresh();
    } catch (error) {
      toast.error("Lỗi khi xóa review");
    } finally {
      setLoadingActions(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleReply = (review: AdminReview) => {
    const hasExistingReply = !!review.adminNote;
    console.log('🔍 handleReply called:', {
      reviewId: review._id,
      hasExistingReply,
      adminNote: review.adminNote,
      mode: hasExistingReply ? 'edit' : 'create'
    });
    setReplyModal({
      isOpen: true,
      reviewId: review._id,
      reviewTitle: review.title,
      currentReply: review.adminNote,
      mode: hasExistingReply ? 'edit' : 'create'
    });
  };

  const handleCloseReplyModal = () => {
    setReplyModal({
      isOpen: false,
      reviewId: "",
      reviewTitle: "",
      currentReply: "",
      mode: 'create'
    });
  };

  const formatOrderId = (orderId: string) => {
    if (!orderId) return '';
    // Remove prefix like "VJUSPORT-ORDER-" and return the rest
    return orderId.replace(/^VJUSPORT-ORDER-/, '');
  };

  const formatProductSku = (sku: string) => {
    if (!sku) return '';
    // Remove prefix like "VJUSPORTPRODUCT-" and return the rest
    return sku.replace(/^VJUSPORTPRODUCT-/, '');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? "text-yellow-400 fill-current" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-100/60">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                    onChange={onToggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-2"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-64">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-64">
                  Người đánh giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-32">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-96">
                  Nội dung
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-48">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 w-32">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-100/60">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-emerald-50/50 transition-all duration-200">
                  <td className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review._id)}
                      onChange={() => onToggleSelectReview(review._id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-2"
                    />
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={review.product.mainImage || "/default-image.png"}
                          alt={review.product.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200/60 shadow-sm bg-slate-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/default-image.png";
                            target.onerror = null; // Prevent infinite loop
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 truncate">
                          {review.product.name}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                            {formatProductSku(review.product.sku)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={review.userAvatar || review.user?.avatar || "/avatarDefault.jpg"}
                          alt={review.userName || review.user?.fullname}
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-200/60 shadow-sm"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 truncate">
                          {review.userName || review.user?.fullname}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md text-xs font-medium">
                            {formatOrderId(review.orderShortId)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 w-32">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-slate-700 bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-md">
                        {review.rating}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 w-96">
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-800 truncate">
                        {review.title}
                      </div>
                      <div className="text-sm text-slate-600 line-clamp-2">
                        {review.comment}
                      </div>
                      {review.adminNote && (
                        <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">A</span>
                            </div>
                            <div className="text-xs font-semibold text-blue-800">
                              Phản hồi của Admin
                            </div>
                          </div>
                          <div className="text-xs text-blue-700 leading-relaxed line-clamp-2">
                            {review.adminNote}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 w-48">
                    <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 w-32">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReply(review)}
                        className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm shadow-blue-500/25"
                        title="Phản hồi"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={loadingActions[review._id]}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-red-500/25"
                        title="Xóa"
                      >
                        {loadingActions[review._id] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 font-medium">Không có đánh giá nào</div>
          </div>
        )}
      </div>

      <AdminReplyModal
        isOpen={replyModal.isOpen}
        onClose={handleCloseReplyModal}
        reviewId={replyModal.reviewId}
        reviewTitle={replyModal.reviewTitle}
        currentReply={replyModal.currentReply}
        mode={replyModal.mode}
        onReplySuccess={onRefresh}
      />
    </>
  );
};

export default ReviewListTable; 