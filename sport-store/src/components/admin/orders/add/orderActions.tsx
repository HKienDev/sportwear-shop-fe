"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { checkUserByPhone } from '@/utils/checkUserByPhone';
import type { ApiResponse } from '@/types/api';
import type { Order, OrderData, User, PaymentMethod, ShippingMethod } from '@/types/base';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  CheckCircle, 
  X, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Shield,
  Truck,
  CreditCard
} from 'lucide-react';

interface OrderActionsProps {
  onClose: () => void;
  onResetForm: () => void;
}

export default function OrderActions({ onClose, onResetForm }: OrderActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = useCallback(async (orderData: OrderData) => {
    try {
      setIsLoading(true);
      
      // Kiểm tra user bằng số điện thoại
      const user = await checkUserByPhone(orderData.shippingAddress.phone) as User | null;
      
      // Chuẩn bị dữ liệu order
      const orderPayload = {
        items: orderData.items.map(item => ({
          sku: item.sku,
          quantity: item.quantity,
          color: item.color || '',  // Đảm bảo không undefined
          size: item.size || ''     // Đảm bảo không undefined
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        shippingMethod: orderData.shippingMethod,
        note: orderData.note,
        userId: user?._id
      };

      // Gọi API tạo order
      const response = await fetchWithAuth<ApiResponse<Order>>('/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      if (response.success) {
        toast.success(
          user 
            ? `Tạo đơn hàng thành công cho khách hàng ${user.fullname}!`
            : "Tạo đơn hàng thành công cho khách vãng lai!"
        );
        onResetForm();
        router.push('/admin/orders/list');
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setIsLoading(false);
    }
  }, [onResetForm, router]);



  return (
    <Card className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <CardContent className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Hành động đơn hàng</h3>
              <p className="text-sm text-gray-500">Xác nhận hoặc hủy bỏ đơn hàng</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle size={14} className="mr-1" />
            Sẵn sàng
          </Badge>
        </div>

        <Separator className="mb-6" />

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Action */}
          <Button
            type="button"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleCreateOrder({
              items: [],
              shippingAddress: {
                fullName: "",
                phone: "",
                address: {
                  province: { name: "", code: "" },
                  district: { name: "", code: "" },
                  ward: { name: "", code: "" }
                }
              },
              paymentMethod: "COD" as PaymentMethod,
              shippingMethod: "STANDARD" as ShippingMethod,
              note: ""
            })}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Đang tạo đơn hàng...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>Tạo đơn hàng</span>
              </div>
            )}
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onResetForm}
              className="h-12 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <ArrowLeft size={16} />
                <span>Làm mới</span>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <X size={16} />
                <span>Hủy bỏ</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-8 space-y-4">
          {/* Security Info */}
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 text-sm mb-1">Bảo mật thông tin</h4>
                <p className="text-blue-700 text-sm">
                  Thông tin khách hàng được mã hóa và bảo vệ theo tiêu chuẩn quốc tế
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 text-sm mb-1">Giao hàng nhanh chóng</h4>
                <p className="text-green-700 text-sm">
                  Đơn hàng sẽ được xử lý và giao hàng trong thời gian sớm nhất
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard size={16} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 text-sm mb-1">Thanh toán an toàn</h4>
                <p className="text-purple-700 text-sm">
                  Hỗ trợ nhiều phương thức thanh toán với bảo mật cao
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle size={16} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 text-sm mb-1">Lưu ý quan trọng</h4>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• Vui lòng kiểm tra kỹ thông tin trước khi tạo đơn hàng</li>
                <li>• Đơn hàng sẽ được xử lý ngay sau khi xác nhận</li>
                <li>• Không thể hủy đơn hàng sau khi đã tạo thành công</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}