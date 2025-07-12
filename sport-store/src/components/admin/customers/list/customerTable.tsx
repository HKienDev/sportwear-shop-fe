'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Customer } from '@/types/customer';
import { Eye, Mail, Phone, Trash2, ShoppingBag, CreditCard, AlertCircle, Power } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomerStatusBadge from './customerStatusBadge';

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers?: string[];
  onSelectCustomer: (customerId: string) => void;
  onSelectAll: () => void;
  onDelete: (id: string) => Promise<void>;
  onViewDetails: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

// Thêm thuộc tính totalOrders vào interface Customer
declare module '@/types/customer' {
  interface Customer {
    totalOrders?: number;
    deliveredOrders?: number;
  }
}

export function CustomerTable({
  customers = [],
  selectedCustomers,
  onSelectCustomer,
  onSelectAll,
  onDelete,
  onViewDetails,
  onToggleStatus,
}: CustomerTableProps) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setLocalCustomers(customers);
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(localCustomers)) return [];
    return localCustomers;
  }, [localCustomers]);

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

  const handleDelete = (id: string) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await onDelete(customerToDelete);
      toast.success("Đã xóa khách hàng thành công");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setCustomerToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    return "Đã xảy ra lỗi không xác định";
  };

  const handleToggleStatus = async (customer: Customer) => {
    const id = `VJUSPORTUSER-${customer._id.slice(0, 8)}`;
    setIsUpdating(prev => ({ ...prev, [id]: true }));
    // Cập nhật localCustomers ngay trên UI
    setLocalCustomers(prev => prev.map(c => c._id === customer._id ? { ...c, isActive: !customer.isActive } : c));
    try {
      if (typeof onToggleStatus === 'function') {
        await onToggleStatus(id);
        toast.success(customer.isActive ? "Đã khóa tài khoản thành công" : "Đã mở khóa tài khoản thành công");
      }
    } catch (error) {
      // Nếu lỗi, hoàn tác lại trạng thái
      setLocalCustomers(prev => prev.map(c => c._id === customer._id ? { ...c, isActive: customer.isActive } : c));
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Không thể thay đổi trạng thái khách hàng");
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
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

  return (
    <div className="space-y-6">
      {/* Table Container with Enhanced Glass Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-3xl transform rotate-1"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-3xl transform -rotate-1"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/60">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedCustomers?.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={onSelectAll}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32 whitespace-nowrap">Mã Thành Viên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-64 whitespace-nowrap">Tên Khách Hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-56">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-48">Số Điện Thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-56 whitespace-nowrap">Tổng Đơn Hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-56 whitespace-nowrap">Tổng Chi Tiêu</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-52 whitespace-nowrap">Trạng Thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-44 whitespace-nowrap">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <tr key={customer._id} className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-emerald-50/50 transition-all duration-300 ${
                      index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'
                    }`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers?.includes(customer._id) || false}
                          onChange={() => onSelectCustomer(customer._id)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        <span
                          className="cursor-pointer hover:text-indigo-600 transition-colors"
                          title="Xem chi tiết khách hàng"
                          onClick={() => onViewDetails(`VJUSPORTUSER-${customer._id.slice(0, 8)}`)}
                        >
                          {customer._id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
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
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {customer.fullname.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            {isUserOnline(customer._id) && (
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                            )}
                          </div>
                          <div>
                            <div
                              className="font-semibold text-slate-800 whitespace-nowrap cursor-pointer hover:text-indigo-600 transition-colors"
                              title="Xem chi tiết khách hàng"
                              onClick={() => onViewDetails(`VJUSPORTUSER-${customer._id.slice(0, 8)}`)}
                            >
                              {customer.fullname}
                            </div>
                            <div className="text-xs text-slate-500 sm:hidden">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" />
                          <span className="text-sm text-slate-700">{customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-slate-400" />
                          <span className="text-sm text-slate-700">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={16} className="text-slate-400" />
                          <span className="text-sm font-semibold text-slate-800">{customer.deliveredOrders || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-slate-400" />
                          <span className="text-sm font-semibold text-slate-800">
                            {formatCurrency(customer.totalSpent || 0)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <CustomerStatusBadge isActive={customer.isActive} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onViewDetails(`VJUSPORTUSER-${customer._id.slice(0, 8)}`)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(customer)}
                            disabled={isUpdating[`VJUSPORTUSER-${customer._id.slice(0, 8)}`]}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                              customer.isActive 
                                ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                                : "bg-green-100 text-green-600 hover:bg-green-200"
                            } transition-all duration-200 disabled:opacity-50`}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(`VJUSPORTUSER-${customer._id.slice(0, 8)}`)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all duration-200"
                          >
                            <Trash2 size={16} />
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-indigo-100/60 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800 font-bold">Xác nhận xóa khách hàng</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}