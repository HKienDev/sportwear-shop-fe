'use client';

import { useState } from 'react';
import type { RevenueData } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface RevenueChartProps {
  data: RevenueData[];
  lastUpdated: string;
  months: number;
  isLoading?: boolean;
  onPeriodChange?: (months: number) => void;
}

export default function RevenueChart({ 
  data = [], 
  lastUpdated,
  months,
  isLoading = false,
  onPeriodChange
}: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'month' | 'year'>('month');
  const totalRevenue = Array.isArray(data) ? data.reduce((sum, item) => sum + item.revenue, 0) : 0;

  if (isLoading && !data.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Chart Skeleton */}
        <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-400">Đang tải biểu đồ...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(data) || !data.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col items-center justify-center py-8 text-gray-500">
        <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm">Không có dữ liệu doanh thu</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tổng Doanh Thu</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-[#4EB09D]">{formatCurrency(totalRevenue)} VND</p>
            <span className="text-sm text-gray-500">
              (Cập nhật: {new Date(lastUpdated).toLocaleString('vi-VN')})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => {
              setSelectedPeriod('day');
              onPeriodChange?.(30);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === 'day'
                ? 'bg-[#4EB09D] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => {
              setSelectedPeriod('month');
              onPeriodChange?.(6);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-[#4EB09D] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            6 tháng
          </button>
          <button
            onClick={() => {
              setSelectedPeriod('year');
              onPeriodChange?.(12);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === 'year'
                ? 'bg-[#4EB09D] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            1 năm
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                padding: '12px'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Doanh Thu']}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4EB09D"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: '#4EB09D',
                strokeWidth: 2,
                stroke: 'white'
              }}
              activeDot={{
                r: 6,
                fill: '#4EB09D',
                strokeWidth: 2,
                stroke: 'white'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 