import React, { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  productCount: number; // Thêm trường này để lưu số lượng sản phẩm
}

interface CategoryTableProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (id: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

export default function CategoryTable({
  categories,
  selectedCategories,
  onSelectCategory,
  onDeleteCategory,
}: CategoryTableProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      // Bỏ chọn tất cả
      categories.forEach((category) => onSelectCategory(category._id));
    } else {
      // Chọn tất cả
      categories.forEach((category) => onSelectCategory(category._id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header hành động hàng loạt */}
      {selectedCategories.length > 0 && (
        <div className="bg-blue-50 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-blue-800 font-semibold">
              {selectedCategories.length} mục đã chọn
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
                      selectedCategories.forEach((id) => onDeleteCategory?.(id));
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
                  checked={
                    selectedCategories.length === categories.length &&
                    categories.length > 0
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên thể loại
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng sản phẩm
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => onSelectCategory(category._id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {category.productCount || 0} {/* Hiển thị số lượng sản phẩm */}
                  </td>
                  <td className="p-4 text-sm text-gray-500">{category._id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  <div className="text-gray-500">
                    Không tìm thấy thể loại.
                    <button className="ml-2 text-blue-600 hover:underline">
                      Thêm thể loại mới
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