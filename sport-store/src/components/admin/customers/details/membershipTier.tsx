"use client";

import { Badge } from "@/components/ui/badge";
import { 
  Crown,
  Sparkles,
  TrendingUp,
  Gift
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
  bgGradient: string;
}

const tiers: TierInfo[] = [
  {
    name: "Hạng Sắt",
    minSpent: 0,
    maxSpent: 5000000,
    color: "#9C7F7F",
    gradient: "from-[#9C7F7F] to-[#B39B9B]",
    bgGradient: "from-slate-50 to-slate-100",
    icon: <Crown className="w-5 h-5 text-[#9C7F7F]" />,
    benefits: [
      "Giảm giá 5% cho đơn hàng đầu tiên",
      "Miễn phí vận chuyển cho đơn hàng trên 500.000đ",
      "Tích điểm 1% trên tổng đơn hàng"
    ],
    nextTier: "Hạng Bạc",
    nextTierAmount: 5000000
  },
  {
    name: "Hạng Bạc",
    minSpent: 5000000,
    maxSpent: 20000000,
    color: "#797979",
    gradient: "from-[#797979] to-[#8F8F8F]",
    bgGradient: "from-slate-50 to-gray-100",
    icon: <Crown className="w-5 h-5 text-[#797979]" />,
    benefits: [
      "Giảm giá 7% cho tất cả đơn hàng",
      "Miễn phí vận chuyển cho mọi đơn hàng",
      "Tích điểm 2% trên tổng đơn hàng",
      "Ưu tiên xử lý đơn hàng"
    ],
    nextTier: "Hạng Vàng",
    nextTierAmount: 20000000
  },
  {
    name: "Hạng Vàng",
    minSpent: 20000000,
    maxSpent: 30000000,
    color: "#FFBE00",
    gradient: "from-[#FFBE00] to-[#FFD700]",
    bgGradient: "from-amber-50 to-yellow-100",
    icon: <Crown className="w-5 h-5 text-[#FFBE00]" />,
    benefits: [
      "Giảm giá 10% cho tất cả đơn hàng",
      "Miễn phí vận chuyển nhanh",
      "Tích điểm 3% trên tổng đơn hàng",
      "Ưu tiên xử lý đơn hàng",
      "Quà tặng sinh nhật đặc biệt"
    ],
    nextTier: "Hạng Bạch Kim",
    nextTierAmount: 30000000
  },
  {
    name: "Hạng Bạch Kim",
    minSpent: 30000000,
    maxSpent: 50000000,
    color: "#4EB09D",
    gradient: "from-[#4EB09D] to-[#5BC4B0]",
    bgGradient: "from-teal-50 to-cyan-100",
    icon: <Crown className="w-5 h-5 text-[#4EB09D]" />,
    benefits: [
      "Giảm giá 12% cho tất cả đơn hàng",
      "Miễn phí vận chuyển nhanh",
      "Tích điểm 4% trên tổng đơn hàng",
      "Ưu tiên xử lý đơn hàng cao cấp",
      "Quà tặng sinh nhật đặc biệt",
      "Được mời tham dự các sự kiện đặc biệt"
    ],
    nextTier: "Hạng Kim Cương",
    nextTierAmount: 50000000
  },
  {
    name: "Hạng Kim Cương",
    minSpent: 50000000,
    maxSpent: Infinity,
    color: "#7C54F3",
    gradient: "from-[#7C54F3] to-[#8F6FF3]",
    bgGradient: "from-purple-50 to-violet-100",
    icon: <Crown className="w-5 h-5 text-[#7C54F3]" />,
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
  // Tính toán hạng thành viên dựa trên totalSpent
  const currentTier = tiers.find(tier => 
    totalSpent >= tier.minSpent && totalSpent < tier.maxSpent
  ) || tiers[0];

  // Tính toán hạng tiếp theo
  const nextTier = tiers.find(tier => tier.minSpent > currentTier.minSpent);
  const nextTierAmount = nextTier ? nextTier.minSpent - totalSpent : 0;

  // Tính phần trăm tiến độ đến hạng tiếp theo
  const progress = nextTier 
    ? Math.min(100, (totalSpent - currentTier.minSpent) / (nextTier.minSpent - currentTier.minSpent) * 100)
    : 100;

  return (
    <div className={`bg-gradient-to-br ${currentTier.bgGradient} rounded-2xl shadow-sm border border-slate-200 overflow-hidden`}>
      {/* Header Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200`}>
              {currentTier.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: currentTier.color }}>
                {currentTier.name}
              </h3>
              <p className="text-sm text-slate-600">
                Tổng chi tiêu: <span className="font-semibold" style={{ color: currentTier.color }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSpent)}
                </span>
              </p>
            </div>
          </div>
          <Badge 
            className="text-xs px-3 py-1 font-medium shadow-sm border-0"
            style={{ 
              backgroundColor: currentTier.color,
              color: 'white'
            }}
          >
            {currentTier.name}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-700">Tiến độ đến {nextTier?.name || 'hạng cao nhất'}</span>
            <span className="font-semibold" style={{ color: currentTier.color }}>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white rounded-full shadow-inner border border-slate-200">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(to right, ${currentTier.color}, ${currentTier.color}80)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-4 h-4" style={{ color: currentTier.color }} />
          <h4 className="font-semibold text-sm text-slate-800">
            Quyền lợi thành viên
          </h4>
        </div>
        
        <div className="space-y-3">
          {currentTier.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
              <div className={`p-1 rounded-lg bg-opacity-10 flex-shrink-0`} style={{ backgroundColor: `${currentTier.color}20` }}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: currentTier.color }} />
              </div>
              <span className="text-xs text-slate-700 leading-relaxed">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Next tier info */}
        {nextTier && (
          <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded-lg" style={{ backgroundColor: `${currentTier.color}20` }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentTier.color }} />
              </div>
              <h4 className="font-semibold text-sm text-slate-800">Hạng tiếp theo: {nextTier.name}</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cần chi thêm <span className="font-semibold" style={{ color: currentTier.color }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(nextTierAmount)}
              </span> 
              để đạt được {nextTier.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 