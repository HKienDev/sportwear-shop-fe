import React, { useCallback } from "react";
import { CheckCircle, Power } from "lucide-react";

export function getCustomerStatusConfig(isActive: boolean): {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  text: string;
  gradient: string;
} {
  if (isActive) {
    return {
      color: "text-emerald-700",
      bgColor: "bg-emerald-50/80",
      borderColor: "border-emerald-200/60",
      gradient: "from-emerald-400/20 to-green-400/20",
      icon: <CheckCircle size={14} className="text-emerald-600" />,
      text: "Hoạt động"
    };
  }
  return {
    color: "text-rose-700",
    bgColor: "bg-rose-50/80",
    borderColor: "border-rose-200/60",
    gradient: "from-rose-400/20 to-pink-400/20",
    icon: <Power size={14} className="text-rose-500" />,
    text: "Bị khóa"
  };
}

interface CustomerStatusBadgeProps {
  isActive: boolean;
  showIcon?: boolean;
  className?: string;
}

export default function CustomerStatusBadge({ isActive, showIcon = true, className = "" }: CustomerStatusBadgeProps) {
  const memoizedGetStatusConfig = useCallback(() => getCustomerStatusConfig(isActive), [isActive]);
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