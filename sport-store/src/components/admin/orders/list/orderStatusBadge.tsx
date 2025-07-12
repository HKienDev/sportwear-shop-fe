import React, { useCallback } from "react";
import { Clock, CheckCircle, Truck, Package, XCircle, AlertCircle } from "lucide-react";

export function getStatusConfig(status: string): {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  text: string;
  gradient: string;
} {
  switch (status) {
    case "pending":
      return {
        color: "text-amber-700",
        bgColor: "bg-amber-50/80",
        borderColor: "border-amber-200/60",
        gradient: "from-amber-400/20 to-orange-400/20",
        icon: <Clock size={14} className="text-amber-600" />,
        text: "Chờ xác nhận"
      };
    case "confirmed":
      return {
        color: "text-blue-700",
        bgColor: "bg-blue-50/80",
        borderColor: "border-blue-200/60",
        gradient: "from-blue-400/20 to-indigo-400/20",
        icon: <CheckCircle size={14} className="text-blue-600" />,
        text: "Đã xác nhận"
      };
    case "processing":
      return {
        color: "text-indigo-700",
        bgColor: "bg-indigo-50/80",
        borderColor: "border-indigo-200/60",
        gradient: "from-indigo-400/20 to-purple-400/20",
        icon: <Package size={14} className="text-indigo-600" />,
        text: "Đang xử lý"
      };
    case "shipped":
      return {
        color: "text-purple-700",
        bgColor: "bg-purple-50/80",
        borderColor: "border-purple-200/60",
        gradient: "from-purple-400/20 to-pink-400/20",
        icon: <Truck size={14} className="text-purple-600" />,
        text: "Đang giao hàng"
      };
    case "delivered":
      return {
        color: "text-emerald-700",
        bgColor: "bg-emerald-50/80",
        borderColor: "border-emerald-200/60",
        gradient: "from-emerald-400/20 to-green-400/20",
        icon: <CheckCircle size={14} className="text-emerald-600" />,
        text: "Đã giao hàng"
      };
    case "cancelled":
      return {
        color: "text-rose-700",
        bgColor: "bg-rose-50/80",
        borderColor: "border-rose-200/60",
        gradient: "from-rose-400/20 to-red-400/20",
        icon: <XCircle size={14} className="text-rose-600" />,
        text: "Đã hủy"
      };
    default:
      return {
        color: "text-slate-700",
        bgColor: "bg-slate-50/80",
        borderColor: "border-slate-200/60",
        gradient: "from-slate-400/20 to-gray-400/20",
        icon: <AlertCircle size={14} className="text-slate-600" />,
        text: "Không rõ trạng thái"
      };
  }
}

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export default function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  const memoizedGetStatusConfig = useCallback(() => getStatusConfig(status), [status]);
  const config = memoizedGetStatusConfig();

  return (
    <div className={`group relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${config.bgColor} ${config.borderColor} ${config.color} ${className}`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5">
          {config.icon}
        </div>
        <span className="text-sm font-semibold whitespace-nowrap">
          {config.text}
        </span>
      </div>
      
      {/* Animated Dot */}
      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} animate-pulse`}></div>
    </div>
  );
}