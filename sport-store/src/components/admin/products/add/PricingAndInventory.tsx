import { DollarSign, Package, Percent, HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface PricingAndInventoryProps {
  price: number;
  discountPrice: number;
  stock: number;
  onPriceChange: (value: number) => void;
  onDiscountPriceChange: (value: number) => void;
  onStockChange: (value: number) => void;
}

export default function PricingAndInventory({
  price,
  discountPrice,
  stock,
  onPriceChange,
  onDiscountPriceChange,
  onStockChange,
}: PricingAndInventoryProps) {
  const calculateDiscount = () => {
    if (!price || !discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center text-gray-900">
          <DollarSign className="mr-2 text-blue-500" size={24} />
          Giá & Kho Hàng
        </h2>
        <p className="mt-1 text-sm text-gray-500">Thiết lập giá và số lượng sản phẩm</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Price */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            Giá Gốc
            <Tooltip content="Giá bán thông thường của sản phẩm">
              <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
            </Tooltip>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              value={price}
              onChange={(e) => onPriceChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Discount Price */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            Giá Khuyến Mãi
            <Tooltip content="Giá bán khi sản phẩm được giảm giá">
              <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
            </Tooltip>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field pl-10 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0.00"
              value={discountPrice}
              onChange={(e) => onDiscountPriceChange(Number(e.target.value))}
            />
          </div>
          {discountPrice > 0 && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <Percent className="h-4 w-4 mr-1" />
              Giảm {calculateDiscount()}%
            </div>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="input-label text-gray-700 flex items-center">
            Số Lượng Trong Kho
            <Tooltip content="Số lượng sản phẩm có sẵn để bán">
              <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
            </Tooltip>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              className="input-field pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              value={stock}
              onChange={(e) => onStockChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tổng Kết</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giá gốc:</span>
              <span className="font-medium">
                {price ? `${price.toLocaleString('vi-VN')}đ` : 'Chưa nhập'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Giá khuyến mãi:</span>
              <span className="font-medium text-green-600">
                {discountPrice ? `${discountPrice.toLocaleString('vi-VN')}đ` : 'Không có'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số lượng:</span>
              <span className="font-medium">
                {stock ? `${stock.toLocaleString('vi-VN')} sản phẩm` : 'Chưa nhập'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 