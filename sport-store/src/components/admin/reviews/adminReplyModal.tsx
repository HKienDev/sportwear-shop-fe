"use client";

import React, { useState, useEffect } from "react";
import { X, MessageSquare, Star, User } from "lucide-react";
import { toast } from "sonner";
import { adminReviewService } from "@/services/adminReviewService";

interface AdminReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  reviewTitle: string;
  currentReply?: string;
  onReplySuccess: () => void;
  mode?: 'create' | 'edit';
  reviewData?: {
    rating?: number;
    userName?: string;
    createdAt?: string;
    productName?: string;
  };
}

const AdminReplyModal: React.FC<AdminReplyModalProps> = ({
  isOpen,
  onClose,
  reviewId,
  reviewTitle,
  currentReply,
  onReplySuccess,
  mode = 'create',
  reviewData
}) => {
  const [reply, setReply] = useState(currentReply || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setReply(currentReply || "");
  }, [currentReply]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reply.trim()) {
      toast.error("Nội dung phản hồi không được để trống");
      return;
    }

    if (reply.length > 500) {
      toast.error("Nội dung phản hồi không được vượt quá 500 ký tự");
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (mode === 'edit') {
        response = await adminReviewService.updateAdminReply(reviewId, reply.trim());
      } else {
        response = await adminReviewService.replyToReview(reviewId, reply.trim());
      }
      
      if (response.success) {
        toast.success(response.message || (mode === 'edit' ? "Cập nhật phản hồi thành công" : "Phản hồi thành công"));
        onReplySuccess();
        onClose();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error replying to review:", error);
      toast.error("Có lỗi xảy ra khi phản hồi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await adminReviewService.deleteAdminReply(reviewId);
      
      if (response.success) {
        toast.success(response.message || "Xóa phản hồi thành công");
        onReplySuccess();
        onClose();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error deleting admin reply:", error);
      toast.error("Có lỗi xảy ra khi xóa phản hồi");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              {mode === 'edit' ? 'Chỉnh sửa phản hồi' : 'Phản hồi đánh giá'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Review Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{reviewData?.userName || 'Khách hàng'}</span>
              </div>
              {reviewData?.rating && (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < reviewData.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {reviewData?.productName && (
              <div className="mb-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {reviewData.productName}
                </span>
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              <p className="font-medium">&ldquo;{reviewTitle}&rdquo;</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(reviewData?.createdAt || '')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phản hồi của Admin
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập phản hồi của bạn..."
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {reply.length}/500 ký tự
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Hủy
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !reply.trim()}
                className="px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : (mode === 'edit' ? 'Cập nhật' : 'Gửi')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminReplyModal; 