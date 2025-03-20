import { Order } from "@/types/order";
import Link from "next/link";

interface OrderListTableProps {
  orders: Order[];
  selectedOrders: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOrder: (id: string) => void;
  getStatusColor: (status: string) => string;
}

export default function OrderListTable({
  orders,
  selectedOrders,
  onToggleSelectAll,
  onToggleSelectOrder,
  getStatusColor,
}: OrderListTableProps) {
  return (
    <div className="bg-white rounded-md shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectedOrders.length === orders.length}
                onChange={onToggleSelectAll}
                className="w-4 h-4"
              />
            </th>
            <th className="px-4 py-3 text-left">Mã Đơn</th>
            <th className="px-4 py-3 text-left">Người Đặt</th>
            <th className="px-4 py-3 text-left">Địa Chỉ</th>
            <th className="px-4 py-3 text-left">Tổng Tiền</th>
            <th className="px-4 py-3 text-left">Thanh Toán</th>
            <th className="px-4 py-3 text-left">Trạng Thái</th>
            <th className="px-4 py-3 text-left">Ngày Đặt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={() => onToggleSelectOrder(order._id)}
                  className="w-4 h-4"
                />
              </td>
              <td className="px-4 py-3">
                <Link 
                  href={`/admin/orders/details/${order._id}`}
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                >
                  {order.shortId}
                </Link>
              </td>
              <td className="px-4 py-3">{order.customer.fullname || "Không có dữ liệu"}</td>
              <td className="px-4 py-3">{order.customer.address.province || "Không có dữ liệu"}</td>
              <td className="px-4 py-3">{order.totalPrice.toLocaleString()} Vnđ</td>
              <td className="px-4 py-3">
                {order.paymentMethod} -{" "}
                <span className={order.status === "completed" ? "text-green-500" : "text-red-500"}>
                  {order.status === "completed" ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </td>
              <td className={`px-4 py-3 ${getStatusColor(order.status)} font-medium`}>
                {order.status === "pending" && "Chờ xác nhận"}
                {order.status === "processing" && "Đang xử lý"}
                {order.status === "completed" && "Giao hàng thành công"}
                {order.status === "cancelled" && "Đã hủy"}
                {order.status === "failed" && "Thất bại"}
              </td>
              <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 