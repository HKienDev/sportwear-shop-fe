import React, { useCallback } from "react";
import { CheckCircle, PauseCircle } from "lucide-react";

export function getCategoryStatusConfig(status: string): {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  text: string;
  gradient: string;
} {
  if (status === "active") {
    return {
      color: "text-emerald-700",
      bgColor: "bg-emerald-50/80",
      borderColor: "border-emerald-200/60",
      gradient: "from-emerald-400/20 to-green-400/20",
      icon: <CheckCircle size={14} className="text-emerald-600" />,
      text: "Đang hoạt động"
    };
  }
  if (status === "inactive") {
    return {
      color: "text-slate-700",
      bgColor: "bg-slate-50/80",
      borderColor: "border-slate-200/60",
      gradient: "from-slate-400/20 to-gray-400/20",
      icon: <PauseCircle size={14} className="text-slate-600" />,
      text: "Không hoạt động"
    };
  }
  return {
    color: "text-gray-500",
    bgColor: "bg-gray-50/80",
    borderColor: "border-gray-200/60",
    gradient: "from-gray-400/20 to-slate-400/20",
    icon: <PauseCircle size={14} className="text-gray-400" />,
    text: "Không rõ trạng thái"
  };
}

interface CategoryStatusBadgeProps {
  status: string;
  showIcon?: boolean;
  className?: string;
}

export default function CategoryStatusBadge({ status, showIcon = true, className = "" }: CategoryStatusBadgeProps) {
  const memoizedGetStatusConfig = useCallback(() => getCategoryStatusConfig(status), [status]);
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