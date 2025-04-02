"use client";

import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import type { BestSellingProduct } from '@/types/dashboard';

interface BestSellingProductsProps {
  products: BestSellingProduct[];
  lastUpdated: string;
  days: number;
  isLoading?: boolean;
  onPeriodChange?: (days: number) => void;
}

export default function BestSellingProducts({ 
  products = [], 
  lastUpdated,
  days,
  isLoading = false,
  onPeriodChange
}: BestSellingProductsProps) {
  if (isLoading && !products.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col items-center justify-center py-8 text-gray-500">
        <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-sm">Không có sản phẩm bán chạy</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Cập nhật: {new Date(lastUpdated).toLocaleString('vi-VN')}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => onPeriodChange?.(7)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              days === 7
                ? 'bg-[#4EB09D] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => onPeriodChange?.(30)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              days === 30
                ? 'bg-[#4EB09D] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => onPeriodChange?.(90)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              days === 90
                ? 'bg-[#4EB09D] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            90 ngày
          </button>
        </div>
      </div>

      {/* Products List */}
      {products.map((product, index) => (
        <Link
          key={product._id}
          href={`/admin/products/${product._id}`}
          className="block group"
        >
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex-shrink-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <span className="text-xs font-medium text-[#4EB09D]">
                  #{index + 1}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {product.category}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  Đã bán {product.totalSales}
                </span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {formatCurrency(product.totalRevenue)}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <p className="text-sm font-medium text-[#4EB09D]">
                {formatCurrency(product.averagePrice)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}