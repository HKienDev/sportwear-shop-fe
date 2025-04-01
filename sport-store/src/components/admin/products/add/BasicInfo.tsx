import { Info, Tag, Layers, Box, Hash } from "lucide-react";
import { useState, useEffect } from "react";

interface BasicInfoProps {
  name: string;
  description: string;
  brand: string;
  sku: string;
  tags: string[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onTagsChange: (value: string[]) => void;
}

export default function BasicInfo({
  name,
  description,
  brand,
  sku,
  tags,
  onNameChange,
  onDescriptionChange,
  onBrandChange,
  onSkuChange,
  onTagsChange,
}: BasicInfoProps) {
  const [isSkuEdited, setIsSkuEdited] = useState(false);

  // Hàm tạo SKU tự động
  const generateSKU = () => {
    const prefix = 'SKUVJU';
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${randomPart}`;
  };

  // Tự động tạo SKU khi component mount hoặc khi sku rỗng
  useEffect(() => {
    if (!sku && !isSkuEdited) {
      onSkuChange(generateSKU());
    }
  }, [sku, isSkuEdited, onSkuChange]);

  // Xử lý khi người dùng thay đổi SKU
  const handleSkuChange = (value: string) => {
    setIsSkuEdited(true);
    onSkuChange(value.toUpperCase());
  };

  // Xử lý khi click nút tạo SKU mới
  const handleGenerateNewSku = () => {
    onSkuChange(generateSKU());
    setIsSkuEdited(true);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
        <Info className="mr-2 text-blue-500" size={24} />
        Thông Tin Cơ Bản
      </h2>

      <div className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="input-label text-gray-700">Tên Sản Phẩm</label>
          <input
            type="text"
            className="input-field focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tên sản phẩm"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        {/* Brand */}
        <div>
          <label className="input-label text-gray-700">Thương Hiệu</label>
          <input
            type="text"
            className="input-field focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Nhập tên thương hiệu"
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
          />
        </div>

        {/* SKU */}
        <div>
          <label className="input-label text-gray-700">Mã Sản Phẩm (SKU)</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="input-field flex-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="SKUVJUXXXX"
              value={sku}
              onChange={(e) => handleSkuChange(e.target.value)}
            />
            <button
              type="button"
              onClick={handleGenerateNewSku}
              className="btn-secondary whitespace-nowrap hover:bg-orange-600 transition-colors duration-200"
            >
              Tạo Mới
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Mã SKU sẽ được tự động tạo và có thể chỉnh sửa. Nhấn &quot;Tạo Mới&quot; để tạo mã khác.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="input-label text-gray-700">Mô Tả</label>
          <textarea
            className="input-field min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập mô tả chi tiết về sản phẩm"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            <Tag className="mr-2 h-4 w-4 text-gray-500" />
            Tags
          </label>
          <div className="mt-2">
            <input
              type="text"
              className="input-field focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tag và nhấn Enter"
              onKeyDown={handleAddTag}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tổng Kết</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tên sản phẩm:</span>
              <span className="font-medium">{name || 'Chưa nhập'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Độ dài mô tả:</span>
              <span className="font-medium">{description.length} ký tự</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số lượng tags:</span>
              <span className="font-medium">{tags.length} tags</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 