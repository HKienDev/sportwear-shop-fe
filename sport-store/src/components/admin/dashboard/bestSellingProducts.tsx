"use client";

import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import type { BestSellingProduct } from '@/types/dashboard';

interface BestSellingProductsProps {
  products: BestSellingProduct[];
}

export default function BestSellingProducts({ products }: BestSellingProductsProps) {
  if (!products.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500">Không có sản phẩm bán chạy</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản Phẩm Bán Chạy</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-xs text-gray-400">Đã bán: {product.totalSales}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}