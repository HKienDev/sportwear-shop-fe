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
import { RefreshCw, X, CheckCircle, ShoppingBag} from "lucide-react";

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
    
    // Giả lập gửi dữ liệu
    setTimeout(() => {
      // Xử lý sau khi xác nhận đơn hàng
      toast.success("Đã tạo đơn hàng thành công");
      resetAllData();
      router.push('/admin/orders/list');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <ShoppingBag size={28} className="text-white/90 mr-3" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Tạo đơn hàng mới</h1>
                </div>
                <p className="text-white/80 mt-2 ml-1">Thêm sản phẩm và thông tin khách hàng để tạo đơn hàng</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleResetForm}
                  className="flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-all"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Làm mới
                </button>
                <button 
                  onClick={handleClose}
                  className="flex items-center p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="px-6 py-5 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
                    <CheckCircle size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-orange-500 text-[10px] font-bold text-orange-500">1</span>
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Thông tin khách hàng</span>
                  <p className="text-xs text-gray-500">Nhập thông tin người mua</p>
                </div>
                <div className="hidden sm:block w-12 h-1 bg-gradient-to-r from-orange-200 to-red-200 mx-2"></div>
              </div>
              
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg">
                    <ShoppingBag size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-red-500 text-[10px] font-bold text-red-500">2</span>
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Sản phẩm</span>
                  <p className="text-xs text-gray-500">Chọn sản phẩm cho đơn hàng</p>
                </div>
                <div className="hidden sm:block w-12 h-1 bg-gradient-to-r from-red-200 to-rose-200 mx-2"></div>
              </div>
              
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg">
                    <CheckCircle size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-rose-500 text-[10px] font-bold text-rose-500">3</span>
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Xác nhận</span>
                  <p className="text-xs text-gray-500">Xem và hoàn tất đơn hàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info & Products */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <CustomerInfo />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <OrderProducts />
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <OrderPreview 
                  onConfirmOrder={handleConfirmOrder} 
                  onBack={() => {}} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}