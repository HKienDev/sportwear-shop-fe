import { useState, useEffect } from 'react';

interface SizeSelectorProps {
  sizes: string[];
  onSizeSelect?: (size: string) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes, onSizeSelect }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    // Tự động chọn size đầu tiên khi component được mount
    if (sizes.length > 0 && !selectedSize) {
      handleSizeSelect(sizes[0]);
    }
  }, [sizes]);

  const handleSizeSelect = (size: string): void => {
    setSelectedSize(size);
    if (onSizeSelect) {
      onSizeSelect(size);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-gray-900">Lựa chọn kích thước</h2>
        <button className="text-sm text-red-600 hover:text-red-800">Hướng dẫn chọn size</button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {sizes.map(size => (
          <button
            key={size}
            onClick={() => handleSizeSelect(size)}
            className={`py-3 border rounded-md text-center font-medium transition-colors
              ${selectedSize === size 
                ? 'border-red-600 bg-red-50 text-red-600' 
                : 'border-gray-300 hover:border-gray-400 text-gray-900'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector; 