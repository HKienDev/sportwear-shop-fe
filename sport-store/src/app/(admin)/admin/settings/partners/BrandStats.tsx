'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users2, 
  Target, 
  Globe2,
  TrendingUp,
  Crown,
  Sparkles,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { adminBrandService } from '@/services/adminBrandService';

interface BrandStats {
  total: number;
  active: number;
  inactive: number;
  premium: number;
  trending: number;
  new: number;
  featured: number;
  totalProducts: number;
  totalFollowers: number;
  categories: { [key: string]: number };
}

export default function BrandStats() {
  const [stats, setStats] = useState<BrandStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminBrandService.getBrandStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching brand stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Tổng Thương Hiệu',
      value: stats.total,
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      description: 'Tất cả thương hiệu'
    },
    {
      title: 'Đang Hoạt Động',
      value: stats.active,
      icon: CheckCircle,
      color: 'from-green-400 to-emerald-500',
      description: 'Thương hiệu hoạt động'
    },
    {
      title: 'Premium',
      value: stats.premium,
      icon: Crown,
      color: 'from-purple-400 to-pink-500',
      description: 'Thương hiệu cao cấp'
    },
    {
      title: 'Trending',
      value: stats.trending,
      icon: TrendingUp,
      color: 'from-red-400 to-pink-500',
      description: 'Thương hiệu hot'
    },
    {
      title: 'Mới',
      value: stats.new,
      icon: Sparkles,
      color: 'from-blue-400 to-cyan-500',
      description: 'Thương hiệu mới'
    },
    {
      title: 'Nổi Bật',
      value: stats.featured,
      icon: Target,
      color: 'from-indigo-400 to-purple-500',
      description: 'Thương hiệu nổi bật'
    },
    {
      title: 'Tổng Sản Phẩm',
      value: stats.totalProducts,
      icon: Target,
      color: 'from-teal-400 to-green-500',
      description: 'Tổng số sản phẩm'
    },
    {
      title: 'Tổng Followers',
      value: stats.totalFollowers,
      icon: Users2,
      color: 'from-blue-400 to-indigo-500',
      description: 'Tổng followers'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.slice(0, 4).map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.slice(4).map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân Bố Trạng Thái</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Hoạt động</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Không hoạt động</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.inactive}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                style={{ 
                  width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân Bố Danh Mục</h3>
          <div className="space-y-3">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{category}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 