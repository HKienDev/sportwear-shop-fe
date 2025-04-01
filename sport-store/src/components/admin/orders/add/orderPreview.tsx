"use client";

import { useCustomer } from "@/context/customerContext";
import { useCart } from "@/context/cartContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import Image from "next/image";
import { CartItem } from "@/types/cart";

export default function OrderPreview() {
  const { customer } = useCustomer();
  const { items: cartItems } = useCart();
  const { shippingMethod } = useShippingMethod();

  // Tính tổng tiền
  const subtotal = cartItems.reduce((total: number, item: CartItem) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Phí vận chuyển
  const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 50000 : 
                     shippingMethod === ShippingMethod.SAME_DAY ? 100000 : 
                     30000;

  // Tổng cộng
  const total = subtotal + shippingFee;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">XEM TRƯỚC ĐƠN HÀNG</h3>

      {/* Thông tin khách hàng */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Thông tin giao hàng</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Họ tên: {customer.name}</p>
          <p>Số điện thoại: {customer.phone}</p>
          <p>Địa chỉ: {customer.address}</p>
          <p>
            {customer.ward?.name}, {customer.district?.name}, {customer.province?.name}
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Sản phẩm</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Số lượng</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Đơn giá</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item: CartItem) => (
              <tr key={item.productId} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">{item.quantity}</td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng tiền */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Phí vận chuyển:</span>
          <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex justify-between font-medium text-base pt-2 border-t">
          <span>Tổng cộng:</span>
          <span>{total.toLocaleString("vi-VN")}đ</span>
        </div>
      </div>
    </div>
  );
}