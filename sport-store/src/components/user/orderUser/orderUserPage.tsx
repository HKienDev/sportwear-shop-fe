'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { API_URL } from "@/utils/api";

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  name: string;
  sku: string;
}

interface Order {
  _id: string;
  shortId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
}

export default function OrderUserPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const limit = 8; // Số đơn hàng trên mỗi trang

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/my-orders?page=${currentPage}&limit=${limit}`);

      if (response.data.success) {
        setOrders(response.data.data);
        
        // Cập nhật thông tin phân trang
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalOrders(response.data.pagination.total);
          setHasNextPage(response.data.pagination.hasNextPage);
          setHasPrevPage(response.data.pagination.hasPrevPage);
        }
      } else {
        setError('Không thể tải danh sách đơn hàng');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setError('Vui lòng đăng nhập để xem đơn hàng');
      setLoading(false);
    }
  }, [isAuthenticated, currentPage, activeTab, fetchOrders]);

  // Hàm chuyển trang
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm dd/MM/yyyy', { locale: vi });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
            <CheckCircle size={14} />
            ĐÃ GIAO
          </span>
        );
      case 'shipping':
        return (
          <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium">
            <Truck size={14} />
            ĐANG VẬN CHUYỂN
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium">
            CHỜ XỬ LÝ
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-medium">
            ĐÃ HỦY
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-xs font-medium">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'shipping') return order.status === 'shipping';
    if (activeTab === 'delivered') return order.status === 'delivered';
    return true;
  });

  const handleViewOrderDetail = (orderId: string) => {
    router.push(`/user/invoice/${orderId}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">Đang tải danh sách đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Đơn hàng của bạn</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'shipping' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('shipping')}
          >
            Đang giao
          </button>
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'delivered' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('delivered')}
          >
            Đã giao
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => handleViewOrderDetail(order._id)}
                  >
                    #{order.shortId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(order.totalPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewOrderDetail(order._id)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Thêm phần phân trang */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{orders.length}</span> trong tổng số <span className="font-medium">{totalOrders}</span> đơn hàng
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={!hasPrevPage}
                className={`px-3 py-1 rounded-md ${
                  hasPrevPage
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasNextPage}
                className={`px-3 py-1 rounded-md ${
                  hasNextPage
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}