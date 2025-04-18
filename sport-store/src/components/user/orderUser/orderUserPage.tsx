'use client';

import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Truck } from 'lucide-react';

export default function OrderUserPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const orders = [
    { id: '2131', amount: '8.500.000 VND', paid: true, status: 'delivered', date: '16:10 24/01/2025' },
    { id: '2130', amount: '2.150.000 VND', paid: true, status: 'shipping', date: '09:45 23/01/2025' },
    { id: '2129', amount: '5.899.000 VND', paid: true, status: 'shipping', date: '14:30 22/01/2025' },
    { id: '2128', amount: '1.250.000 VND', paid: true, status: 'shipping', date: '11:20 21/01/2025' },
    { id: '2127', amount: '3.750.000 VND', paid: true, status: 'shipping', date: '16:50 20/01/2025' },
    { id: '2126', amount: '9.200.000 VND', paid: true, status: 'shipping', date: '08:15 19/01/2025' },
    { id: '2125', amount: '4.300.000 VND', paid: true, status: 'shipping', date: '13:40 18/01/2025' },
    { id: '2124', amount: '6.780.000 VND', paid: true, status: 'shipping', date: '17:25 17/01/2025' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'delivered') {
      return (
        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
          <CheckCircle size={14} />
          ĐÃ GIAO
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium">
        <Truck size={14} />
        ĐANG VẬN CHUYỂN
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Đơn hàng của bạn</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter size={18} />
            Lọc
          </button>
        </div>
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800">Xem chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}