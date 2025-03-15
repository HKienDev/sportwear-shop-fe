// src/components/Orders/Details/OrderTable.tsx
import Image from "next/image";
import { Package } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  category: string;
  color: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface OrderTableProps {
  items: OrderItem[];
  shippingFee: number;
  discount: number;
}

export default function OrderTable({ items, shippingFee, discount }: OrderTableProps) {
  const subTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subTotal + shippingFee - discount;

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thể Loại</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Màu</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số lượng</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 flex items-center space-x-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <span>{item.name}</span>
                </td>
                <td className="px-6 py-4 text-center">{item.category}</td>
                <td className="px-6 py-4 text-center">{item.color}</td>
                <td className="px-6 py-4 text-center">{item.quantity}</td>
                <td className="px-6 py-4 text-right">{item.price.toLocaleString()}₫</td>
                <td className="px-6 py-4 text-right font-medium">
                  {(item.price * item.quantity).toLocaleString()}₫
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Tạm tính:
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                {subTotal.toLocaleString()}₫
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Phí vận chuyển:
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                {shippingFee.toLocaleString()}₫
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Giảm giá:
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium text-red-500">
                -{discount.toLocaleString()}₫
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-base font-bold text-gray-900">
                Tổng tiền:
              </td>
              <td className="px-6 py-4 text-right text-lg font-bold text-blue-600">
                {total.toLocaleString()}₫
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}