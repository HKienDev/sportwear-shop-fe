import React from "react";
import { Star, TrendingUp, ThumbsUp } from "lucide-react";
import { AdminReview } from "@/services/adminReviewService";

interface ReviewStatusCardsProps {
  reviews: AdminReview[];
  stats: {
    total: number;
    averageRating: number;
    totalHelpful: number;
  };
}

export function ReviewStatusCards({ reviews, stats }: ReviewStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Reviews */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tổng Đánh Giá</p>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Star size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl transform -rotate-1 transition-transform duration-300 group-hover:-rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Đánh Giá Trung Bình</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Total Helpful */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl transform rotate-1 transition-transform duration-300 group-hover:rotate-2"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Tổng Lượt Hữu Ích</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.totalHelpful}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <ThumbsUp size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 