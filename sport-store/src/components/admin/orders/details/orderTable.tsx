import Image from "next/image";
import { Package } from "lucide-react";
import type { Coupon } from '@/types/coupon';

type OrderItemProduct = {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  mainImage: string;
  subImages: string[];
  categoryId: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface OrderItem {
  product: OrderItemProduct;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface OrderTableProps {
  items?: OrderItem[];
  shippingMethod?: {
    name: string;
    fee: number;
  };
  discount?: number;
  couponDiscount?: number;
  couponCode?: string;
  totalPrice?: number;
  subtotal?: number;
  shipping?: number;
  appliedCoupon?: Coupon | null;
}

export default function OrderTable({ 
  items = [], 
  shippingMethod = { name: "Standard", fee: 30000 }, 
  discount = 0,
  couponDiscount = 0,
  couponCode = "",
  totalPrice = 0,
  subtotal: propSubtotal,
  shipping: propShipping,
  appliedCoupon
}: OrderTableProps) {
  // Tính tổng tiền hàng nếu không có từ props
  const calculatedSubtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Sử dụng subtotal từ props nếu có, nếu không thì tính toán
  const subtotal = propSubtotal || calculatedSubtotal;
  
  // Sử dụng shipping từ props nếu có, nếu không thì lấy từ shippingMethod
  const shipping = propShipping || (shippingMethod?.fee || 0);

  // Sử dụng totalPrice từ API nếu có, nếu không thì tính toán
  // Tổng tiền = Tổng tiền hàng - Giảm giá trực tiếp - Mã giảm giá + Phí vận chuyển
  const total = totalPrice > 0 ? totalPrice : (subtotal - discount - couponDiscount + shipping);

  // Tính phần trăm giảm giá trực tiếp
  const directDiscountPercentage = subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;
  const directDiscountText = directDiscountPercentage > 0 ? ` (${directDiscountPercentage}%)` : '';

  // Tính phần trăm giảm giá từ mã
  let couponDiscountPercentage = 0;
  if (appliedCoupon && appliedCoupon.type === 'percentage') {
    couponDiscountPercentage = appliedCoupon.value;
  } else if (subtotal > 0) {
    const priceAfterDirectDiscount = subtotal - discount;
    couponDiscountPercentage = priceAfterDirectDiscount > 0 ? Math.round((couponDiscount / priceAfterDirectDiscount) * 100) : 0;
  }
  const couponDiscountText = couponDiscountPercentage > 0 ? ` (${couponDiscountPercentage}%)` : '';

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="font-medium text-gray-700 mb-4 flex items-center">
        <Package className="h-5 w-5 mr-2 text-gray-500" />
        Thông Tin Đơn Hàng
      </h3>
      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col sm:flex-row border border-gray-200 rounded-xl overflow-hidden"
            style={{
              transition: `all 0.5s ease-out ${0.1 + index * 0.1}s`
            }}
          >
            <div className="w-full sm:w-40 h-28 bg-gradient-to-br from-blue-400 to-green-300 flex items-center justify-center relative">
              <Image
                src={item.product.mainImage || '/placeholder.png'}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                <div className="mt-1 text-sm text-gray-500">{item.product.description}</div>
                {(item.size || item.color) && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.size && `Size: ${item.size}`}
                    {item.color && ` | Màu: ${item.color}`}
                  </div>
                )}
              </div>
              <div className="mt-3 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end">
                <div className="font-medium text-gray-900">{item.price.toLocaleString('vi-VN')} VND</div>
                <div className="text-sm text-gray-500">Số lượng: {item.quantity}</div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  Thành tiền: {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="border border-gray-200 rounded-xl p-4 mt-6 bg-gray-50">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Tổng tiền hàng:</span>
            <span className="text-sm text-gray-500">{subtotal.toLocaleString('vi-VN')} VND</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-900">
                Giảm giá trực tiếp{directDiscountText}:
              </span>
              <span className="text-sm text-green-600">-{discount.toLocaleString('vi-VN')} VND</span>
            </div>
          )}
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">
              Mã giảm giá {appliedCoupon ? `(${appliedCoupon.code})` : couponCode ? `(${couponCode})` : ''}{couponDiscountText}:
            </span>
            <span className="text-sm text-green-600">{couponDiscount > 0 ? '-' : ''}{couponDiscount.toLocaleString('vi-VN')} VND</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-900">Phí vận chuyển:</span>
            <span className="text-sm text-gray-500">{shipping.toLocaleString('vi-VN')} VND</span>
          </div>
          
          <div className="flex justify-between py-3 mt-2">
            <span className="font-bold text-gray-900">Tổng tiền thanh toán:</span>
            <span className="font-bold text-red-600">{total.toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
      </div>
    </div>
  );
}