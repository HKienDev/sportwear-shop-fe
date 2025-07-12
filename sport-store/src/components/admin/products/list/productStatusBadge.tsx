import React, { useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, PauseCircle, Package, TrendingUp, Star } from "lucide-react";

export function getStatusConfig(isActive: boolean, stock: number): {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  text: string;
  gradient: string;
} {
  if (!isActive) {
    return {
      color: "text-slate-700",
      bgColor: "bg-slate-50/80",
      borderColor: "border-slate-200/60",
      gradient: "from-slate-400/20 to-gray-400/20",
      icon: <PauseCircle size={14} className="text-slate-600" />,
      text: "Ngừng bán"
    };
  }
  
  if (stock <= 0) {
    return {
      color: "text-rose-700",
      bgColor: "bg-rose-50/80",
      borderColor: "border-rose-200/60",
      gradient: "from-rose-400/20 to-red-400/20",
      icon: <XCircle size={14} className="text-rose-600" />,
      text: "Hết hàng"
    };
  }
  
  if (stock <= 10) {
    return {
      color: "text-amber-700",
      bgColor: "bg-amber-50/80",
      borderColor: "border-amber-200/60",
      gradient: "from-amber-400/20 to-orange-400/20",
      icon: <AlertTriangle size={14} className="text-amber-600" />,
      text: "Sắp hết"
    };
  }
  
  return {
    color: "text-emerald-700",
    bgColor: "bg-emerald-50/80",
    borderColor: "border-emerald-200/60",
    gradient: "from-emerald-400/20 to-green-400/20",
    icon: <CheckCircle size={14} className="text-emerald-600" />,
    text: "Đang bán"
  };
}

interface ProductStatusBadgeProps {
  isActive: boolean;
  stock: number;
  showIcon?: boolean;
  className?: string;
}

export default function ProductStatusBadge({ isActive, stock, showIcon = true, className = "" }: ProductStatusBadgeProps) {
  const memoizedGetStatusConfig = useCallback(() => getStatusConfig(isActive, stock), [isActive, stock]);
  const config = memoizedGetStatusConfig();

  return (
    <div className={`group relative inline-flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${config.bgColor} ${config.borderColor} ${config.color} ${className}`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
        {showIcon && (
          <div className="flex items-center justify-center w-5 h-5">
            {config.icon}
          </div>
        )}
        <span className="text-sm font-semibold whitespace-nowrap">
          {config.text}
        </span>
      </div>
      
      {/* Animated Dot */}
      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} animate-pulse`}></div>
    </div>
  );
} 