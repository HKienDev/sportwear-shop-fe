"use client";

import { useState } from "react";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePaymentMethod, PaymentMethod } from "@/context/paymentMethodContext";
import { useCustomer } from "@/context/customerContext";
import { usePromo } from "@/context/promoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Check, Truck, CreditCard, Package, AlertCircle, User, ShoppingBag, Eye, MapPin, Tag, Loader2 } from "lucide-react";
import Image from "next/image";

interface OrderPreviewProps {
  onConfirmOrder: () => void;
}

export default function OrderPreview({ onConfirmOrder }: OrderPreviewProps) {
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Thanh toán khi nhận hàng</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">(COD) - Thanh toán khi giao hàng</p>
              </div>
              <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                Đã chọn
              </Badge>
            </div>
          </div>
        );
      case PaymentMethod.BANKING:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-green-100 group-hover:border-green-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Chuyển khoản ngân hàng</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Thanh toán qua tài khoản ngân hàng</p>
              </div>
              <Badge className="bg-green-50 text-green-600 border-green-200 text-xs">
                Đã chọn
              </Badge>
            </div>
          </div>
        );
      case PaymentMethod.MOMO:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-pink-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-pink-100 group-hover:border-pink-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Thanh toán qua Momo</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Quét mã QR hoặc chuyển khoản</p>
              </div>
              <Badge className="bg-pink-50 text-pink-600 border-pink-200 text-xs">
                Đã chọn
              </Badge>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group-hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Chưa chọn phương thức thanh toán</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Vui lòng chọn phương thức thanh toán</p>
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
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group-hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Vận chuyển thường</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">3-5 ngày làm việc - 30.000₫</p>
              </div>
              <Badge className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                Đã chọn
              </Badge>
            </div>
          </div>
        );
      case ShippingMethod.EXPRESS:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-blue-100 group-hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Vận chuyển nhanh</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">1-2 ngày làm việc - 45.000₫</p>
              </div>
              <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                Đã chọn
              </Badge>
            </div>
          </div>
        );
      case ShippingMethod.SAME_DAY:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-green-100 group-hover:border-green-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Vận chuyển trong ngày</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Giao hàng trong ngày - 60.000₫</p>
              </div>
              <Badge className="bg-green-50 text-green-600 border-green-200 text-xs">
                Đã chọn
              </Badge>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
            <div className="relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 group-hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Chưa chọn phương thức vận chuyển</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Vui lòng chọn phương thức vận chuyển</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Eye size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Xem trước đơn hàng</h3>
            <p className="text-sm text-gray-500 mt-1">Kiểm tra thông tin trước khi xác nhận</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 text-sm px-3 py-1">
          <Package size={14} className="mr-1" />
          {cartItems.length} sản phẩm
        </Badge>
      </div>

      {/* Customer Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl text-blue-900">Thông tin khách hàng</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-semibold text-blue-900">
                {customer.fullName || "Chưa nhập tên"}
              </p>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                {customer.phone || "Chưa nhập số điện thoại"}
              </p>
            </div>
          </div>
          {customer.street && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base text-blue-900 leading-relaxed">
                  {customer.street}, {customer.ward?.name}, {customer.district?.name}, {customer.province?.name}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment & Shipping Methods */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
            <CreditCard size={20} className="mr-3 text-gray-600" />
            Phương thức thanh toán
          </h4>
          {renderPaymentMethod()}
        </div>

        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
            <Truck size={20} className="mr-3 text-gray-600" />
            Phương thức vận chuyển
          </h4>
          {renderShippingMethod()}
        </div>
      </div>

      {/* Order Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <CardTitle className="text-lg sm:text-xl text-green-900">Tóm tắt đơn hàng</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Products List */}
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 gap-4"
                >
                  {/* Ảnh sản phẩm */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.product.mainImage || "/images/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 min-w-0">
                    {/* Tên + Giá tổng */}
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-sm sm:text-base font-semibold text-gray-900 truncate max-w-[60%]">{item.product.name}</h5>
                      <span className="text-base sm:text-lg font-bold text-green-700 whitespace-nowrap">{item.totalPrice.toLocaleString()}₫</span>
                    </div>
                    {/* Màu + Size */}
                    <div className="flex items-center gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                      {item.color && <span>Màu: <span className="font-medium text-gray-900">{item.color}</span></span>}
                      {item.size && <span>Size: <span className="font-medium text-gray-900">{item.size}</span></span>}
                    </div>
                    {/* Số lượng + Đơn giá/cái */}
                    <div className="flex items-center gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                      <span>Số lượng: <span className="font-medium text-gray-900">{item.quantity}</span></span>
                      <span className="ml-auto text-gray-500">{(item.product.salePrice || item.product.originalPrice).toLocaleString()}₫/cái</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-green-100 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} className="text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sản phẩm</h4>
              <p className="text-gray-500 text-sm">Vui lòng thêm sản phẩm vào đơn hàng</p>
            </div>
          )}

          {/* Price Breakdown */}
          {cartItems.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-green-200">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">{subtotal.toLocaleString()}₫</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600 flex items-center">
                    <Tag size={14} className="mr-2" />
                    Giảm giá:
                  </span>
                  <span className="font-semibold text-green-600">-{discountAmount.toLocaleString()}₫</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-gray-600 flex items-center">
                  <Truck size={14} className="mr-2" />
                  Phí vận chuyển:
                </span>
                <span className="font-semibold">{shippingFee.toLocaleString()}₫</span>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-green-900">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString()}₫</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button
          onClick={handleConfirmOrder}
          disabled={isSubmitting || cartItems.length === 0}
          className="w-full h-14 sm:h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isSubmitting ? "Đang tạo đơn hàng" : "Xác nhận đơn hàng"}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-3">
              <Loader2 size={20} className="animate-spin" />
              <span>Đang tạo đơn hàng...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Check size={20} />
              <span>Xác nhận đơn hàng</span>
            </div>
          )}
        </Button>

        {cartItems.length === 0 && (
          <div className="p-4 sm:p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-900 text-sm sm:text-base mb-1">Chưa có sản phẩm</h4>
                <p className="text-amber-700 text-sm">Vui lòng thêm sản phẩm vào đơn hàng để tiếp tục</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 