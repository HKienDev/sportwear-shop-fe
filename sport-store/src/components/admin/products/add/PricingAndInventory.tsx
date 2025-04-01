import { DollarSign, Package, Percent } from 'lucide-react';

interface PricingAndInventoryProps {
  price: number;
  discountPrice: number;
  stock: number;
  onPriceChange: (value: number) => void;
  onDiscountPriceChange: (value: number) => void;
  onStockChange: (value: number) => void;
}

export default function PricingAndInventory({
  price = 0,
  discountPrice = 0,
  stock = 0,
  onPriceChange,
  onDiscountPriceChange,
  onStockChange,
}: PricingAndInventoryProps) {
  const calculateDiscount = () => {
    if (price === 0) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  // Format số tiền
  const formatPrice = (value: number) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
        <DollarSign className="mr-2 text-green-500" size={24} />
        Giá và Kho Hàng
      </h2>

      <div className="space-y-6">
        {/* Original Price */}
        <div>
          <label className="input-label text-gray-700">Giá Gốc</label>
          <div className="mt-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="1000"
              className="input-field pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0"
              value={price}
              onChange={(e) => onPriceChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Discount Price */}
        <div>
          <label className="input-label text-gray-700">Giá Giảm</label>
          <div className="mt-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="1000"
              className="input-field pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0"
              value={discountPrice}
              onChange={(e) => onDiscountPriceChange(Number(e.target.value))}
            />
          </div>
          {price > 0 && discountPrice > 0 && (
            <div className="mt-2 flex items-center text-sm">
              <Percent className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">
                Giảm {calculateDiscount()}%
              </span>
            </div>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="input-label text-gray-700">Tồn Kho</label>
          <div className="mt-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              className="input-field pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0"
              value={stock}
              onChange={(e) => onStockChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tổng Kết</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giá gốc:</span>
              <span className="font-medium">{formatPrice(price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giá giảm:</span>
              <span className="font-medium text-green-600">
                {formatPrice(discountPrice)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tồn kho:</span>
              <span className="font-medium">{stock} sản phẩm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 