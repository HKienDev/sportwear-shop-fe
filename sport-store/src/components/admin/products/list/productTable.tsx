import React, { useState } from 'react';
import Image from "next/image";
import { ChevronDown, Trash2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  selectedProducts: string[];
  onSelectProduct: (id: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

export default function ProductTable({ 
  products, 
  categories, 
  selectedProducts, 
  onSelectProduct,
  onDeleteProduct 
}: ProductTableProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Chưa phân loại";
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      // Bỏ chọn tất cả
      products.forEach(product => onSelectProduct(product._id));
    } else {
      // Chọn tất cả
      products.forEach(product => onSelectProduct(product._id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header hành động hàng loạt */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-blue-800 font-semibold">
              {selectedProducts.length} mục đã chọn
            </span>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-white border rounded-md px-3 py-2 hover:bg-gray-100"
              >
                Hành động hàng loạt <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      // Triển khai logic xóa hàng loạt
                      selectedProducts.forEach(id => onDeleteProduct?.(id));
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Trash2 className="mr-2 w-4 h-4 text-red-500" /> Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  onChange={toggleSelectAll}
                  checked={selectedProducts.length === products.length && products.length > 0}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kho</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr 
                  key={product._id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => onSelectProduct(product._id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        src={product.imageUrl || "/shoes.png"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {product.description || "Không có mô tả"}
                  </td>
                  <td className="p-4">
                    {product.discountPrice ? (
                      <div>
                        <span className="text-green-600 font-bold">
                          {product.discountPrice.toLocaleString()}₫
                        </span>
                        <div className="text-gray-500 line-through text-xs">
                          {product.price.toLocaleString()}₫
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-900">
                        {product.price.toLocaleString()}₫
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${product.stock <= 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                    `}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {getCategoryName(product.category)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="text-gray-500">
                    Không tìm thấy sản phẩm. 
                    <button className="ml-2 text-blue-600 hover:underline">
                      Thêm sản phẩm mới
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}