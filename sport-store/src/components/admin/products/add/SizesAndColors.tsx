import { Ruler, Palette, Plus, X } from 'lucide-react';

interface SizesAndColorsProps {
  sizes: string[];
  colors: string[];
  onSizesChange: (sizes: string[]) => void;
  onColorsChange: (colors: string[]) => void;
}

export default function SizesAndColors({
  sizes,
  colors,
  onSizesChange,
  onColorsChange,
}: SizesAndColorsProps) {
  const handleAddSize = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newSize = e.currentTarget.value.trim();
      if (!sizes.includes(newSize)) {
        onSizesChange([...sizes, newSize]);
      }
      e.currentTarget.value = '';
    }
  };

  const handleAddColor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newColor = e.currentTarget.value.trim();
      if (!colors.includes(newColor)) {
        onColorsChange([...colors, newColor]);
      }
      e.currentTarget.value = '';
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    onSizesChange(sizes.filter((size) => size !== sizeToRemove));
  };

  const handleRemoveColor = (colorToRemove: string) => {
    onColorsChange(colors.filter((color) => color !== colorToRemove));
  };

  return (
    <div className="card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
        <Ruler className="mr-2 text-orange-500" size={24} />
        Kích Thước và Màu Sắc
      </h2>

      <div className="space-y-6">
        {/* Sizes */}
        <div>
          <label className="input-label text-gray-700">Kích Thước</label>
          <div className="mt-2">
            <input
              type="text"
              className="input-field focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Nhập kích thước và nhấn Enter"
              onKeyDown={handleAddSize}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors duration-200"
                >
                  {size}
                  <button
                    type="button"
                    className="ml-2 text-orange-600 hover:text-orange-800"
                    onClick={() => handleRemoveSize(size)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="input-label text-gray-700">Màu Sắc</label>
          <div className="mt-2">
            <input
              type="text"
              className="input-field focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Nhập màu sắc và nhấn Enter"
              onKeyDown={handleAddColor}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors duration-200"
                >
                  {color}
                  <button
                    type="button"
                    className="ml-2 text-orange-600 hover:text-orange-800"
                    onClick={() => handleRemoveColor(color)}
                  >
                    <X className="h-4 w-4" />
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
              <span className="text-gray-500">Số kích thước:</span>
              <span className="font-medium">{sizes.length} kích thước</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số màu sắc:</span>
              <span className="font-medium">{colors.length} màu</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tổng biến thể:</span>
              <span className="font-medium">
                {sizes.length * colors.length} biến thể
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 