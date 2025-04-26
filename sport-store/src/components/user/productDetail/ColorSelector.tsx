import { useState, useEffect } from 'react';

interface ColorSelectorProps {
  colors: string[];
  onColorSelect?: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    // Tự động chọn màu đầu tiên khi component được mount
    if (colors.length > 0 && !selectedColor) {
      handleColorSelect(colors[0]);
    }
  }, [colors]);

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-gray-900">Lựa chọn màu</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={`py-3 border rounded-md text-center font-medium transition-colors
              ${selectedColor === color 
                ? 'border-red-600 bg-red-50 text-red-600' 
                : 'border-gray-300 hover:border-gray-400 text-gray-900'
              }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector; 