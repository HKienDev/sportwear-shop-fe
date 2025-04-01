import { FolderTree, Tag, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  subcategories: string[];
}

interface ProductOrganizationProps {
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

export default function ProductOrganization({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
}: ProductOrganizationProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories');
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          setCategories([]);
          setError('Dữ liệu danh mục không hợp lệ');
        }
      } catch (err) {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategory = categories.find((cat) => cat._id === category);

  return (
    <div className="card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
        <FolderTree className="mr-2 text-purple-500" size={24} />
        Phân Loại Sản Phẩm
      </h2>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="input-label text-gray-700">Danh Mục</label>
          <select
            className="input-field focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={category}
            onChange={(e) => {
              onCategoryChange(e.target.value);
              onSubcategoryChange('');
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
          <label className="input-label text-gray-700">Danh Mục Con</label>
          <select
            className="input-field focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={subcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            disabled={!category}
          >
            <option value="">Chọn danh mục con</option>
            {selectedCategory?.subcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tổng Kết</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Danh mục:</span>
              <span className="font-medium">
                {selectedCategory?.name || 'Chưa chọn'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Danh mục con:</span>
              <span className="font-medium">
                {subcategory || 'Chưa chọn'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số danh mục con:</span>
              <span className="font-medium">
                {selectedCategory?.subcategories.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}