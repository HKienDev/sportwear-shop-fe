interface Order {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  shippingStatus: string;
  trackingNumber: string;
  orderDate: string;
}

interface OrderListProps {
  orders: Order[];
  onViewAll: () => void;
  onSort: (value: string) => void;
}

export default function OrderList({ orders, onViewAll, onSort }: OrderListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getShippingStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'shipping':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-6 border border-neutral-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-neutral-800">ĐƠN HÀNG</h3>
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Sắp xếp theo:</span>
          <select 
            className="border border-neutral-300 rounded px-2 py-1 text-sm"
            onChange={(e) => onSort(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="highest">Giá trị cao nhất</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100 text-neutral-700">
              <th className="px-4 py-3 text-left rounded-l-lg">ID</th>
              <th className="px-4 py-3 text-left">Thành Tiền</th>
              <th className="px-4 py-3 text-left">Thanh Toán</th>
              <th className="px-4 py-3 text-left">Vận Chuyển</th>
              <th className="px-4 py-3 text-left">Mã Vận Chuyển</th>
              <th className="px-4 py-3 text-left rounded-r-lg">Thời Gian Đặt Đơn</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-150 ${index === 0 ? "bg-blue-50" : ""}`}
              >
                <td className="px-4 py-3 text-indigo-600 font-medium cursor-pointer">
                  #{order.id}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusClass(order.paymentStatus)}`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShippingStatusClass(order.shippingStatus)}`}>
                    {order.shippingStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  #{order.trackingNumber}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {order.orderDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-neutral-500 text-sm">
          Hiển thị 1-{Math.min(orders.length, 10)} của {orders.length} đơn hàng
        </div>
        <button 
          onClick={onViewAll}
          className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center gap-1"
        >
          Xem tất cả <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
} 