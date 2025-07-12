import React from "react";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerStatusCardsProps {
  customers: Customer[];
}

export function CustomerStatusCards({ customers }: CustomerStatusCardsProps) {
  // Helper function to check if customer is active
  const isActive = (customer: Customer) => customer.isActive;

  // Helper function to check if customer is new (created this month)
  const isNewCustomer = (customer: Customer) => {
    const createdAt = new Date(customer.createdAt);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && 
           createdAt.getFullYear() === now.getFullYear();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Customers */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tổng Khách Hàng</p>
              <p className="text-3xl font-bold text-slate-800">{customers.length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Customers */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Hoạt Động</p>
              <p className="text-3xl font-bold text-slate-800">
                {customers.filter(isActive).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
              <UserCheck size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Inactive Customers */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Không Hoạt Động</p>
              <p className="text-3xl font-bold text-slate-800">
                {customers.filter(customer => !isActive(customer)).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <UserX size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* New Customers */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Khách Hàng Mới</p>
              <p className="text-3xl font-bold text-slate-800">
                {customers.filter(isNewCustomer).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
              <UserPlus size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 