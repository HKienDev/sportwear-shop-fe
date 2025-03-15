"use client";

import { useCustomer } from "@/app/Context/CustomerContext";
import { useCart } from "@/app/Context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export default function OrderPreview() {
  const { customer } = useCustomer();
  const { cartItems } = useCart();

  const getFullAddress = () => {
    const { province, district, ward, address } = customer;
    if (!province || !district || !ward || !address) {
      return "Chưa nhập đủ địa chỉ";
    }
    return `${address}, ${ward.name}, ${district.name}, ${province.name}`;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: Product) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">XEM TRƯỚC ĐƠN HÀNG</h2>

      {/* Thông tin khách hàng */}
      <div className="mb-4">
        <h3 className="font-semibold">Thông tin người nhận</h3>
        <p>{customer.name || "Chưa nhập tên"}</p>
        <p>{customer.phone || "Chưa nhập số điện thoại"}</p>
        <p>{getFullAddress()}</p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mb-4">
        <h3 className="font-semibold">Sản phẩm</h3>
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left">ID</th>
              <th className="border border-gray-200 p-2 text-left">Tên sản phẩm</th>
              <th className="border border-gray-200 p-2 text-left">Phân loại</th>
              <th className="border border-gray-200 p-2 text-right">Đơn giá</th>
              <th className="border border-gray-200 p-2 text-center">SL</th>
              <th className="border border-gray-200 p-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item: Product) => (
                <tr
                  key={`${item.id}-${item.size || "none"}-${item.color || "none"}`}
                  className="border border-gray-200"
                >
                  <td className="border border-gray-200 p-2">#{item.id}</td>
                  <td className="border border-gray-200 p-2 text-blue-600 underline cursor-pointer">
                    {item.name}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {item.size && <div>Size: {item.size}</div>}
                    {item.color && <div>Màu: {item.color}</div>}
                  </td>
                  <td className="border border-gray-200 p-2 text-right font-semibold">
                    {item.price.toLocaleString()} VND
                  </td>
                  <td className="border border-gray-200 p-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-200 p-2 text-right font-semibold">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Chưa có sản phẩm nào trong giỏ hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tổng tiền */}
      <div className="text-right font-semibold text-lg space-y-2">
        <div>Thành tiền: {getTotalPrice().toLocaleString()} VND</div>
        <div className="text-xl text-red-600">
          Tổng thanh toán: {getTotalPrice().toLocaleString()} VND
        </div>
      </div>
    </div>
  );
}