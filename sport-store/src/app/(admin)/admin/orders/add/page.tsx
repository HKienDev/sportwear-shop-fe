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
import { useEffect, useRef, useCallback } from "react";
import { RefreshCw, X, CheckCircle, ShoppingBag, ArrowLeft, Sparkles } from "lucide-react";

export default function AddOrderPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { resetCustomer } = useCustomer();
  const { clearCart } = useCart();
  const { setPaymentMethod } = usePaymentMethod();
  const { setShippingMethod } = useShippingMethod();
  const { setPromoDetails } = usePromo();
  
  // Sử dụng useRef để theo dõi lần render đầu tiên
  const isFirstRender = useRef(true);

  // Định nghĩa tất cả useCallback hooks trước điều kiện redirect
  const resetAllData = useCallback(() => {
    resetCustomer();
    clearCart();
    setPaymentMethod(PaymentMethod.COD);
    setShippingMethod(ShippingMethod.STANDARD);
    setPromoDetails(null);
  }, [resetCustomer, clearCart, setPaymentMethod, setShippingMethod, setPromoDetails]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleResetForm = useCallback(() => {
    resetAllData();
    toast.success("Đã reset form thành công");
  }, [resetAllData]);

  const handleConfirmOrder = useCallback(() => {
    // Giả lập gửi dữ liệu
    setTimeout(() => {
      // Xử lý sau khi xác nhận đơn hàng
      toast.success("Đã tạo đơn hàng thành công");
      resetAllData();
      router.push('/admin/orders/list');
    }, 800);
  }, [resetAllData, router]);

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
  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Tạo đơn hàng</h1>
          </div>
          <button
            onClick={handleResetForm}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
          >
            <RefreshCw size={16} className="text-orange-600" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                      <ShoppingBag size={24} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">Tạo đơn hàng mới</h1>
                      <p className="text-white/90 text-lg">Thêm sản phẩm và thông tin khách hàng để tạo đơn hàng</p>
                    </div>
                  </div>
                  
                  {/* Progress Steps */}
                  <div className="flex items-center space-x-8 mt-6">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                          <CheckCircle size={24} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-orange-500 text-xs font-bold text-orange-500">1</span>
                      </div>
                      <div className="ml-3">
                        <span className="font-semibold text-white">Thông tin khách hàng</span>
                        <p className="text-white/80 text-sm">Nhập thông tin người mua</p>
                      </div>
                    </div>
                    
                    <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                    
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                          <ShoppingBag size={24} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-red-500 text-xs font-bold text-red-500">2</span>
                      </div>
                      <div className="ml-3">
                        <span className="font-semibold text-white">Sản phẩm</span>
                        <p className="text-white/80 text-sm">Chọn sản phẩm cho đơn hàng</p>
                      </div>
                    </div>
                    
                    <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                    
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                          <CheckCircle size={24} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-rose-500 text-xs font-bold text-rose-500">3</span>
                      </div>
                      <div className="ml-3">
                        <span className="font-semibold text-white">Xác nhận</span>
                        <p className="text-white/80 text-sm">Xem và hoàn tất đơn hàng</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleResetForm}
                    className="flex items-center px-6 py-3 text-sm font-medium text-orange-600 bg-white/90 hover:bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Làm mới
                  </button>
                  <button 
                    onClick={handleClose}
                    className="flex items-center justify-center w-12 h-12 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Customer Info & Products */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Customer Info Section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin khách hàng</h2>
                </div>
              </div>
              <CustomerInfo />
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                    <ShoppingBag size={16} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Sản phẩm đơn hàng</h2>
                </div>
              </div>
              <OrderProducts />
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6 lg:space-y-8">
            <div className="xl:sticky xl:top-8 space-y-6 lg:space-y-8">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Xem trước đơn hàng</h2>
                  </div>
                </div>
                <OrderPreview 
                  onConfirmOrder={handleConfirmOrder} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}