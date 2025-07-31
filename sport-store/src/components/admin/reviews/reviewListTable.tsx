"use client";

import React, { useState } from "react";
import { 
  Star, 
  Trash2, 
  Edit,
  MoreHorizontal,
  Package,
  User,
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
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                    onChange={onToggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Người đánh giá
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Đánh giá
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Tiêu đề
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review._id)}
                      onChange={() => onToggleSelectReview(review._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={review.product.mainImage}
                        alt={review.product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.product.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {review.product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={review.userAvatar || review.user?.avatar || "/avatarDefault.jpg"}
                        alt={review.userName || review.user?.fullname}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.userName || review.user?.fullname}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {formatOrderId(review.orderShortId)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <div className="font-medium text-gray-900 truncate">
                        {review.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {review.comment}
                      </div>
                      {review.adminNote && (
                        <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded-r">
                          <div className="text-xs font-medium text-blue-800 mb-1">
                            Phản hồi của Admin:
                          </div>
                          <div className="text-xs text-blue-700">
                            {review.adminNote}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReply(review)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Phản hồi"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={loadingActions[review._id]}
                        className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {reviews.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">Không có review nào</div>
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