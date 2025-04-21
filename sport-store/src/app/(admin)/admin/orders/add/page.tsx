"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import CustomerInfo from "@/components/admin/orders/add/customerInfo";
import OrderProducts from "@/components/admin/orders/add/orderProducts";
import OrderPreview from "@/components/admin/orders/add/orderPreview";
import { useCustomer } from "@/context/customerContext";
import { useCart } from "@/context/cartContext";
import { usePaymentMethod, PaymentMethod } from "@/context/paymentMethodContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { usePromo } from "@/context/promoContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export default function AddOrderPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { resetCustomer } = useCustomer();
  const { clearCart } = useCart();
  const { setPaymentMethod } = usePaymentMethod();
  const { setShippingMethod } = useShippingMethod();
  const { setPromoDetails } = usePromo();
  
  // Sử dụng useRef để theo dõi lần render đầu tiên
  const isFirstRender = useRef(true);

  // Reset tất cả dữ liệu khi trang được tải lại (chỉ chạy một lần)
  useEffect(() => {
    if (isFirstRender.current) {
      resetCustomer();
      clearCart();
      setPaymentMethod(PaymentMethod.COD);
      setShippingMethod(ShippingMethod.STANDARD);
      setPromoDetails(null);
      isFirstRender.current = false;
    }
  }, [resetCustomer, clearCart, setPaymentMethod, setShippingMethod, setPromoDetails]);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/admin/login');
    return null;
  }

  const resetAllData = () => {
    resetCustomer();
    clearCart();
    setPaymentMethod(PaymentMethod.COD);
    setShippingMethod(ShippingMethod.STANDARD);
    setPromoDetails(null);
  };

  const handleClose = () => {
    router.back();
  };

  const handleResetForm = () => {
    resetAllData();
    toast.success("Đã reset form thành công");
  };

  const handleConfirmOrder = () => {
    // Xử lý sau khi xác nhận đơn hàng
    toast.success("Đã tạo đơn hàng thành công");
    resetAllData();
    router.push('/admin/orders/list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#4EB09D] to-[#2C7A6C] p-6">
            <h1 className="text-2xl font-bold text-white">Tạo đơn hàng mới</h1>
            <p className="text-white/80 mt-1">Thêm sản phẩm và thông tin khách hàng để tạo đơn hàng</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info & Products */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerInfo />
            <OrderProducts />
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            <OrderPreview 
              onConfirmOrder={handleConfirmOrder} 
              onBack={() => {}} 
            />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between">
                <button 
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Đóng
                </button>
                <button 
                  onClick={handleResetForm}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Reset form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}