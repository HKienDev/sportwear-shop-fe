import { useState } from 'react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  initialQuantity = 1, 
  onQuantityChange 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (amount: number): void => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      if (onQuantityChange) {
        onQuantityChange(newQuantity);
      }
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium text-gray-900 mb-3">Số lượng</h2>
      <div className="flex items-center">
        <button 
          onClick={() => handleQuantityChange(-1)}
          className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          -
        </button>
        <div className="h-10 w-16 border-t border-b border-gray-300 flex items-center justify-center text-gray-900">
          {quantity}
        </div>
        <button 
          onClick={() => handleQuantityChange(1)}
          className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector; 