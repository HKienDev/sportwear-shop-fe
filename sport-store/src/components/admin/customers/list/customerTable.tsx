'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Customer } from '@/types/customer';
import { Eye, Mail, Phone, Trash2, ShoppingBag, CreditCard, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { customerService } from '@/services/customerService';

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

// Thêm thuộc tính totalOrders vào interface Customer
declare module '@/types/customer' {
  interface Customer {
    totalOrders?: number;
  }
}

export function CustomerTable({
  customers = [],
  onDelete,
  onViewDetails,
}: CustomerTableProps) {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    return customers.filter(customer => customer.role === "user");
  }, [customers]);

  useEffect(() => {
    if (!Array.isArray(filteredCustomers)) return;
    
    const now = new Date().getTime();
    const onlineIds = new Set(
      filteredCustomers
        .filter(customer => {
          const lastActiveTime = new Date(customer.updatedAt || customer.createdAt).getTime();
          const timeDiff = now - lastActiveTime;
          return timeDiff < 5 * 60 * 1000; // 5 phút
        })
        .map(customer => customer._id)
    );
    setOnlineUsers(onlineIds);
  }, [filteredCustomers]);

  const handleSelectAll = (checked: boolean) => {
    if (!Array.isArray(filteredCustomers)) return;
    
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(customer => customer._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers(prev => {
      if (prev.includes(id)) {
        return prev.filter(customerId => customerId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await customerService.deleteCustomer(id);
      onDelete(id);
      toast.success('Xóa khách hàng thành công');
    } catch {
      toast.error('Xóa khách hàng thất bại');
    }
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = Array.isArray(filteredCustomers) 
    ? filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)
    : [];
  const totalPages = Math.ceil((Array.isArray(filteredCustomers) ? filteredCustomers.length : 0) / customersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="px-4 py-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-teal-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Tổng Khách Hàng</p>
                <p className="text-2xl font-bold text-slate-800">{Array.isArray(filteredCustomers) ? filteredCustomers.length : 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
                <span className="text-teal-500 text-xl font-bold">Σ</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-slate-800">
                  {Array.isArray(filteredCustomers) ? filteredCustomers.filter(customer => customer.isActive).length : 0}
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
                <p className="text-sm font-medium text-slate-500">Bị Khóa</p>
                <p className="text-2xl font-bold text-slate-800">
                  {Array.isArray(filteredCustomers) ? filteredCustomers.filter(customer => !customer.isActive).length : 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="text-amber-500 text-xl font-bold">🔒</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-emerald-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Online</p>
                <p className="text-2xl font-bold text-slate-800">
                  {Array.from(onlineUsers).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-500 text-xl font-bold">🟢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Summary & Selection */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium">
              {currentCustomers.length} khách hàng
            </span>
            {selectedCustomers.length > 0 && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium animate-pulse">
                Đã chọn {selectedCustomers.length} khách hàng
              </span>
            )}
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={Array.isArray(filteredCustomers) && selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Mã Thành Viên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Tên Khách Hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Số Điện Thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Tổng Đơn Hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Tổng Chi Tiêu</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer, index) => (
                    <tr key={customer._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50 transition-colors duration-150`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer._id)}
                          onChange={() => handleSelectCustomer(customer._id)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <button 
                          onClick={() => onViewDetails(customer._id)}
                          className="text-teal-600 hover:text-teal-800 hover:underline focus:outline-none"
                        >
                          {customer.customId || customer._id.slice(-6)}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            {customer.avatar ? (
                              <Image
                                src={customer.avatar}
                                alt={customer.fullname}
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-500">
                                  {customer.fullname.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            {isUserOnline(customer._id) && (
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{customer.fullname}</div>
                            <div className="text-xs text-gray-500 sm:hidden">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">{customer.totalOrders || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">
                            {formatCurrency(customer.totalSpent || 0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          customer.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {customer.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewDetails(customer._id)}
                            className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 p-4 rounded-full bg-slate-100">
                          <AlertCircle size={32} className="text-slate-400" />
                        </div>
                        <p className="text-lg font-medium text-slate-800 mb-1">Không tìm thấy khách hàng</p>
                        <p className="text-slate-500">Hiện tại chưa có khách hàng nào trong hệ thống</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="flex flex-wrap justify-between items-center">
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
  );
}