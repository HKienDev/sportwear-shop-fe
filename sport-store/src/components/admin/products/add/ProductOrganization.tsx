import { Tag as TagIcon } from 'lucide-react';
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
  image?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductOrganizationProps {
  category: string;
  isActive: boolean;
  tags: string[];
  onCategoryChange: (value: string) => void;
  onIsActiveChange: (value: boolean) => void;
  onTagsChange: (value: string[]) => void;
}

export default function ProductOrganization({
  category,
  isActive,
  tags,
  onCategoryChange,
  onIsActiveChange,
  onTagsChange,
}: ProductOrganizationProps) {
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/categories');
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách danh mục');
      }
      
      const data = await response.json();
      
      // Kiểm tra cấu trúc dữ liệu trả về
      if (!Array.isArray(data)) {
        setCategories([]);
        throw new Error('Dữ liệu không đúng định dạng');
      }
      
      // Kiểm tra và lọc dữ liệu hợp lệ
      const validCategories = data.filter((cat): cat is Category => {
        return cat && 
               typeof cat._id === 'string' && 
               typeof cat.name === 'string';
      });
      
      setCategories(validCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-6 flex items-center">
        <TagIcon className="mr-2 text-green-500" size={24} />
        Tổ Chức Sản Phẩm
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="input-label">Danh Mục</label>
          <div className="mt-2">
            {isLoading ? (
              <div className="animate-pulse bg-gray-100 h-10 rounded-md"></div>
            ) : error ? (
              <div className="flex flex-col gap-2">
                <div className="text-red-500 text-sm">{error}</div>
                <button 
                  onClick={fetchCategories}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <select 
                className="select-field"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {categories.length === 0 && !isLoading && !error && (
            <p className="mt-1 text-sm text-gray-500">
              Chưa có danh mục nào. Vui lòng thêm danh mục trong phần quản lý.
            </p>
          )}
        </div>

        <div>
          <label className="input-label">Trạng Thái</label>
          <div className="mt-2 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="status"
                checked={isActive}
                onChange={() => onIsActiveChange(true)}
              />
              <span className="ml-2">Hiển thị</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="status"
                checked={!isActive}
                onChange={() => onIsActiveChange(false)}
              />
              <span className="ml-2">Ẩn</span>
            </label>
          </div>
        </div>

        <div>
          <label className="input-label">Tags</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="tag tag-blue"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Thêm tag mới..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button
              onClick={handleAddTag}
              className="btn-secondary px-4"
              type="button"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}