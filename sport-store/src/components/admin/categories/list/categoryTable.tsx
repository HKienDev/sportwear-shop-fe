import React, { useState } from 'react';
import { ChevronDown, Trash2, Edit2, Eye } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  productCount: number;
  createdAt: string;
  isActive: boolean;
}

interface CategoryTableProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (id: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onEditCategory?: (categoryId: string) => void;
  onViewCategory?: (categoryId: string) => void;
}

export default function CategoryTable({
  categories,
  selectedCategories,
  onSelectCategory,
  onDeleteCategory,
  onEditCategory,
  onViewCategory,
}: CategoryTableProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      categories.forEach((category) => onSelectCategory(category._id));
    } else {
      categories.forEach((category) => onSelectCategory(category._id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header hành động hàng loạt */}
      {selectedCategories.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex justify-between items-center border-b border-blue-100">
          <div className="flex items-center space-x-4">
            <span className="text-blue-800 font-semibold flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              {selectedCategories.length} mục đã chọn
            </span>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                Hành động hàng loạt <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center text-red-600 transition-colors duration-200"
                    onClick={() => {
                      selectedCategories.forEach((id) => onDeleteCategory?.(id));
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Trash2 className="mr-2 w-4 h-4" /> Xóa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    selectedCategories.length === categories.length &&
                    categories.length > 0
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Tên thể loại
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Số lượng sản phẩm
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
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
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-mono">{category._id}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="p-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.productCount || 0}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewCategory?.(category._id)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditCategory?.(category._id)}
                        className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteCategory?.(category._id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-lg mb-2">Không tìm thấy thể loại</p>
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