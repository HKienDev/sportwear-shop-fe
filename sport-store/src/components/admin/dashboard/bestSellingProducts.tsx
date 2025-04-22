import { PieChart, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  productCode: string;
  sales: string;
  trend: 'up' | 'down';
}

interface BestSellingProductsProps {
  products: Product[];
  formatCurrency: (value: number) => string;
}

export function BestSellingProducts({ products, formatCurrency }: BestSellingProductsProps) {
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
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">Tháng 04/2025</span>
            <button className="text-sm text-red-600 font-medium hover:text-red-800 transition-colors">
              Xem tất cả
            </button>
          </div>
        </div>
        
        <div className="space-y-5">
          {products.map((product, index) => (
            <div key={index} className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex items-center justify-center">
                    <Image 
                      src="/api/placeholder/64/64" 
                      alt={product.name} 
                      width={64} 
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 mr-3">Mã: {product.productCode}</span>
                    <div className={`flex items-center text-xs ${product.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {product.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      <span className="ml-1">{product.trend === 'up' ? '+12%' : '-8%'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="px-3 py-1 bg-red-50 rounded-full text-red-600 text-sm font-medium">
                  {product.sales} lượt bán
                </div>
                <button className="text-gray-400 hover:text-red-600 transition-colors mt-2">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">Thống Kê Sản Phẩm</h3>
              <p className="text-sm text-gray-500 mt-1">Tổng doanh số tuần này</p>
            </div>
            <p className="text-xl font-bold text-red-600">{formatCurrency(152000000)}</p>
          </div>
          <div className="mt-4 flex justify-center">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              Xem báo cáo chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 