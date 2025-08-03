"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Gift, Clock, Percent, Sparkles, ArrowRight, Star, Tag } from 'lucide-react';
import Link from 'next/link';

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumPurchaseAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const PromotionsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, searchTerm, selectedFilter]);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons/public?status=active&limit=50');
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched coupons:', data.data.coupons);
        if (data.data.coupons && data.data.coupons.length > 0) {
          console.log('Sample coupon endDate:', data.data.coupons[0].endDate);
          console.log('Sample coupon startDate:', data.data.coupons[0].startDate);
        }
        setCoupons(data.data.coupons || []);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCoupons = () => {
    let filtered = coupons;

    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    switch (selectedFilter) {
      case 'percentage':
        filtered = filtered.filter(coupon => coupon.type === 'percentage');
        break;
      case 'fixed':
        filtered = filtered.filter(coupon => coupon.type === 'fixed');
        break;
      case 'ending-soon':
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(coupon => new Date(coupon.endDate) <= threeDaysFromNow);
        break;
      case 'high-value':
        filtered = filtered.filter(coupon => 
          (coupon.type === 'percentage' && coupon.value >= 20) ||
          (coupon.type === 'fixed' && coupon.value >= 100000)
        );
        break;
    }

    setFilteredCoupons(filtered);
  };

  const formatDate = (dateString: string) => {
    try {
      // Backend trả về format "DD/MM/YYYY HH:mm:ss"
      if (dateString && dateString.includes('/')) {
        // Parse format "DD/MM/YYYY HH:mm:ss"
        const parts = dateString.split(' ')[0].split('/');
        if (parts.length === 3) {
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          return `${day}/${month}/${year}`;
        }
      }
      
      // Fallback cho ISO string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Ngày không hợp lệ';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    }
    return formatCurrency(coupon.value);
  };

  const getTimeLeft = (endDate: string) => {
    try {
      const now = new Date();
      let end: Date;
      
      // Backend trả về format "DD/MM/YYYY HH:mm:ss"
      if (endDate && endDate.includes('/')) {
        // Parse format "DD/MM/YYYY HH:mm:ss"
        const parts = endDate.split(' ')[0].split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-indexed
          const year = parseInt(parts[2]);
          end = new Date(year, month, day);
        } else {
          end = new Date(endDate);
        }
      } else {
        end = new Date(endDate);
      }
      
      if (isNaN(end.getTime())) {
        return 'Ngày không hợp lệ';
      }
      
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) return 'Đã hết hạn';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return `${days} ngày`;
      if (hours > 0) return `${hours} giờ`;
      if (minutes > 0) return `${minutes} phút`;
      return 'Sắp hết hạn';
    } catch (error) {
      console.error('Error calculating time left:', endDate, error);
      return 'Không xác định';
    }
  };

  const getUsagePercentage = (coupon: Coupon) => {
    if (coupon.usageLimit === 0) return 0;
    return Math.round((coupon.usageCount / coupon.usageLimit) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="flex mb-8">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-4 mx-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
          </div>
          
          {/* Search skeleton */}
          <div className="mb-8">
            <div className="h-12 bg-gray-200 rounded-xl w-full mb-4"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Trang chủ
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Khuyến mãi</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Khuyến Mãi</h1>
            <p className="text-gray-600">Khám phá các ưu đãi hấp dẫn và tiết kiệm chi phí mua sắm</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm mã khuyến mãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Lọc</span>
            </button>
            
            <Link
              href="/user"
              className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
            >
              <span>Mua sắm ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tất cả', icon: Sparkles },
                { key: 'percentage', label: 'Giảm %', icon: Percent },
                { key: 'fixed', label: 'Giảm tiền', icon: Tag },
                { key: 'ending-soon', label: 'Sắp hết hạn', icon: Clock },
                { key: 'high-value', label: 'Giá trị cao', icon: Star }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    selectedFilter === filter.key
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-red-600">{filteredCoupons.length}</span> khuyến mãi
        </p>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy khuyến mãi</h3>
          <p className="text-gray-500 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          <Link
            href="/user"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
          >
            <span>Khám phá sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 overflow-hidden"
            >
              {/* Header */}
              <div className="relative flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shadow-sm">
                      <Gift className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">Mã khuyến mãi</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{coupon.description}</p>
                </div>
                
                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  coupon.status === 'Hoạt động' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {coupon.status}
                </div>
              </div>

              {/* Discount Value */}
              <div className="relative mb-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1 drop-shadow-sm">
                      {getDiscountText(coupon)}
                    </div>
                    <div className="text-sm font-semibold opacity-95">
                      {coupon.type === 'percentage' ? 'Giảm giá' : 'Giảm tiền'}
                    </div>
                  </div>
                </div>
                
                {/* Code Display */}
                <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Mã:</span>
                    <code className="font-mono font-bold text-lg text-red-600 bg-white px-4 py-2 rounded-lg border-2 border-red-200 shadow-sm">
                      {coupon.code}
                    </code>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Đơn tối thiểu:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(coupon.minimumPurchaseAmount)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Hạn sử dụng:</span>
                  <span className="font-bold text-gray-900">{formatDate(coupon.endDate)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Còn lại:</span>
                  <span className="font-bold text-orange-600">
                    {getTimeLeft(coupon.endDate)}
                  </span>
                </div>
              </div>

              {/* Usage Progress */}
              {coupon.usageLimit > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Đã sử dụng:</span>
                    <span className="font-bold text-gray-900">{coupon.usageCount}/{coupon.usageLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(getUsagePercentage(coupon), 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Link
                href={`/user/cart?coupon=${coupon.code}`}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
              >
                <span>Sử dụng ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Chưa tìm thấy mã phù hợp?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi và tận hưởng trải nghiệm mua sắm tuyệt vời
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/user"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
            >
              <span>Khám phá sản phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage; 