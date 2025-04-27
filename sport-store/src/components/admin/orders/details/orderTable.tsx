import Image from "next/image";
import { Package } from "lucide-react";
import { Product } from "@/types/product";

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
                Tạm tính:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subtotal.toLocaleString('vi-VN')}đ
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Phí vận chuyển:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shippingMethod.fee.toLocaleString('vi-VN')}đ
              </td>
            </tr>
            {discount > 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Giảm giá:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  -{discount.toLocaleString('vi-VN')}đ
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                Tổng cộng:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {total.toLocaleString('vi-VN')}đ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}