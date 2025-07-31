"use client";

import React, { useState, useEffect } from "react";
import { X, Send, MessageSquare } from "lucide-react";
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
}

const AdminReplyModal: React.FC<AdminReplyModalProps> = ({
  isOpen,
  onClose,
  reviewId,
  reviewTitle,
  currentReply,
  onReplySuccess,
  mode = 'create'
}) => {
  console.log('🔍 AdminReplyModal props:', {
    isOpen,
    reviewId,
    reviewTitle,
    currentReply,
    mode
  });
  
  const [reply, setReply] = useState(currentReply || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update reply state when currentReply prop changes
  useEffect(() => {
    setReply(currentReply || "");
  }, [currentReply]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'edit' ? 'Chỉnh sửa phản hồi' : 'Phản hồi đánh giá'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá:
            </label>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {reviewTitle}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
              Phản hồi của admin:
            </label>
            <textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập phản hồi của bạn..."
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {reply.length}/500 ký tự
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Xóa phản hồi</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reply.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{mode === 'edit' ? 'Cập nhật' : 'Gửi phản hồi'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReplyModal; 