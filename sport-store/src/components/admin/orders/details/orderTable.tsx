import Image from "next/image";
import { Package } from "lucide-react";

interface OrderItem {
  product: { 
    _id: string; 
    name: string; 
    price: number;
    images: {
      main: string;
      sub: string[];
    };
    shortId: string;
  };
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
}

export default function OrderTable({ items = [], shippingMethod = { name: "Standard", fee: 30000 }, discount = 0 }: OrderTableProps) {
  // Tính tổng tiền
  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Tính tổng tiền cuối cùng
  const total = subtotal + (shippingMethod?.fee || 0) - discount;

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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số lượng</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.product._id}>
                <td className="px-6 py-4 flex items-center space-x-4">
                  <div className="relative w-[50px] h-[50px]">
                    <Image
                      src={item.product.images?.main || "/default-image.png"}
                      alt={item.product.name}
                      fill
                      className="rounded-md object-cover"
                      sizes="50px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/default-image.png";
                      }}
                    />
                  </div>
                  <span>{item.product.name}</span>
                </td>
                <td className="px-6 py-4 text-center">{item.quantity}</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-500">{item.price.toLocaleString()}₫</span>
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  {(item.price * item.quantity).toLocaleString()}₫
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Tạm tính:
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                {subtotal.toLocaleString()}₫
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Phí vận chuyển:
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                {(shippingMethod?.fee || 0).toLocaleString()}₫
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-base font-bold text-gray-900">
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