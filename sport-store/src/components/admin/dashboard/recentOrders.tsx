import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  user?: { name: string };
  shippingAddress?: { fullName: string };
}

interface ApiResponse {
  success: boolean;
  data: Order[];
}

export default function RecentOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithAuth('/orders/admin/recent');
        if (response) {
          const data = await response.json() as ApiResponse;
          if (data.success) {
            setOrders(data.data);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Đơn hàng đang giao</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3 font-medium">Mã đơn</th>
              <th className="pb-3 font-medium">Khách hàng</th>
              <th className="pb-3 font-medium">Tổng tiền</th>
              <th className="pb-3 font-medium">Trạng thái</th>
              <th className="pb-3 font-medium">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map((order) => (
              <tr 
                key={order._id}
                className="border-b cursor-pointer hover:bg-gray-50"
                onClick={() => router.push(`/admin/orders/details/${order._id}`)}
              >
                <td className="py-3 text-gray-900 font-medium">
                  #{order.orderNumber ? order.orderNumber.slice(-6) : order._id.slice(-6)}
                </td>
                <td className="py-3 text-gray-600">
                  {order.user?.name || order.shippingAddress?.fullName || 'Khách vãng lai'}
                </td>
                <td className="py-3 text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="py-3 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 