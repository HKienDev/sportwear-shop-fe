"use client";

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface BestSellingProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  soldQuantity: number;
  totalRevenue: number;
  isDeleted: boolean;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data: BestSellingProduct[];
  pagination: Pagination;
}

const ITEMS_PER_PAGE = 5;

export default function BestSellingProducts() {
  const [products, setProducts] = useState<BestSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0
  });

  const fetchBestSellingProducts = async (page: number) => {
    try {
      const response = await fetchWithAuth(`/products/admin/best-selling?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response) {
        throw new Error('Không thể kết nối đến server');
      }
      const data = await response.json() as ApiResponse;
      
      if (data.success) {
        setProducts(data.data);
        setPagination(data.pagination);
      } else {
        setError('Không thể tải dữ liệu sản phẩm bán chạy');
      }
    } catch (err) {
      console.error('Error fetching best selling products:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellingProducts(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Sản phẩm bán chạy</h2>
        <span className="text-sm text-gray-500">
          Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total} sản phẩm
        </span>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div 
            key={product._id} 
            className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
              index === 0 ? 'bg-yellow-50' : 
              index === 1 ? 'bg-gray-50' : 
              index === 2 ? 'bg-orange-50' : 
              'hover:bg-gray-50'
            }`}
          >
            <div className="relative w-16 h-16">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {index === 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{product.name}</h3>
                {product.isDeleted && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Đã xóa
                  </span>
                )}
              </div>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-600">
                  Giá: {formatCurrency(product.price)}
                </p>
                <p className="text-sm text-gray-600">
                  Đã bán: <span className="font-medium">{product.soldQuantity}</span> sản phẩm
                </p>
                <p className="text-sm font-medium text-green-600">
                  Doanh thu: {formatCurrency(product.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Các nút số trang */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(pageNum => {
                const delta = 2;
                return pageNum === 1 || 
                       pageNum === pagination.totalPages || 
                       (pageNum >= currentPage - delta && pageNum <= currentPage + delta);
              })
              .map((pageNum, index, array) => {
                if (index > 0 && array[index - 1] !== pageNum - 1) {
                  return [
                    <span key={`ellipsis-${pageNum}`} className="px-3 py-2">...</span>,
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ];
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`p-2 rounded ${
                currentPage === pagination.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
              className={`p-2 rounded ${
                currentPage === pagination.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}