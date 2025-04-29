import React from "react";
import Link from "next/link";
import { Order } from "@/types/base";
import OrderStatusBadge from "./orderStatusBadge";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

interface OrderListTableProps {
  orders: Order[];
  selectedOrders: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOrder: (id: string) => void;
}

const OrderListPage = React.memo(
  ({ orders, selectedOrders, onToggleSelectAll, onToggleSelectOrder }: OrderListTableProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const ordersPerPage = 10;

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Handle pagination
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
      <div className="px-4 py-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-teal-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng Đơn Hàng</p>
                  <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <span className="text-teal-500 text-xl font-bold">Σ</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Đơn Chờ Xử Lý</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {orders.filter(order => order.status === "pending" || order.status === "confirmed").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <span className="text-indigo-500 text-xl font-bold">⧗</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Đang Giao Hàng</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {orders.filter(order => order.status === "shipped").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-500 text-xl font-bold">🚚</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-emerald-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Đã Hoàn Thành</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {orders.filter(order => order.status === "delivered").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="text-emerald-500 text-xl font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Summary & Selection */}
          <div className="flex flex-wrap justify-between items-center mb-2">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium">
                {currentOrders.length} đơn hàng
              </span>
              {selectedOrders.length > 0 && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium animate-pulse">
                  Đã chọn {selectedOrders.length} đơn
                </span>
              )}
            </div>
          </div>

          {/* Orders Table with Card Design */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24">Mã Đơn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-40">Người Đặt</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-48">Địa Chỉ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32">Tổng Tiền</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-40">Thanh Toán</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-40">Trạng Thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-40">Ngày Đặt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order, index) => (
                      <tr key={order._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50 transition-colors duration-150`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => onToggleSelectOrder(order._id)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/orders/details/${order._id}`}
                            className="text-teal-600 hover:text-teal-800 hover:underline font-medium"
                          >
                            {order.shortId}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium truncate">
                              {order.shippingAddress?.fullName || "Không có dữ liệu"}
                            </span>
                            <span className="text-sm text-gray-500 truncate">
                              {order.shippingAddress?.phone || ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-600 truncate">
                            {order.shippingAddress
                              ? `${order.shippingAddress.address.street || ''}, ${order.shippingAddress.address.ward.name}, ${order.shippingAddress.address.district.name}, ${order.shippingAddress.address.province.name}`
                              : "Không có dữ liệu"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-800 whitespace-nowrap">
                            <span className="font-semibold">{order.items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}</span>
                            <span className="text-slate-500 text-xs ml-1">Vnđ</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-md bg-slate-100 text-slate-800 font-medium">
                              {order.paymentMethod}
                            </span>
                            {order.status === "delivered" ? (
                              <span className="px-2 py-1 text-xs rounded-md bg-emerald-100 text-emerald-800">
                                Đã thanh toán
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-md bg-amber-100 text-amber-800">
                                Chưa thanh toán
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleString("vi-VN", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-4 p-4 rounded-full bg-slate-100">
                            <AlertCircle size={32} className="text-slate-400" />
                          </div>
                          <p className="text-lg font-medium text-slate-800 mb-1">Không tìm thấy đơn hàng</p>
                          <p className="text-slate-500">Hiện tại chưa có đơn hàng nào trong hệ thống</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {orders.length > 0 && (
              <div className="flex flex-wrap justify-between items-center border-t border-slate-200 px-4 py-3">
                <div className="text-sm text-slate-600 mb-2 sm:mb-0">
                  Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      currentPage === 1
                        ? "text-slate-300 cursor-not-allowed bg-slate-50"
                        : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageToShow}
                        onClick={() => paginate(pageToShow)}
                        className={`w-10 h-10 rounded-lg text-center ${
                          currentPage === pageToShow
                            ? "bg-teal-500 text-white font-medium"
                            : "text-slate-600 hover:bg-teal-50 bg-white border border-slate-200"
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      currentPage === totalPages
                        ? "text-slate-300 cursor-not-allowed bg-slate-50"
                        : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

OrderListPage.displayName = "OrderListPage";

export default OrderListPage;