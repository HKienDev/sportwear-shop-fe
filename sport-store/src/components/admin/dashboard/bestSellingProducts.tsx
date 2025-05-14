import { PieChart, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function BestSellingProducts() {
  const { dashboardData, isLoading, error } = useDashboard();

  if (isLoading || !dashboardData) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                <PieChart className="text-red-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Sản Phẩm Bán Chạy</h2>
            </div>
          </div>
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <Skeleton className="w-16 h-16 rounded-lg mr-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-6 w-[100px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                <PieChart className="text-red-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Sản Phẩm Bán Chạy</h2>
            </div>
          </div>
          <p className="text-red-500">Có lỗi xảy ra: {error}</p>
        </div>
      </div>
    );
  }

  const bestSellingProducts = Array.isArray(dashboardData.bestSellingProducts) 
    ? dashboardData.bestSellingProducts 
    : [];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-3">
              <PieChart className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sản Phẩm Bán Chạy</h2>
          </div>
        </div>
        
        <div className="space-y-5">
          {bestSellingProducts.map((product, index) => (
            <div key={product._id} className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex items-center justify-center">
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={64} 
                        height={64}
                        className="object-cover"
                        style={{ width: 64, height: 64 }}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No img</span>
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 mr-3">Mã: {product.sku}</span>
                    <div className={`flex items-center text-xs ${product.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.growthRate >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      <span className="ml-1">{product.growthRate >= 0 ? '+' : ''}{product.growthRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="px-3 py-1 bg-red-50 rounded-full text-red-600 text-sm font-medium">
                  {product.totalSales > 0 ? `${product.totalSales} lượt bán` : 'Chưa có lượt bán'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 