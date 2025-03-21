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
    name: "Hạng Sắt",
    minSpent: 0,
    maxSpent: 5000000,
    color: "#9C7F7F",
    gradient: "from-[#9C7F7F] to-[#B39B9B]",
    icon: <Crown className="w-6 h-6 text-[#9C7F7F]" />,
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
    icon: <Crown className="w-6 h-6 text-[#797979]" />,
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
    icon: <Crown className="w-6 h-6 text-[#FFBE00]" />,
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
    icon: <Crown className="w-6 h-6 text-[#4EB09D]" />,
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
  const currentTier = tiers.find(tier => 
    totalSpent >= tier.minSpent && totalSpent < tier.maxSpent
  ) || tiers[tiers.length - 1];

  return (
    <Card className="relative overflow-hidden p-5 space-y-4 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl border border-gray-100 lg:w-1/3 w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px]" />
      </div>

      {/* Header Section */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${currentTier.gradient} opacity-5 rounded-lg blur-xl`} />
        <div className="relative flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md bg-[${currentTier.color}] bg-opacity-10 ring-2 ring-offset-2 ring-white shadow-lg`}>
              {currentTier.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: currentTier.color }}>
                {currentTier.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Tổng chi tiêu: <span className="font-medium" style={{ color: currentTier.color }}>{totalSpent.toLocaleString('vi-VN')}đ</span>
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-0 shadow-lg px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: currentTier.color, color: 'white' }}>
            {currentTier.name}
          </Badge>
        </div>
      </div>

      {/* Tier Progress Bar */}
      <div className="relative h-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-2 bg-gray-100 rounded-full shadow-inner" />
          {/* Progress Bar Fill */}
          <div 
            className="absolute h-2 bg-gradient-to-r rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: currentTier.name === "Hạng Kim Cương" ? "100%" : `${((totalSpent - currentTier.minSpent) / (currentTier.nextTierAmount! - currentTier.minSpent)) * 100}%`,
              background: `linear-gradient(to right, ${currentTier.color}, ${currentTier.color}80)`
            }}
          />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative space-y-3">
        <h4 className="font-bold text-base" style={{ color: currentTier.color }}>
          Quyền lợi thành viên
        </h4>
        <ul className="grid gap-2">
          {currentTier.benefits.map((benefit, index) => (
            <li key={index} className="group flex items-start gap-2 p-1.5 rounded-md bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className={`p-1 rounded-sm bg-[${currentTier.color}] bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200 ring-2 ring-offset-2 ring-white`}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentTier.color }} />
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-gray-900 transition-colors duration-200 font-medium">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Tier Section */}
      {currentTier.nextTierAmount && (
        <div className="relative p-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-md border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-sm" style={{ backgroundColor: `${currentTier.color}20` }}>
              <TrendingUp className="w-3.5 h-3.5" style={{ color: currentTier.color }} />
            </div>
            <p className="text-xs">
              Cần chi thêm <span className="font-bold" style={{ color: currentTier.color }}>{(currentTier.nextTierAmount - totalSpent).toLocaleString('vi-VN')}đ</span> 
              để đạt <span className="font-bold" style={{ color: currentTier.color }}>{currentTier.nextTier}</span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
} 