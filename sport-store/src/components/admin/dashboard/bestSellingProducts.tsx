import { TrendingUp, Package, Star, Award, Trophy, Medal, Zap } from 'lucide-react';
import Image from 'next/image';
import { useDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function BestSellingProducts() {
  const { dashboardData, isLoading, error } = useDashboard();

  if (isLoading || !dashboardData) {
    return (
      <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sản Phẩm Bán Chạy</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top sản phẩm được ưa chuộng</p>
            </div>
          </div>

          {/* Loading Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/20 transition-all duration-300 pointer-events-none"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="relative p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sản Phẩm Bán Chạy</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top sản phẩm được ưa chuộng</p>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 font-medium">Có lỗi xảy ra: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const bestSellingProducts = Array.isArray(dashboardData.bestSellingProducts) 
    ? dashboardData.bestSellingProducts 
    : [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-white" />;
      case 2: return <Medal className="w-5 h-5 text-white" />;
      case 3: return <Zap className="w-5 h-5 text-white" />;
      default: return <span className="text-white font-bold text-sm">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600';
    }
  };

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sản Phẩm Bán Chạy</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top sản phẩm được ưa chuộng</p>
          </div>
        </div>
        
        {/* Products List */}
        <div className="space-y-4">
          {bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product, index) => (
              <div 
                key={product._id} 
                className="group/item flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Rank Badge */}
                <div className={`relative w-12 h-12 bg-gradient-to-br ${getRankColor(index + 1)} rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-all duration-300`}>
                  {getRankIcon(index + 1)}
                </div>

                {/* Product Image */}
                <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm group-hover/item:shadow-md transition-all duration-300">
                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={64} 
                      height={64}
                      className="object-cover w-full h-full group-hover/item:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      SKU: {product.sku}
                    </span>
                    <div className={`flex items-center text-xs font-medium ${
                      product.growthRate >= 0 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {product.growthRate >= 0 ? (
                        <TrendingUp size={12} className="mr-1" />
                      ) : (
                        <TrendingUp size={12} className="mr-1 rotate-180" />
                      )}
                      <span>{product.growthRate >= 0 ? '+' : ''}{product.growthRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Sales Badge */}
                <div className="flex flex-col items-end space-y-1">
                  <div className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold shadow-sm">
                    {product.totalSales > 0 ? `${product.totalSales} lượt` : 'Chưa bán'}
                  </div>
                  {product.totalSales > 0 && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>Bán chạy</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có dữ liệu sản phẩm bán chạy</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Dữ liệu sẽ được cập nhật khi có đơn hàng</p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
} 