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
  // Sử dụng giá trị thực của mã giảm giá nếu có
  let couponDiscountPercentage = 0;
  if (appliedCoupon && appliedCoupon.type === 'percentage') {
    couponDiscountPercentage = appliedCoupon.value;
  } else if (subtotal > 0) {
    // Nếu không có thông tin về mã giảm giá, tính dựa trên tổng tiền sau khi trừ giảm giá trực tiếp
    const priceAfterDirectDiscount = subtotal - discount;
    couponDiscountPercentage = priceAfterDirectDiscount > 0 ? Math.round((couponDiscount / priceAfterDirectDiscount) * 100) : 0;
  }
  const couponDiscountText = couponDiscountPercentage > 0 ? ` (${couponDiscountPercentage}%)` : '';

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
        <Package className="h-5 w-5 mr-2 text-gray-500" />
        Thông Tin Đơn Hàng
      </h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sản Phẩm
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Lượng
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn Giá
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành Tiền
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        src={item.product.mainImage || '/placeholder.png'}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.product.description}
                      </div>
                      {(item.size || item.color) && (
                        <div className="text-xs text-gray-500">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` | Màu: ${item.color}`}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.price.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Tổng tiền hàng:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subtotal.toLocaleString('vi-VN')}đ
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Giảm giá trực tiếp{directDiscountText}:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                -{discount.toLocaleString('vi-VN')}đ
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Mã giảm giá {appliedCoupon ? `(${appliedCoupon.code})` : couponCode ? `(${couponCode})` : ''}{couponDiscountText}:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                -{couponDiscount.toLocaleString('vi-VN')}đ
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Phí vận chuyển:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipping.toLocaleString('vi-VN')}đ
              </td>
            </tr>
            <tr className="border-t border-gray-200">
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                Tổng tiền thanh toán:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                {total.toLocaleString('vi-VN')}đ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}