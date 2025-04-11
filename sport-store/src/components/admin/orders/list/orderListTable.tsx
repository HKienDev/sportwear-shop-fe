import React from "react";
import Link from "next/link";
import { Order } from "@/types/order";

interface OrderListTableProps {
  orders: Order[];
  selectedOrders: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOrder: (id: string) => void;
  getStatusColor: (status: string) => string;
}

const OrderListTable = React.memo(
  ({ orders, selectedOrders, onToggleSelectAll, onToggleSelectOrder, getStatusColor }: OrderListTableProps) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đơn</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người Đặt</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa Chỉ</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Tiền</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh Toán</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Đặt</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => onToggleSelectOrder(order._id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/details/${order._id}`}
                      className="text-blue-600 hover:text-blue-900 hover:underline font-medium"
                    >
                      {order.shortId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.shippingAddress?.fullName || "Không có dữ liệu"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {order.shippingAddress
                        ? `${order.shippingAddress.address.province.name}, ${order.shippingAddress.address.district.name}, ${order.shippingAddress.address.ward.name}`
                        : "Không có dữ liệu"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.totalPrice.toLocaleString()} Vnđ</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{order.paymentMethod}</span> -{" "}
                      <span className={order.status === "delivered" ? "text-green-600" : "text-red-600"}>
                        {order.status === "delivered" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)} text-white`}>
                      {order.status === "pending" && "Chờ xác nhận"}
                      {order.status === "processing" && "Đã xác nhận"}
                      {order.status === "shipped" && "Đang vận chuyển"}
                      {order.status === "delivered" && "Đã giao hàng"}
                      {order.status === "cancelled" && "Đã hủy"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

OrderListTable.displayName = "OrderListTable";

export default OrderListTable;