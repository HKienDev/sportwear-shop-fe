import { DollarSign, Package } from "lucide-react";
import { useState, useEffect } from "react";

interface PricingAndInventoryProps {
  originalPrice: number;
  salePrice?: number;
  stock: number;
  onOriginalPriceChange: (value: number) => void;
  onSalePriceChange: (value: number) => void;
  onStockChange: (value: number) => void;
}

export default function PricingAndInventory({
  originalPrice,
  salePrice = 0,
  stock,
  onOriginalPriceChange,
  onSalePriceChange,
  onStockChange,
}: PricingAndInventoryProps) {
  // State để lưu giá trị hiển thị
  const [originalPriceDisplay, setOriginalPriceDisplay] = useState("");
  const [salePriceDisplay, setSalePriceDisplay] = useState("");

  // Cập nhật giá trị hiển thị khi props thay đổi
  useEffect(() => {
    setOriginalPriceDisplay(originalPrice ? formatNumberInput(originalPrice) : "");
    setSalePriceDisplay(salePrice ? formatNumberInput(salePrice) : "");
  }, [originalPrice, salePrice]);

  // Format số cho input (1234567 -> 1,234,567)
  const formatNumberInput = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  // Format số tiền Việt Nam
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND'
    }).format(num);
  };

  // Xử lý khi thay đổi giá trị
  const handlePriceChange = (
    value: string,
    setDisplay: (value: string) => void,
    onChange: (value: number) => void
  ) => {
    // Chỉ cho phép nhập số và dấu phẩy
    const cleanValue = value.replace(/[^0-9,]/g, '');
    setDisplay(cleanValue);

    // Chuyển đổi chuỗi thành số
    const numberValue = parseInt(cleanValue.replace(/,/g, '')) || 0;
    onChange(numberValue);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-6 flex items-center">
        <DollarSign className="mr-2 text-green-500" size={24} />
        Giá & Kho Hàng
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="input-label">Giá Gốc (VNĐ)</label>
          <div className="mt-2 relative">
            <input
              type="text"
              className="input-field pr-12"
              placeholder="0"
              value={originalPriceDisplay}
              onChange={(e) => handlePriceChange(
                e.target.value,
                setOriginalPriceDisplay,
                onOriginalPriceChange
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500">VNĐ</span>
            </div>
          </div>
          {originalPrice > 0 && (
            <div className="mt-1 text-sm text-gray-500">
              {formatCurrency(originalPrice)}
            </div>
          )}
        </div>

        <div>
          <label className="input-label">Giá Khuyến Mãi (VNĐ)</label>
          <div className="mt-2 relative">
            <input
              type="text"
              className="input-field pr-12"
              placeholder="0"
              value={salePriceDisplay}
              onChange={(e) => handlePriceChange(
                e.target.value,
                setSalePriceDisplay,
                onSalePriceChange
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500">VNĐ</span>
            </div>
          </div>
          {salePrice > 0 && (
            <div className="mt-1 text-sm text-gray-500">
              {formatCurrency(salePrice)}
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Để trống nếu không có giá khuyến mãi
          </p>
        </div>

        <div>
          <label className="input-label flex items-center">
            <Package className="mr-2 text-blue-500" size={20} />
            Số Lượng Trong Kho
          </label>
          <input
            type="number"
            className="input-field mt-2"
            placeholder="0"
            value={stock}
            onChange={(e) => onStockChange(Number(e.target.value))}
            min="0"
          />
        </div>
      </div>
    </div>
  );
} 