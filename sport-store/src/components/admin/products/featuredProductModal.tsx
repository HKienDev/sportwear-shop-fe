"use client";

import React, { useState, useEffect } from "react";
import { X, Clock, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

interface FeaturedProduct {
  _id: string;
  name: string;
  sku: string;
  mainImage: string;
  salePrice: number;
  originalPrice: number;
  stock: number;
  soldCount: number;
}

interface FeaturedProductModalProps {
  product: FeaturedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FeaturedProductConfig) => void;
}

export interface FeaturedProductConfig {
  countdownEndDate: string;
  soldCount: number;
  remainingStock: number;
  isActive: boolean;
}

const FeaturedProductModal: React.FC<FeaturedProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [countdownEndDate, setCountdownEndDate] = useState("");
  const [soldCount, setSoldCount] = useState(0);
  const [remainingStock, setRemainingStock] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (product) {
      // Set default values
      const defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 7); // 7 days from now
      setCountdownEndDate(defaultEndDate.toISOString().slice(0, 16));
      setSoldCount(product.soldCount || 0);
      setRemainingStock(product.stock || 0);
      setIsActive(true);
    }
  }, [product]);

  const handleSave = () => {
    if (!product) return;

    if (!countdownEndDate) {
      toast.error("Vui lòng chọn thời gian kết thúc");
      return;
    }

    if (soldCount < 0) {
      toast.error("Số lượng đã bán không thể âm");
      return;
    }

    if (remainingStock < 0) {
      toast.error("Số lượng còn lại không thể âm");
      return;
    }

    const config: FeaturedProductConfig = {
      countdownEndDate,
      soldCount,
      remainingStock,
      isActive
    };

    onSave(config);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Setup Sản Phẩm Nổi Bật</h3>
              <p className="text-sm text-gray-500">Cấu hình thời gian và thông tin bán hàng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.mainImage}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-red-600">
                  {product.salePrice.toLocaleString()}₫
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Countdown Timer */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              Thời gian kết thúc ưu đãi
            </Label>
            <Input
              type="datetime-local"
              value={countdownEndDate}
              onChange={(e) => setCountdownEndDate(e.target.value)}
              className="w-full"
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500">
              Thời gian hiển thị countdown &quot;Ưu đãi kết thúc sau&quot;
            </p>
          </div>

          {/* Sales Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ShoppingCart className="w-4 h-4" />
                Đã bán
              </Label>
              <Input
                type="number"
                value={soldCount}
                onChange={(e) => setSoldCount(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Còn lại
              </Label>
              <Input
                type="number"
                value={remainingStock}
                onChange={(e) => setRemainingStock(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Hiển thị countdown
            </Label>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Lưu cấu hình
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductModal; 