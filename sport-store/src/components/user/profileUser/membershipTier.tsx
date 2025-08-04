"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface MembershipTierProps {
  totalSpent?: number;
}

interface TierInfo {
  name: string;
  minSpent: number;
  maxSpent: number;
  color: string;
  icon: React.ReactNode;
  benefits: string[];
  nextTier?: string;
  nextTierAmount?: number;
  gradient: string;
}

const tiers: TierInfo[] = [
  {
    name: "Đồng",
    minSpent: 0,
    maxSpent: 2000000,
    color: "#9C7F7F",
    gradient: "from-[#9C7F7F] to-[#B39B9B]",
    icon: <Crown className="w-6 h-6 text-[#9C7F7F]" />,
    benefits: [
      "Giảm giá 5% cho đơn hàng đầu tiên",
      "Miễn phí vận chuyển cho đơn hàng trên 500.000đ",
      "Tích điểm 1% trên tổng đơn hàng"
    ],
    nextTier: "Bạc",
    nextTierAmount: 2000000
  },
  {
    name: "Bạc",
    minSpent: 2000000,
    maxSpent: 5000000,
    color: "#797979",
    gradient: "from-[#797979] to-[#8F8F8F]",
    icon: <Crown className="w-6 h-6 text-[#797979]" />,
    benefits: [
      "Giảm giá 7% cho tất cả đơn hàng",
      "Miễn phí vận chuyển cho mọi đơn hàng",
      "Tích điểm 2% trên tổng đơn hàng",
      "Ưu tiên xử lý đơn hàng"
    ],
    nextTier: "Vàng",
    nextTierAmount: 5000000
  },
  {
    name: "Vàng",
    minSpent: 5000000,
    maxSpent: 10000000,
    color: "#FFBE00",
    gradient: "from-[#FFBE00] to-[#FFD700]",
    icon: <Crown className="w-6 h-6 text-[#FFBE00]" />,
    benefits: [
      "Giảm giá 10% cho tất cả đơn hàng",
      "Miễn phí vận chuyển nhanh",
      "Tích điểm 3% trên tổng đơn hàng",
      "Ưu tiên xử lý đơn hàng",
      "Quà tặng sinh nhật đặc biệt"
    ],
    nextTier: "Bạch Kim",
    nextTierAmount: 10000000
  },
  {
    name: "Bạch Kim",
    minSpent: 10000000,
    maxSpent: 50000000,
    color: "#4EB09D",
    gradient: "from-[#4EB09D] to-[#5BC4B0]",
    icon: <Crown className="w-6 h-6 text-[#4EB09D]" />,
    benefits: [
      "Giảm giá 12% cho tất cả đơn hàng",
      "Miễn phí vận chuyển nhanh",
      "Tích điểm 4% trên tổng đơn hàng",
      "Ưu tiên xử lý đơn hàng cao cấp",
      "Quà tặng sinh nhật đặc biệt",
      "Được mời tham dự các sự kiện đặc biệt"
    ],
    nextTier: "Kim Cương",
    nextTierAmount: 50000000
  },
  {
    name: "Kim Cương",
    minSpent: 50000000,
    maxSpent: Infinity,
    color: "#7C54F3",
    gradient: "from-[#7C54F3] to-[#8F6FF3]",
    icon: <Crown className="w-6 h-6 text-[#7C54F3]" />,
    benefits: [
      "Giảm giá 15% cho tất cả đơn hàng",
      "Miễn phí vận chuyển nhanh",
      "Tích điểm 5% trên tổng đơn hàng",
      "Ưu tiên xử lý đơn hàng VIP",
      "Quà tặng sinh nhật đặc biệt",
      "Được mời tham dự các sự kiện đặc biệt",
      "Có riêng tư vấn viên chăm sóc",
      "Được test sản phẩm mới trước khi ra mắt"
    ]
  }
];

export default function MembershipTier({ totalSpent = 0 }: MembershipTierProps) {
  // Use >= logic to match backend behavior
  let currentTier = tiers[0]; // Default to Đồng
  
  if (totalSpent >= 50000000) {
    currentTier = tiers[4]; // Kim Cương
  } else if (totalSpent >= 10000000) {
    currentTier = tiers[3]; // Bạch Kim
  } else if (totalSpent >= 5000000) {
    currentTier = tiers[2]; // Vàng
  } else if (totalSpent >= 2000000) {
    currentTier = tiers[1]; // Bạc
  } else {
    currentTier = tiers[0]; // Đồng
  }

  const nextTier = tiers.find(tier => tier.minSpent > currentTier.minSpent);
  const nextTierAmount = nextTier ? nextTier.minSpent - totalSpent : 0;

  const progress = nextTier 
    ? Math.min(100, (totalSpent - currentTier.minSpent) / (nextTier.minSpent - currentTier.minSpent) * 100)
    : 100;

  return (
    <Card className="relative overflow-hidden p-3 sm:p-4 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl border border-gray-100 w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px]" />
      </div>

      {/* Header Section */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${currentTier.gradient} opacity-5 rounded-lg blur-xl`} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 rounded-lg bg-[${currentTier.color}] bg-opacity-10 ring-2 ring-offset-2 ring-white shadow-lg flex-shrink-0`}>
              {currentTier.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold truncate" style={{ color: currentTier.color }}>
                {currentTier.name}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                Tổng chi tiêu: <span className="font-semibold" style={{ color: currentTier.color }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSpent)}
                </span>
              </p>
            </div>
          </div>
          <Badge 
            className="text-xs px-3 sm:px-4 py-1 font-medium shadow-lg self-start sm:self-auto"
            style={{ 
              backgroundColor: currentTier.color,
              color: 'white'
            }}
          >
            {currentTier.name}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mt-3 sm:mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-gray-700 truncate">Tiến độ đến {nextTier?.name || 'hạng cao nhất'}</span>
          <span className="font-semibold flex-shrink-0 ml-2" style={{ color: currentTier.color }}>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full shadow-inner">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(to right, ${currentTier.color}, ${currentTier.color}80)`
            }}
          />
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-3 sm:mt-4 space-y-2">
        <h4 className="font-bold text-sm" style={{ color: currentTier.color }}>
          Quyền lợi thành viên
        </h4>
        <ul className="grid gap-2">
          {currentTier.benefits.map((benefit, index) => (
            <li key={index} className="group flex items-start gap-2 sm:gap-3 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className={`p-1 rounded-md bg-[${currentTier.color}] bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200 ring-2 ring-offset-2 ring-white flex-shrink-0`}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: currentTier.color }} />
              </div>
              <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors duration-200 flex-1 leading-relaxed">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next tier info */}
      {nextTier && (
        <div className="mt-3 sm:mt-4 p-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 rounded-md flex-shrink-0" style={{ backgroundColor: `${currentTier.color}20` }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTier.color }} />
            </div>
            <h4 className="font-semibold text-sm text-gray-800 truncate">Hạng tiếp theo: {nextTier.name}</h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Cần chi thêm <span className="font-semibold" style={{ color: currentTier.color }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(nextTierAmount)}
            </span> 
            để đạt được {nextTier.name}
          </p>
        </div>
      )}
    </Card>
  );
}