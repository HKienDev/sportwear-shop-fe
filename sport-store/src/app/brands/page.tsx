'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Star, 
  Crown, 
  TrendingUp, 
  Eye,
  Heart,
  ExternalLink,
  ShoppingCart,
  ArrowRight,
  Trophy,
  Target
} from 'lucide-react';
import { brandService } from '@/services/brandService';

interface Brand {
  _id?: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  productsCount: number;
  features: string[];
  isPremium: boolean;
  isTrending: boolean;
  isNew: boolean;
  featured: boolean;
  status: 'active' | 'inactive';
}

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');



  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getBrands();
      
      if (response.success) {
        setBrands(response.data.brands || []);
        setFilteredBrands(response.data.brands || []);
      } else {
        console.error('API Error:', response.message);
        setBrands([]);
        setFilteredBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
      setFilteredBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [brands, searchTerm]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating) ? 'text-[#FF4D4D] fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Mapping features từ tiếng Anh sang tiếng Việt
  const translateFeature = (feature: string) => {
    const featureMap: { [key: string]: string } = {
      'Premium Quality': 'Chất Lượng Cao',
      'Innovation': 'Đổi Mới',
      'Sustainability': 'Bền Vững',
      'Performance': 'Hiệu Suất',
      'Style': 'Phong Cách',
      'Technology': 'Công Nghệ',
      'Comfort': 'Thoải Mái',
      'Heritage': 'Truyền Thống'
    };
    return featureMap[feature] || feature;
  };

  // Tính toán stats động từ dữ liệu brands
  const calculateStats = () => {
    const activeBrands = brands.filter(brand => brand.status === 'active').length;
    const totalProducts = brands
      .filter(brand => brand.status === 'active')
      .reduce((sum, brand) => sum + brand.productsCount, 0);
    
    return {
      activeBrands,
      totalProducts
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] rounded-2xl sm:rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-black/10"></div>
          
          <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Thương Hiệu Đối Tác
              </span>
            </h1>
            
            <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                Khám phá các thương hiệu thể thao hàng đầu thế giới với chất lượng cao và thiết kế độc đáo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="relative mb-6 sm:mb-8">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-[#4EB09D]/20 focus:border-[#4EB09D] transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 sm:gap-3">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-gray-200 transition-all duration-300">
                <Filter className="w-4 h-4" />
                Bộ lọc
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex flex-col gap-0.5">
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                  <div className="w-full h-1 bg-current rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {filteredBrands.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Không tìm thấy thương hiệu
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Thử thay đổi từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8' : 'space-y-4 sm:space-y-6'}>
            {filteredBrands.map((brand) => (
              <div
                key={brand._id || brand.name}
                className={`group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  viewMode === 'list' ? 'flex items-center p-4 sm:p-6' : 'p-4 sm:p-6'
                }`}
              >
                {/* Premium Badges */}
                {brand.isPremium && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                      <Crown className="w-3 h-3 inline mr-1" />
                      PREMIUM
                    </div>
                  </div>
                )}
                {brand.isTrending && (
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      TRENDING
                    </div>
                  </div>
                )}

                {viewMode === 'grid' ? (
                  <>
                    {/* Brand Logo */}
                    <div className="relative mb-4 sm:mb-6">
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center p-4 sm:p-6 group-hover:shadow-lg transition-all duration-300">
                        <div className="relative w-full h-full">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Brand Info */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#4EB09D] transition-colors duration-300">
                          {brand.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {renderStars(brand.rating)}
                          <span className="text-xs text-gray-500 ml-1">({brand.rating})</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {brand.description}
                      </p>



                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatNumber(brand.productsCount)} sản phẩm</span>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {brand.features.slice(0, 2).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                          >
                            {translateFeature(feature)}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
                        <button 
                          disabled
                          className="flex-1 bg-gray-300 text-gray-500 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          Xem chi tiết
                        </button>
                        <button 
                          disabled
                          className="p-2 sm:p-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed transition-all duration-300"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Brand Logo */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center p-2 sm:p-3">
                        <div className="relative w-full h-full">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Brand Info */}
                    <div className="flex-1 ml-4 sm:ml-6">
                      <div className="flex items-center gap-1 flex-shrink-0 mb-2 sm:mb-3">
                        {renderStars(brand.rating)}
                        <span className="text-xs text-gray-500 ml-1">({brand.rating})</span>
                      </div>
                      <div className="mb-2 sm:mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#4EB09D] transition-colors duration-300">
                          {brand.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {brand.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2 sm:mb-3">
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span>{formatNumber(brand.productsCount)} sản phẩm</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 sm:gap-3">
                        <button 
                          disabled
                          className="bg-gray-300 text-gray-500 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          Xem chi tiết
                        </button>
                        <button 
                          disabled
                          className="p-2 sm:p-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed transition-all duration-300"
                        >
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button 
                          disabled
                          className="p-2 sm:p-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Thống Kê Thương Hiệu
            </h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              Tổng quan về các thương hiệu đối tác và hiệu suất của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {(() => {
              const stats = calculateStats();
              return [
                { icon: Trophy, label: 'Thương hiệu', value: `${stats.activeBrands}+`, color: 'from-yellow-400 to-orange-500' },
                { icon: Target, label: 'Sản phẩm', value: `${formatNumber(stats.totalProducts)}+`, color: 'from-green-400 to-emerald-500' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {stat.label}
                  </p>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="bg-gradient-to-r from-[#4EB09D] to-[#7C54F3] rounded-2xl sm:rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-60"></div>
          
          <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              Sẵn Sàng Khám Phá?
            </h2>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Khám phá các thương hiệu thể thao hàng đầu và tìm kiếm sản phẩm phù hợp với phong cách của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button 
                onClick={() => router.push('/user/cart')}
                className="bg-white text-[#4EB09D] px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Mua sắm ngay
              </button>
              <button 
                onClick={() => router.push('/user')}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-white hover:text-[#4EB09D] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 