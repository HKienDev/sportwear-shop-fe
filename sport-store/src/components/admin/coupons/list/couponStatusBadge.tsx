import React, { useCallback } from "react";
import { CheckCircle, Power, PauseCircle, Clock, XCircle } from "lucide-react";

// Mapping status từ backend (tiếng Việt) và frontend (tiếng Anh)
const STATUS_MAPPING: Record<string, string> = {
  // Backend status (tiếng Việt)
  "Hoạt động": "active",
  "Tạm Dừng": "inactive", 
  "Hết hạn": "expired",
  // Frontend status (tiếng Anh)
  "active": "active",
  "inactive": "inactive",
  "expired": "expired",
  "paused": "paused",
  "upcoming": "upcoming"
};

export function getCouponStatusConfig(status: string): {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  text: string;
  gradient: string;
} {
  // Normalize status
  const normalizedStatus = STATUS_MAPPING[status] || status;
  
  switch (normalizedStatus) {
    case "active":
      return {
        color: "text-emerald-700",
        bgColor: "bg-emerald-50/80",
        borderColor: "border-emerald-200/60",
        gradient: "from-emerald-400/20 to-green-400/20",
        icon: <CheckCircle size={14} className="text-emerald-600" />,
        text: "Hoạt động"
      };
    case "inactive":
      return {
        color: "text-rose-700",
        bgColor: "bg-rose-50/80",
        borderColor: "border-rose-200/60",
        gradient: "from-rose-400/20 to-pink-400/20",
        icon: <Power size={14} className="text-rose-500" />,
        text: "Tạm dừng"
      };
    case "expired":
      return {
        color: "text-gray-600",
        bgColor: "bg-gray-100/80",
        borderColor: "border-gray-200/60",
        gradient: "from-gray-400/20 to-slate-400/20",
        icon: <XCircle size={14} className="text-gray-400" />,
        text: "Hết hạn"
      };
    case "upcoming":
      return {
        color: "text-blue-700",
        bgColor: "bg-blue-50/80",
        borderColor: "border-blue-200/60",
        gradient: "from-blue-400/20 to-cyan-400/20",
        icon: <Clock size={14} className="text-blue-500" />,
        text: "Sắp diễn ra"
      };
    case "paused":
      return {
        color: "text-yellow-700",
        bgColor: "bg-yellow-50/80",
        borderColor: "border-yellow-200/60",
        gradient: "from-yellow-400/20 to-orange-400/20",
        icon: <PauseCircle size={14} className="text-yellow-500" />,
        text: "Tạm dừng"
      };
    default:
      return {
        color: "text-slate-700",
        bgColor: "bg-slate-50/80",
        borderColor: "border-slate-200/60",
        gradient: "from-slate-400/20 to-slate-200/20",
        icon: <CheckCircle size={14} className="text-slate-400" />,
        text: status
      };
  }
}

interface CouponStatusBadgeProps {
  status: string;
  showIcon?: boolean;
  className?: string;
}

export default function CouponStatusBadge({ status, showIcon = true, className = "" }: CouponStatusBadgeProps) {
  const memoizedGetStatusConfig = useCallback(() => getCouponStatusConfig(status), [status]);
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