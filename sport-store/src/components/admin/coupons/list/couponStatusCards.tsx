import React from "react";
import { Percent, CalendarX, Power, Clock } from "lucide-react";
import { Coupon } from "@/types/coupon";

interface CouponStatusCardsProps {
  coupons: Coupon[];
}

export default function CouponStatusCards({ coupons }: CouponStatusCardsProps) {
  // Helper function to check coupon status
  const isStatus = (status: string, targetStatus: string) =>
    status.toLowerCase() === targetStatus.toLowerCase();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Coupons */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tổng Mã Giảm Giá</p>
              <p className="text-3xl font-bold text-slate-800">{coupons.length}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Percent size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Coupons */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Đang Hoạt Động</p>
              <p className="text-3xl font-bold text-slate-800">
                {coupons.filter((coupon) => isStatus(coupon.status, "Hoạt động")).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
              <Power size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Paused Coupons */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tạm Dừng</p>
              <p className="text-3xl font-bold text-slate-800">
                {coupons.filter((coupon) => isStatus(coupon.status, "Tạm Dừng")).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Expired Coupons */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Hết Hạn</p>
              <p className="text-3xl font-bold text-slate-800">
                {coupons.filter((coupon) => isStatus(coupon.status, "Hết hạn")).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
              <CalendarX size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 