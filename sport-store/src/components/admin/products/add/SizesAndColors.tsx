import { PaletteIcon, Plus, X } from "lucide-react";
import { useState } from "react";

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
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      onSizesChange([...sizes, newSize]);
      setNewSize("");
    }
  };

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      onColorsChange([...colors, newColor]);
      setNewColor("");
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    onSizesChange(sizes.filter(size => size !== sizeToRemove));
  };

  const handleRemoveColor = (colorToRemove: string) => {
    onColorsChange(colors.filter(color => color !== colorToRemove));
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-6 flex items-center">
        <PaletteIcon className="mr-2 text-indigo-500" size={24} />
        Size và Màu
      </h2>
      
      <div className="space-y-6">
        {/* Sizes */}
        <div>
          <label className="input-label">Size</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <span 
                key={size} 
                className="tag tag-blue"
              >
                {size}
                <button
                  onClick={() => handleRemoveSize(size)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Thêm size mới..."
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
            />
            <button
              onClick={handleAddSize}
              className="btn-secondary px-4"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="input-label">Màu</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => (
              <span 
                key={color} 
                className="tag tag-green"
              >
                {color}
                <button
                  onClick={() => handleRemoveColor(color)}
                  className="hover:text-green-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="Thêm màu mới..."
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
            <button
              onClick={handleAddColor}
              className="btn-secondary px-4"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 