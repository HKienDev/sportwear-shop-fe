interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface ActiveDeliveriesProps {
  deliveries: RecentOrder[];
}

export function ActiveDeliveries({ deliveries }: ActiveDeliveriesProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h2>
      <div className="space-y-4">
        {deliveries.map((order) => (
          <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{order.customerName}</h3>
              <p className="text-sm text-gray-500">Mã đơn: {order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND',
                  maximumFractionDigits: 0
                }).format(order.total)}
              </p>
              <p className="text-sm text-gray-500">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 