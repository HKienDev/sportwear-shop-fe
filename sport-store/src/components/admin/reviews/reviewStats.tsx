"use client";

import React from "react";
import { Star, TrendingUp, ThumbsUp } from "lucide-react";
import { ReviewStats as ReviewStatsType } from "@/services/adminReviewService";

interface ReviewStatsProps {
  stats: ReviewStatsType;
  isLoading?: boolean;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Handle case when stats is undefined or null
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Tổng số đánh giá",
      value: stats.total,
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Đánh giá trung bình",
      value: stats.averageRating ? stats.averageRating.toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Tổng lượt hữu ích",
      value: stats.totalHelpful,
      icon: ThumbsUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-lg shadow-sm border ${card.borderColor} p-4 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          

        </div>
      ))}
    </div>
  );
};

export default ReviewStats; 