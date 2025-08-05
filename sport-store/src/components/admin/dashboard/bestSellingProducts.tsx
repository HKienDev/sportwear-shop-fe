import { TrendingUp, Package, Star, Award, Trophy, Medal, Zap } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface BestSellingProductsProps {
  bestSellingProducts?: any[];
  isLoading?: boolean;
  error?: string | null;
}

export default function BestSellingProducts({ 
  bestSellingProducts = [], 
  isLoading = false, 
  error = null 
}: BestSellingProductsProps) {
  const router = useRouter();

  // Hàm xử lý chuyển hướng đến trang chi tiết sản phẩm
  const handleProductClick = (productSku: string) => {
    router.push(`/admin/products/details/${productSku}`);
  };

  if (isLoading || !bestSellingProducts) {
    return (
      <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300">
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
      <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300">
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

  const products = Array.isArray(bestSellingProducts) 
    ? bestSellingProducts.slice(0, 7) // Giới hạn tối đa 7 sản phẩm
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
      case 4: return 'from-purple-400 to-purple-600';
      case 5: return 'from-pink-400 to-pink-600';
      case 6: return 'from-indigo-400 to-indigo-600';
      case 7: return 'from-teal-400 to-teal-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      <div className="relative p-4 sm:p-5 lg:p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Sản Phẩm Bán Chạy</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Top sản phẩm được ưa chuộng</p>
          </div>
        </div>
        
        {/* Products List */}
        <div className="space-y-4 sm:space-y-5">
          {bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product, index) => (
              <div 
                key={product._id} 
                className="group/item relative overflow-hidden bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-700/90 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
                onClick={() => handleProductClick(product.sku)}
              >
                {/* Background Pattern for each card */}
                <div className="absolute inset-0 opacity-3 group-hover/item:opacity-5 transition-opacity duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                </div>

                <div className="relative flex items-center space-x-4 sm:space-x-5 p-4 sm:p-5">
                  {/* Rank Badge */}
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${getRankColor(index + 1)} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:shadow-xl transition-all duration-300 flex-shrink-0 ring-2 ring-white/50 dark:ring-gray-800/50`}>
                    {getRankIcon(index + 1)}
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group-hover/item:shadow-lg transition-all duration-300 flex-shrink-0 ring-2 ring-white/50 dark:ring-gray-800/50">
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={80} 
                        height={80}
                        className="object-cover w-full h-full group-hover/item:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors duration-200 text-base sm:text-lg leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                        SKU: {product.sku?.includes('-') ? product.sku.split('-').pop() : product.sku}
                      </span>
                      <div className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-full ${
                        product.growthRate >= 0 
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30' 
                          : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {product.growthRate >= 0 ? (
                          <TrendingUp size={12} className="sm:w-4 sm:h-4 mr-1.5" />
                        ) : (
                          <TrendingUp size={12} className="sm:w-4 sm:h-4 mr-1.5 rotate-180" />
                        )}
                        <span>{product.growthRate >= 0 ? '+' : ''}{product.growthRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Sales Badge */}
                  <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                    <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm sm:text-base font-bold shadow-lg group-hover/item:shadow-xl transition-all duration-300">
                      {product.totalSales > 0 ? `${product.totalSales} lượt` : 'Chưa bán'}
                    </div>
                    {product.totalSales > 0 && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">Bán chạy</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent group-hover/item:border-orange-500/30 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 sm:py-10">
              <Award className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold text-base sm:text-lg">Chưa có dữ liệu sản phẩm bán chạy</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Dữ liệu sẽ được cập nhật khi có đơn hàng</p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
} 