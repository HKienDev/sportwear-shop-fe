import React from "react";
import Link from "next/link";
import { Order } from "@/types/base";
import OrderStatusBadge from "./orderStatusBadge";
import { AlertCircle, Eye, Package, DollarSign, Calendar, User, MapPin } from "lucide-react";
import Pagination from "./pagination";

interface OrderListTableProps {
  orders: Order[];
  selectedOrders: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOrder: (id: string) => void;
}

const OrderListTable = React.memo(
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

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === "pending" || order.status === "confirmed").length;
    const shippingOrders = orders.filter(order => order.status === "shipped").length;
    const deliveredOrders = orders.filter(order => order.status === "delivered").length;

    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Tổng Đơn Hàng</p>
                  <p className="text-3xl font-bold text-slate-800">{totalOrders.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Package size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Chờ Xử Lý</p>
                  <p className="text-3xl font-bold text-slate-800">{pendingOrders.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <AlertCircle size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Đang Giao Hàng</p>
                  <p className="text-3xl font-bold text-slate-800">{shippingOrders.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Package size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Đã Hoàn Thành</p>
                  <p className="text-3xl font-bold text-slate-800">{deliveredOrders.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                  <Package size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Summary */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 rounded-xl text-sm font-semibold border border-indigo-200/60">
              {currentOrders.length} đơn hàng
            </span>
            {selectedOrders.length > 0 && (
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-200/60 animate-pulse">
                Đã chọn {selectedOrders.length} đơn
              </span>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/60">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm">
                    <th className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Mã Đơn</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-48">Khách Hàng</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-64">Địa Chỉ</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-36">Tổng Tiền</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-56">Thanh Toán</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-44">Trạng Thái</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-44">Ngày Đặt</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order, index) => (
                      <tr key={order._id} className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-emerald-50/50 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'
                      }`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => onToggleSelectOrder(order._id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders/details/${order._id}`}
                            className="group/link inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-all duration-200"
                          >
                            <span className="text-sm font-mono">
                              {order.shortId.startsWith('VJUSPORT-ORDER-')
                                ? order.shortId.substring('VJUSPORT-ORDER-'.length)
                                : order.shortId}
                            </span>
                            <Eye size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center">
                              <User size={16} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800 truncate">
                                {order.shippingAddress?.fullName || "Không có dữ liệu"}
                              </span>
                              <span className="text-sm text-slate-500 truncate">
                                {order.shippingAddress?.phone || ""}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                            <div className="flex flex-col text-sm text-slate-700 leading-snug">
                              {order.shippingAddress ? (
                                <>
                                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {order.shippingAddress.address.street || ''}, {order.shippingAddress.address.ward.name}
                                  </span>
                                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {order.shippingAddress.address.district.name}, {order.shippingAddress.address.province.name}
                                  </span>
                                </>
                              ) : (
                                <span>Không có dữ liệu</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-emerald-600" />
                            <div className="text-sm font-semibold text-slate-800">
                              {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                              <span className="text-slate-500 text-xs ml-1">Vnđ</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 min-w-[150px] whitespace-nowrap rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              {order.paymentMethod}
                            </div>
                            {order.status === "delivered" ? (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 min-w-[150px] whitespace-nowrap rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Đã thanh toán
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 min-w-[150px] whitespace-nowrap rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Chưa thanh toán
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {new Date(order.createdAt).toLocaleString("vi-VN", {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders/details/${order._id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                          >
                            <Eye size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-4 p-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-200">
                            <AlertCircle size={32} className="text-slate-400" />
                          </div>
                          <p className="text-lg font-semibold text-slate-800 mb-2">Không tìm thấy đơn hàng</p>
                          <p className="text-slate-500 max-w-sm">Hiện tại chưa có đơn hàng nào trong hệ thống hoặc không phù hợp với bộ lọc</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination Component */}
        {orders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            totalItems={orders.length}
            itemsPerPage={ordersPerPage}
          />
        )}
      </div>
    );
  }
);

OrderListTable.displayName = "OrderListTable";

export default OrderListTable;