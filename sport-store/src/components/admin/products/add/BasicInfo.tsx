import { Tag, Layers, Box, Hash } from "lucide-react";
import { useState, useEffect } from "react";

interface BasicInfoProps {
  name: string;
  description: string;
  brand: string;
  sku: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onSkuChange: (value: string) => void;
}

export default function BasicInfo({
  name,
  description,
  brand,
  sku,
  onNameChange,
  onDescriptionChange,
  onBrandChange,
  onSkuChange,
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

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div className="card">
        <label className="input-label flex items-center">
          <Tag className="mr-2 text-blue-500" size={20} />
          Tên Sản Phẩm
        </label>
        <input 
          type="text" 
          className="input-field mt-2" 
          placeholder="Nhập tên sản phẩm..." 
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      {/* Brand */}
      <div className="card">
        <label className="input-label flex items-center">
          <Box className="mr-2 text-purple-500" size={20} />
          Thương Hiệu
        </label>
        <input 
          type="text" 
          className="input-field mt-2" 
          placeholder="Nhập tên thương hiệu..." 
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
        />
      </div>

      {/* SKU */}
      <div className="card">
        <label className="input-label flex items-center">
          <Hash className="mr-2 text-orange-500" size={20} />
          Mã Sản Phẩm (SKU)
        </label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="SKUVJUXXXX"
            value={sku}
            onChange={(e) => handleSkuChange(e.target.value)}
          />
          <button
            type="button"
            onClick={handleGenerateNewSku}
            className="btn-secondary whitespace-nowrap"
          >
            Tạo Mới
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Mã SKU sẽ được tự động tạo và có thể chỉnh sửa. Nhấn &quot;Tạo Mới&quot; để tạo mã khác.
        </p>
      </div>

      {/* Product Description */}
      <div className="card">
        <label className="input-label flex items-center">
          <Layers className="mr-2 text-green-500" size={20} />
          Mô Tả Sản Phẩm
        </label>
        <textarea 
          className="input-field mt-2 h-32 resize-none" 
          placeholder="Nhập mô tả sản phẩm..." 
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <p className="text-sm text-gray-500">
          Nhập mô tả chi tiết về sản phẩm. Sử dụng &quot;Enter&quot; để xuống dòng.
        </p>
      </div>

      <div className="text-sm text-gray-500">Nhập &quot;0&quot; nếu sản phẩm không giảm giá</div>
    </div>
  );
} 