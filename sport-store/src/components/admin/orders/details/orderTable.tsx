import Image from "next/image";
import { Package, ShoppingCart, CreditCard, Truck, Receipt } from "lucide-react";
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
  createdAt: string;
  updatedAt: string;
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
  const directDiscountPercentage = subtotal > 0 ? ((discount / subtotal) * 100) : 0;
  const directDiscountText = directDiscountPercentage > 0 ? ` (${directDiscountPercentage.toFixed(2)}%)` : '';

  // Tính phần trăm giảm giá từ mã
  let couponDiscountPercentage = 0;
  if (appliedCoupon && appliedCoupon.type === 'percentage') {
    couponDiscountPercentage = appliedCoupon.value;
  } else if (subtotal > 0) {
    const priceAfterDirectDiscount = subtotal - discount;
    couponDiscountPercentage = priceAfterDirectDiscount > 0 ? ((couponDiscount / priceAfterDirectDiscount) * 100) : 0;
  }
  const couponDiscountText = couponDiscountPercentage > 0 ? ` (${couponDiscountPercentage.toFixed(2)}%)` : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">Thông Tin Đơn Hàng</h3>
          <p className="text-sm text-slate-600">Chi tiết sản phẩm và tổng tiền</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        {items.map((item, index) => {
          // Kiểm tra xem item.product có tồn tại không
          if (!item.product) {
            return (
              <div 
                key={index} 
                className="flex flex-col sm:flex-row border border-red-200 rounded-2xl overflow-hidden bg-gradient-to-r from-red-50 to-rose-50"
                style={{
                  transition: `all 0.5s ease-out ${0.1 + index * 0.1}s`
                }}
              >
                <div className="w-full sm:w-40 h-32 sm:h-28 bg-gradient-to-br from-red-400 to-rose-300 flex items-center justify-center relative">
                  <div className="text-white text-center p-4">
                    <Package className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">Không có ảnh</p>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <div className="text-red-600 font-semibold text-lg mb-2">Sản phẩm không tồn tại</div>
                    <div className="text-sm text-red-500 mb-3">Sản phẩm này có thể đã bị xóa khỏi hệ thống</div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">Số lượng: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                    <div className="text-lg font-bold text-red-600">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                    </div>
                    <div className="text-sm text-red-500">Đơn giá: {item.price.toLocaleString('vi-VN')} VND</div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 hover:border-slate-300"
              style={{
                transition: `all 0.5s ease-out ${0.1 + index * 0.1}s`
              }}
            >
              {/* Product Image */}
              <div className="w-full sm:w-48 h-48 sm:h-32 bg-gradient-to-br from-blue-400 to-green-300 flex items-center justify-center relative overflow-hidden">
                <Image
                  src={item.product.mainImage || '/default-image.png'}
                  alt={item.product.name || 'Sản phẩm'}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-slate-700">
                  x{item.quantity}
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col sm:flex-row sm:items-center">
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg mb-1">
                      {item.product.name || 'Tên sản phẩm không xác định'}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {item.product.description || 'Không có mô tả'}
                    </p>
                  </div>
                  
                  {/* Product Variants */}
                  {(item.size || item.color) && (
                    <div className="flex flex-wrap gap-2">
                      {item.size && (
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                          Màu: {item.color}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Price Info */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-600">Đơn giá:</span>
                    <span className="font-semibold text-slate-900">
                      {item.price.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                </div>
                
                {/* Total Price */}
                <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                  <div className="text-2xl font-bold text-slate-900">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} VND
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {item.quantity} × {item.price.toLocaleString('vi-VN')} VND
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        
      {/* Order Summary */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-lg">Tổng Kết Đơn Hàng</h4>
            <p className="text-sm text-slate-600">Chi tiết thanh toán</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">Tổng tiền hàng:</span>
            </div>
            <span className="font-semibold text-slate-900">{subtotal.toLocaleString('vi-VN')} VND</span>
          </div>
          
          {/* Direct Discount */}
          {discount > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                <span className="font-medium text-slate-700">
                  Giảm giá trực tiếp{directDiscountText}:
                </span>
              </div>
              <span className="font-semibold text-green-600">-{discount.toLocaleString('vi-VN')} VND</span>
            </div>
          )}
          
          {/* Coupon Discount */}
          <div className="flex justify-between items-center py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-slate-700">
                Mã giảm giá {appliedCoupon ? `(${appliedCoupon.code})` : couponCode ? `(${couponCode})` : ''}{couponDiscountText}:
              </span>
            </div>
            <span className="font-semibold text-purple-600">{couponDiscount > 0 ? '-' : ''}{couponDiscount.toLocaleString('vi-VN')} VND</span>
          </div>
          
          {/* Shipping */}
          <div className="flex justify-between items-center py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-slate-700">Phí vận chuyển:</span>
            </div>
            <span className="font-semibold text-slate-900">{shipping.toLocaleString('vi-VN')} VND</span>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center py-4 bg-gradient-to-r from-slate-100 to-blue-100 rounded-xl px-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-700" />
              <span className="font-bold text-lg text-slate-800">Tổng tiền thanh toán:</span>
            </div>
            <span className="font-bold text-2xl text-slate-900">{total.toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
      </div>
    </div>
  );
}