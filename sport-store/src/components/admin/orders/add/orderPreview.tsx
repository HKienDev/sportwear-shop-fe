"use client";

import { useCustomer } from "@/app/context/customerContext";
import { useCart } from "@/app/context/cartContext";
import { usePaymentMethod } from "@/app/context/paymentMethodContext";
import { useShippingMethod } from "@/app/context/shippingMethodContext";

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
}

export default function OrderPreview() {
  const { customer } = useCustomer();
  const { cartItems } = useCart();
  const { paymentMethod } = usePaymentMethod();
  const { shippingMethod } = useShippingMethod();

  // Tính tổng tiền
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.discountPrice || item.price;
    return total + (itemPrice * item.quantity);
  }, 0);

  // Phí vận chuyển
  const shippingFee = shippingMethod === "Express" ? 50000 : shippingMethod === "SameDay" ? 100000 : 30000;

  // Tổng cộng
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">XEM TRƯỚC ĐƠN HÀNG</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm min-w-[800px] xl:min-w-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left w-1/4 xl:w-1/3">Thông tin</th>
              <th className="border border-gray-200 p-2 text-left">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {/* Thông tin khách hàng */}
            <tr className="border border-gray-200">
              <td className="border border-gray-200 p-2 font-medium bg-gray-50">THÔNG TIN KHÁCH HÀNG</td>
              <td className="border border-gray-200 p-2">
                <div className="space-y-1">
                  <p><span className="font-medium">Họ tên:</span> {customer.name}</p>
                  <p><span className="font-medium">Số điện thoại:</span> {customer.phone}</p>
                  <p><span className="font-medium">Địa chỉ:</span> {customer.address}</p>
                  <p><span className="font-medium">Tỉnh/Thành phố:</span> {customer.province?.name}</p>
                  <p><span className="font-medium">Quận/Huyện:</span> {customer.district?.name}</p>
                  <p><span className="font-medium">Phường/Xã:</span> {customer.ward?.name}</p>
                </div>
              </td>
            </tr>

            {/* Thông tin đơn hàng */}
            <tr className="border border-gray-200">
              <td className="border border-gray-200 p-2 font-medium bg-gray-50">THÔNG TIN ĐƠN HÀNG</td>
              <td className="border border-gray-200 p-2">
                <div className="space-y-1">
                  <p><span className="font-medium">Phương thức thanh toán:</span> {paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán qua Stripe"}</p>
                  <p><span className="font-medium">Phương thức vận chuyển:</span> {
                    shippingMethod === "Express"
                      ? "Vận chuyển nhanh"
                      : shippingMethod === "SameDay"
                      ? "Vận chuyển trong ngày"
                      : "Vận chuyển thường"
                  }</p>
                </div>
              </td>
            </tr>

            {/* Sản phẩm */}
            <tr className="border border-gray-200">
              <td className="border border-gray-200 p-2 font-medium bg-gray-50">SẢN PHẨM</td>
              <td className="border border-gray-200 p-2">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-200 p-2 text-left w-[80px]">ID</th>
                        <th className="border border-gray-200 p-2 text-left">Tên sản phẩm</th>
                        <th className="border border-gray-200 p-2 text-left w-[120px]">Phân loại</th>
                        <th className="border border-gray-200 p-2 text-right w-[120px]">Đơn giá</th>
                        <th className="border border-gray-200 p-2 text-center w-[60px]">SL</th>
                        <th className="border border-gray-200 p-2 text-right w-[140px]">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.length > 0 ? (
                        cartItems.map((item: Product) => (
                          <tr
                            key={`${item.id}-${item.size || "none"}-${item.color || "none"}`}
                            className="border border-gray-200"
                          >
                            <td className="border border-gray-200 p-2 whitespace-nowrap">#{item.id}</td>
                            <td className="border border-gray-200 p-2 text-blue-600 underline cursor-pointer">
                              {item.name}
                            </td>
                            <td className="border border-gray-200 p-2 whitespace-nowrap">
                              {item.size && <div>Size: {item.size}</div>}
                              {item.color && <div>Màu: {item.color}</div>}
                            </td>
                            <td className="border border-gray-200 p-2 text-right whitespace-nowrap">
                              <div className="font-semibold">
                                {(item.discountPrice || item.price).toLocaleString()} VND
                              </div>
                              {item.discountPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  {item.price.toLocaleString()} VND
                                </div>
                              )}
                            </td>
                            <td className="border border-gray-200 p-2 text-center whitespace-nowrap">{item.quantity}</td>
                            <td className="border border-gray-200 p-2 text-right whitespace-nowrap font-semibold">
                              {((item.discountPrice || item.price) * item.quantity).toLocaleString()} VND
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="border border-gray-200 p-2 text-center text-gray-500">
                            Chưa có sản phẩm nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Tổng tiền */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{shippingFee.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString()} VND</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}