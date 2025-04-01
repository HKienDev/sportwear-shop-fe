"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import CustomerInfo from "@/components/admin/orders/add/customerInfo";
import OrderProducts from "@/components/admin/orders/add/orderProducts";
import OrderPreview from "@/components/admin/orders/add/orderPreview";
import OrderActions from "@/components/admin/orders/add/orderActions";
import { useCustomer } from "@/context/customerContext";
import { useCart } from "@/context/cartContext";

export default function AddOrderPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { resetCustomer } = useCustomer();
  const { clearCart } = useCart();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/admin/login');
    return null;
  }

  const handleClose = () => {
    router.back();
  };

  const handleResetForm = () => {
    resetCustomer();
    clearCart();
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
            <OrderPreview />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <OrderActions 
                onClose={handleClose}
                onResetForm={handleResetForm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}