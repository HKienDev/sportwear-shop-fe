'use client';

import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import type { RecentOrder } from '@/types/dashboard';

interface RecentOrdersProps {
  orders: RecentOrder[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasMore: boolean;
  };
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export default function RecentOrders({ 
  orders = [], 
  pagination,
  isLoading = false,
  onLoadMore
}: RecentOrdersProps) {
  if (isLoading && !orders.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col items-center justify-center py-8 text-gray-500">
        <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-sm">Không có đơn hàng nào</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
      {orders.map((order) => (
        <Link
          key={order._id}
          href={`/admin/orders/${order._id}`}
          className="block group"
        >
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#4EB09D] bg-opacity-10 flex items-center justify-center">
                <span className="text-sm font-medium text-[#4EB09D]">
                  {order.customerName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {order.customerName}
                </p>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-gray-500">
                  #{order.orderNumber}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <p className="text-sm font-medium text-[#4EB09D]">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* Pagination */}
      {pagination.hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#4EB09D] hover:text-[#2C7A7B] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      )}
    </div>
  );
} 
