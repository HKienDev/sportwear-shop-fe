import { Ruler, Palette, Plus, X, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";

interface SizesAndColorsProps {
  sizes: string[];
  colors: string[];
  onSizesChange: (sizes: string[]) => void;
  onColorsChange: (colors: string[]) => void;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const AVAILABLE_COLORS = [
  { name: 'Đen', value: '#000000' },
  { name: 'Trắng', value: '#FFFFFF' },
  { name: 'Đỏ', value: '#FF0000' },
  { name: 'Xanh dương', value: '#0000FF' },
  { name: 'Xanh lá', value: '#00FF00' },
  { name: 'Vàng', value: '#FFFF00' },
  { name: 'Tím', value: '#800080' },
  { name: 'Cam', value: '#FFA500' },
  { name: 'Hồng', value: '#FFC0CB' },
  { name: 'Xám', value: '#808080' },
];

export default function SizesAndColors({
  sizes,
  colors,
  onSizesChange,
  onColorsChange,
}: SizesAndColorsProps) {
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      onSizesChange([...sizes, newSize]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    onSizesChange(sizes.filter((size) => size !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      onColorsChange([...colors, newColor]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    onColorsChange(colors.filter((color) => color !== colorToRemove));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center text-gray-900">
          <Ruler className="mr-2 text-blue-500" size={24} />
          Kích Thước & Màu Sắc
        </h2>
        <p className="mt-1 text-sm text-gray-500">Chọn các kích thước và màu sắc có sẵn</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Sizes */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            <Ruler className="mr-2 h-4 w-4 text-gray-500" />
            Kích Thước
            <Tooltip content="Chọn các kích thước có sẵn cho sản phẩm">
              <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
            </Tooltip>
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  if (sizes.includes(size)) {
                    handleRemoveSize(size);
                  } else {
                    onSizesChange([...sizes, size]);
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  sizes.includes(size)
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className="input-field flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Thêm kích thước tùy chỉnh"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value.toUpperCase())}
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="btn-secondary hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            <Palette className="mr-2 h-4 w-4 text-gray-500" />
            Màu Sắc
            <Tooltip content="Chọn các màu sắc có sẵn cho sản phẩm">
              <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
            </Tooltip>
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  if (colors.includes(color.value)) {
                    handleRemoveColor(color.value);
                  } else {
                    onColorsChange([...colors, color.value]);
                  }
                }}
                className={`group relative px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  colors.includes(color.value)
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : 'hover:bg-gray-100'
                }`}
                style={{ backgroundColor: color.value, color: color.value === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
              >
                {color.name}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  ×
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="color"
              className="w-12 h-10 rounded cursor-pointer"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
            <input
              type="text"
              className="input-field flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tên màu sắc"
              value={newColor ? AVAILABLE_COLORS.find(c => c.value === newColor)?.name || '' : ''}
              onChange={(e) => {
                const color = AVAILABLE_COLORS.find(c => c.name.toLowerCase() === e.target.value.toLowerCase());
                setNewColor(color?.value || '');
              }}
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="btn-secondary hover:bg-blue-600 transition-colors duration-200"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tổng Kết</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số kích thước:</span>
              <span className="font-medium">{sizes.length} kích thước</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số màu sắc:</span>
              <span className="font-medium">{colors.length} màu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 