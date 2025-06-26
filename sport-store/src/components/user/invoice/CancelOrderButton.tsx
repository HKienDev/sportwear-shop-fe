'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface CancelOrderButtonProps {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
  onOrderCancelled: () => void;
}

// Các lý do hủy đơn hàng phổ biến cho e-commerce
const CANCELLATION_REASONS = [
  {
    id: 'change_mind',
    label: 'Thay đổi ý định mua hàng',
    description: 'Tôi đã thay đổi ý định và không muốn mua sản phẩm này nữa'
  },
  {
    id: 'found_better_price',
    label: 'Tìm thấy giá tốt hơn',
    description: 'Tôi đã tìm thấy sản phẩm tương tự với giá tốt hơn ở nơi khác'
  },
  {
    id: 'wrong_size_color',
    label: 'Chọn sai kích thước/màu sắc',
    description: 'Tôi đã chọn sai kích thước hoặc màu sắc của sản phẩm'
  },
  {
    id: 'duplicate_order',
    label: 'Đặt hàng trùng lặp',
    description: 'Tôi đã vô tình đặt hàng trùng lặp'
  },
  {
    id: 'shipping_too_slow',
    label: 'Thời gian giao hàng quá lâu',
    description: 'Thời gian giao hàng dự kiến quá lâu so với nhu cầu của tôi'
  },
  {
    id: 'financial_issues',
    label: 'Vấn đề tài chính',
    description: 'Tôi gặp vấn đề tài chính và không thể thanh toán'
  },
  {
    id: 'product_not_needed',
    label: 'Không còn cần sản phẩm',
    description: 'Tôi không còn cần sản phẩm này nữa'
  },
  {
    id: 'other',
    label: 'Lý do khác',
    description: 'Lý do khác (vui lòng mô tả chi tiết)'
  }
];

export default function CancelOrderButton({
  orderId,
  orderStatus,
  paymentStatus,
  onOrderCancelled
}: CancelOrderButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');

  // Kiểm tra xem đơn hàng có thể hủy không
  const canCancel = () => {
    const cancellableStatuses = ['pending', 'confirmed'];
    const cancellablePaymentStatuses = ['pending', 'failed'];
    
    return (
      cancellableStatuses.includes(orderStatus) &&
      cancellablePaymentStatuses.includes(paymentStatus)
    );
  };

  const handleReasonChange = (reasonId: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons(prev => [...prev, reasonId]);
    } else {
      setSelectedReasons(prev => prev.filter(id => id !== reasonId));
    }
  };

  const handleCancelOrder = async () => {
    if (selectedReasons.length === 0) {
      toast.error('Vui lòng chọn ít nhất một lý do hủy đơn hàng');
      return;
    }

    if (selectedReasons.includes('other') && !otherReason.trim()) {
      toast.error('Vui lòng mô tả lý do khác');
      return;
    }

    try {
      setIsCancelling(true);
      
      const reasonMessages = selectedReasons.map(reasonId => {
        const reason = CANCELLATION_REASONS.find(r => r.id === reasonId);
        if (reasonId === 'other') {
          return `Lý do khác: ${otherReason.trim()}`;
        }
        return reason?.label || '';
      });

      const cancellationMessage = reasonMessages.join(', ');

      const response = await api.put(`/orders/my-orders/${orderId}/cancel`, {
        reason: cancellationMessage
      });

      if (response.data.success) {
        toast.success('Đơn hàng đã được hủy thành công');
        setShowConfirmModal(false);
        setSelectedReasons([]);
        setOtherReason('');
        onOrderCancelled();
      } else {
        toast.error(response.data.message || 'Không thể hủy đơn hàng');
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(
        error.response?.data?.message || 
        'Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (!canCancel()) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <X size={16} />
        Hủy đơn hàng
      </button>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xác nhận hủy đơn hàng
                </h3>
                <p className="text-sm text-gray-600">
                  Vui lòng chọn lý do hủy đơn hàng của bạn
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Lý do hủy đơn hàng *
              </label>
              
              <div className="space-y-3">
                {CANCELLATION_REASONS.map((reason) => (
                  <div key={reason.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={reason.id}
                      checked={selectedReasons.includes(reason.id)}
                      onChange={(e) => handleReasonChange(reason.id, e.target.checked)}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={reason.id}
                        className="block text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {reason.label}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedReasons.includes('other') && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết lý do khác *
                  </label>
                  <textarea
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Vui lòng mô tả chi tiết lý do hủy đơn hàng..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {otherReason.length}/300 ký tự
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedReasons([]);
                  setOtherReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isCancelling}
              >
                Hủy
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || selectedReasons.length === 0 || (selectedReasons.includes('other') && !otherReason.trim())}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCancelling ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang hủy...
                  </span>
                ) : (
                  'Xác nhận hủy'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 