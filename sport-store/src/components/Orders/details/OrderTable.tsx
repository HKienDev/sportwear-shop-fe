import { Package } from "lucide-react";
import Image from "next/image";

export default function OrderTable() {
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
            {[
              { name: "Nike Air Zoom Mercurial Superfly X Elite FG", category: "Giày Đá Banh", color: "Đen", quantity: 1, price: 5200000 },
              { name: "Nike Air Zoom Mercurial Superfly X Elite FG", category: "Giày Đá Banh", color: "Trắng", quantity: 1, price: 5200000 },
              { name: "Nike Air Zoom Mercurial Superfly X Elite FG", category: "Giày Đá Banh", color: "Xanh Neon", quantity: 2, price: 5200000 },
              { name: "Nike Air Zoom Mercurial Superfly X Elite FG", category: "Giày Đá Banh", color: "Hồng", quantity: 1, price: 5200000 },
              { name: "Nike Air Zoom Mercurial Superfly X Elite FG", category: "Giày Đá Banh", color: "Xám", quantity: 1, price: 5200000 },
            ].map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 flex items-center space-x-4">
                  <Image src="/shoes.png" alt={item.name} width={50} height={50} className="rounded-md" />
                  <span>{item.name}</span>
                </td>
                <td className="px-6 py-4 text-center">{item.category}</td>
                <td className="px-6 py-4 text-center">{item.color}</td>
                <td className="px-6 py-4 text-center">{item.quantity}</td>
                <td className="px-6 py-4 text-right">{item.price.toLocaleString()}₫</td>
                <td className="px-6 py-4 text-right font-medium">{(item.price * item.quantity).toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Tạm tính:</td>
              <td className="px-6 py-4 text-right text-sm font-medium">31.200.000₫</td>
            </tr>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Phí vận chuyển:</td>
              <td className="px-6 py-4 text-right text-sm font-medium">30.000₫</td>
            </tr>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Giảm giá:</td>
              <td className="px-6 py-4 text-right text-sm font-medium text-red-500">-500.000₫</td>
            </tr>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-base font-bold text-gray-900">Tổng tiền:</td>
              <td className="px-6 py-4 text-right text-lg font-bold text-blue-600">30.730.000₫</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}