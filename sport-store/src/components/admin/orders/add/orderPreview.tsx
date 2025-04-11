"use client";

import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface Coupon {
  code: string;
  type: string;
  value: number;
  discountAmount: number;
  minimumPurchaseAmount: number;
}

export default function OrderPreview() {
  const { items: cartItems } = useCart();
  const { shippingMethod } = useShippingMethod();
  const [promoDetails, setPromoDetails] = useState<Coupon | null>(null);

  // Lấy thông tin mã giảm giá từ localStorage
  useEffect(() => {
    const savedPromoDetails = localStorage.getItem("promoDetails");
    if (savedPromoDetails) {
      setPromoDetails(JSON.parse(savedPromoDetails));
    }
  }, []);

  // Hàm lấy tên phương thức vận chuyển
  const getShippingMethodName = () => {
    switch (shippingMethod) {
      case ShippingMethod.STANDARD:
        return "Vận chuyển thường";
      case ShippingMethod.EXPRESS:
        return "Vận chuyển nhanh";
      case ShippingMethod.SAME_DAY:
        return "Vận chuyển trong ngày";
      default:
        return "Vận chuyển thường";
    }
  };

  // Tính tổng tiền
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Tính phí vận chuyển
  const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 50000 : 
                     shippingMethod === ShippingMethod.SAME_DAY ? 100000 : 
                     30000;

  // Tính giảm giá từ mã khuyến mãi
  const calculateDiscount = () => {
    if (!promoDetails) return 0;
    
    if (promoDetails.type === 'percentage') {
      return (subtotal * promoDetails.value) / 100;
    } else if (promoDetails.type === 'fixed') {
      return promoDetails.value;
    }
    return 0;
  };

  const discountAmount = calculateDiscount();

  // Tổng cộng
  const total = subtotal + shippingFee - discountAmount;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Xem trước đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          <h3 className="font-semibold">Sản phẩm</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {cartItems?.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>Số lượng: {item.quantity}</p>
                      <p>Đơn giá: {item.price.toLocaleString()} VNĐ</p>
                      <p>Thành tiền: {(item.price * item.quantity).toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                Chưa có sản phẩm nào
              </div>
            )}
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>{subtotal.toLocaleString()} VNĐ</span>
          </div>

          <div className="flex justify-between">
            <span>Phí vận chuyển ({getShippingMethodName()}):</span>
            <span>{shippingFee.toLocaleString()} VNĐ</span>
          </div>

          {promoDetails && (
            <>
              <div className="flex justify-between text-green-600">
                <span>Giảm giá ({promoDetails.code}):</span>
                <span>-{discountAmount.toLocaleString()} VNĐ</span>
              </div>
              <div className="text-sm text-gray-500">
                {promoDetails.type === 'percentage' 
                  ? `Giảm ${promoDetails.value}% cho đơn hàng`
                  : `Giảm ${promoDetails.value.toLocaleString()} VNĐ cho đơn hàng`}
              </div>
            </>
          )}

          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()} VNĐ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}