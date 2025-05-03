"use client";

import { useState } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod, PaymentMethod } from "@/context/paymentMethodContext";
import { useCustomer } from "@/context/customerContext";
import { usePromo } from "@/context/promoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types/cart";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Check, Truck, CreditCard, Package, AlertCircle, User, Tag } from "lucide-react";
import Image from "next/image";

interface OrderPreviewProps {
  onConfirmOrder: () => void;
  onBack: () => void;
}

export default function OrderPreview({ onConfirmOrder, onBack }: OrderPreviewProps) {
  const { items: cartItems } = useCart();
  const { paymentMethod } = usePaymentMethod();
  const { shippingMethod } = useShippingMethod();
  const { customer } = useCustomer();
  const { promoDetails } = usePromo();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tính tổng tiền
  const calculateTotal = () => {
    // Tính tổng tiền sản phẩm
    const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    
    // Tính phí vận chuyển
    const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 45000 : 
                       shippingMethod === ShippingMethod.SAME_DAY ? 60000 : 
                       30000;
    
    // Tính giảm giá từ mã khuyến mãi (chỉ áp dụng cho giá sản phẩm, không áp dụng cho phí vận chuyển)
    let discountAmount = 0;
    if (promoDetails) {
      if (promoDetails.type === 'percentage') {
        discountAmount = (subtotal * promoDetails.value) / 100;
      } else if (promoDetails.type === 'fixed') {
        discountAmount = promoDetails.value;
      }
    }
    
    // Tổng cộng = (Giá sản phẩm - Giảm giá) + Phí vận chuyển
    return (subtotal - discountAmount) + shippingFee;
  };

  const total = calculateTotal();
  const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 45000 : 
                     shippingMethod === ShippingMethod.SAME_DAY ? 60000 : 
                     30000;
  const discountAmount = promoDetails ? promoDetails.discountAmount : 0;

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Vui lòng thêm sản phẩm vào đơn hàng");
      return;
    }

    // Kiểm tra thông tin khách hàng
    if (!customer.fullName || !customer.phone || !customer.province || !customer.district || !customer.ward) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      // Tạo đơn hàng
      const orderData = {
        items: cartItems.map(item => ({
          sku: item.product.sku,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        shippingAddress: {
          fullName: customer.fullName,
          phone: customer.phone,
          address: {
            province: {
              name: customer.province.name,
              code: customer.province.code
            },
            district: {
              name: customer.district.name,
              code: customer.district.code
            },
            ward: {
              name: customer.ward.name,
              code: customer.ward.code
            },
            street: customer.street
          }
        },
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod.toLowerCase(),
        couponCode: promoDetails?.code
      };

      const response = await fetchWithAuth("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.success) {
        throw new Error(response.message || "Không thể tạo đơn hàng");
      }

      toast.success("Đã tạo đơn hàng thành công");
      onConfirmOrder();
    } catch (error) {
      console.error("❌ [handleConfirmOrder] Lỗi:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể tạo đơn hàng");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị phương thức thanh toán
  const renderPaymentMethod = () => {
    switch (paymentMethod) {
      case PaymentMethod.COD:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-100 group-hover:border-blue-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Thanh toán khi nhận hàng</h4>
                <p className="text-sm text-gray-500 mt-1">(COD)</p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                Đã chọn
              </div>
            </div>
          </div>
        );
      case PaymentMethod.BANKING:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-green-100 group-hover:border-green-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Chuyển khoản ngân hàng</h4>
                <p className="text-sm text-gray-500 mt-1">Thanh toán qua tài khoản ngân hàng</p>
              </div>
              <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                Đã chọn
              </div>
            </div>
          </div>
        );
      case PaymentMethod.MOMO:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-pink-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-pink-100 group-hover:border-pink-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Thanh toán qua Momo</h4>
                <p className="text-sm text-gray-500 mt-1">Quét mã QR hoặc chuyển khoản</p>
              </div>
              <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                Đã chọn
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 group-hover:border-gray-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Chưa chọn phương thức thanh toán</h4>
              </div>
            </div>
          </div>
        );
    }
  };

  // Hiển thị phương thức vận chuyển
  const renderShippingMethod = () => {
    switch (shippingMethod) {
      case ShippingMethod.STANDARD:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 group-hover:border-gray-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Vận chuyển thường</h4>
                <p className="text-sm text-gray-500 mt-1">3-5 ngày làm việc</p>
              </div>
              <div className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                Đã chọn
              </div>
            </div>
          </div>
        );
      case ShippingMethod.EXPRESS:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-100 group-hover:border-blue-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Vận chuyển nhanh</h4>
                <p className="text-sm text-gray-500 mt-1">1-2 ngày làm việc</p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                Đã chọn
              </div>
            </div>
          </div>
        );
      case ShippingMethod.SAME_DAY:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-green-100 group-hover:border-green-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Vận chuyển trong ngày</h4>
                <p className="text-sm text-gray-500 mt-1">Giao hàng trong ngày</p>
              </div>
              <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                Đã chọn
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 group-hover:border-gray-200 transition-all duration-300">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Chưa chọn phương thức vận chuyển</h4>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Xác nhận đơn hàng</CardTitle>
                <p className="text-white/80 text-sm mt-1">Kiểm tra và xác nhận thông tin đơn hàng</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {/* Thông tin khách hàng */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Thông tin khách hàng</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Họ tên:</span>
                <span className="font-medium">{customer.fullName || "Chưa có"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium">{customer.phone || "Chưa có"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Địa chỉ:</span>
                <span className="font-medium text-right">
                  {customer.street ? `${customer.street}, ` : ""}
                  {customer.ward?.name ? `${customer.ward.name}, ` : ""}
                  {customer.district?.name ? `${customer.district.name}, ` : ""}
                  {customer.province?.name || "Chưa có"}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Sản phẩm đã chọn</h3>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {cartItems?.length > 0 ? (
                cartItems.map((item: CartItem) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-4 bg-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-colors"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.mainImage || "/images/placeholder.png"}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Số lượng:</span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Đơn giá:</span>
                          <span className="font-medium">{item.product.salePrice.toLocaleString("vi-VN")}đ</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Thành tiền:</span>
                          <span className="font-medium text-orange-500">{(item.product.salePrice * item.quantity).toLocaleString("vi-VN")}đ</span>
                        </div>
                        {(item.size || item.color) && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.size && <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-600">{item.size}</Badge>}
                            {item.color && <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-600">{item.color}</Badge>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <AlertCircle className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p>Chưa có sản phẩm nào trong đơn hàng</p>
                </div>
              )}
            </div>
          </div>

          {/* Phương thức thanh toán & vận chuyển */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h3>
              </div>
              <div className="space-y-4">
                {renderPaymentMethod()}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Phương thức vận chuyển</h3>
              </div>
              <div className="space-y-4">
                {renderShippingMethod()}
              </div>
            </div>
          </div>

          {/* Mã giảm giá */}
          {promoDetails && (
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 text-orange-500" />
                <h3 className="text-gray-700 font-medium ml-2">Mã giảm giá</h3>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mã:</span>
                  <span className="font-medium text-green-600">{promoDetails.code}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-medium text-green-600">
                    {promoDetails.type === 'percentage' ? `${promoDetails.value}%` : `${promoDetails.value.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tổng tiền */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Tổng đơn hàng</h3>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">{shippingFee.toLocaleString("vi-VN")}đ</span>
              </div>
              {promoDetails && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-medium text-green-600">-{discountAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold">Tổng cộng:</span>
                <span className="text-xl font-bold text-orange-500">{total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 border-t border-gray-100">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-300 hover:bg-gray-100"
            >
              Quay lại
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </div>
              ) : (
                "Xác nhận đơn hàng"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 