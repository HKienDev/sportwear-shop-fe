import { FolderTree, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Tooltip } from "@/components/ui/tooltip";

interface ProductOrganizationProps {
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
}

export default function ProductOrganization({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
}: ProductOrganizationProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/categories/admin');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategory = categories.find(cat => cat._id === category);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center text-gray-900">
          <FolderTree className="mr-2 text-blue-500" size={24} />
          Phân Loại Sản Phẩm
        </h2>
        <p className="mt-1 text-sm text-gray-500">Chọn danh mục và phân loại cho sản phẩm</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Category Selection */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            Danh Mục
            <Tooltip content="Chọn danh mục chính cho sản phẩm">
              <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
            </Tooltip>
          </label>
          <select
            className="input-field focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={category}
            onChange={(e) => {
              onCategoryChange(e.target.value);
              onSubcategoryChange(''); // Reset subcategory when category changes
            }}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Selection */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            Phân Loại
            <Tooltip content="Chọn phân loại chi tiết cho sản phẩm">
              <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
            </Tooltip>
          </label>
          <select
            className="input-field focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={subcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            disabled={!category}
          >
            <option value="">Chọn phân loại</option>
            {selectedCategory?.subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tổng Kết</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Danh mục:</span>
              <span className="font-medium">
                {selectedCategory?.name || 'Chưa chọn'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phân loại:</span>
              <span className="font-medium">
                {selectedCategory?.subcategories.find(sub => sub._id === subcategory)?.name || 'Chưa chọn'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}