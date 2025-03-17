"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import CancelOrder from "@/components/orders/details/cancelOrder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { notFound, useParams } from "next/navigation";
import OrderDetails from "@/components/orders/details/orderDetails";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: {
    main: string;
    sub: string[];
  };
  category: {
    name: string;
  };
}

interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  discountPrice?: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  postalCode: string;
  note?: string;
}

interface ShippingMethod {
  method: "Express" | "SameDay" | "Standard";
  expectedDate: string;
  courier: string;
  trackingId: string;
}

interface Order {
  _id: string;
  shortId: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  shippingFee: number;
  totalAmount: number;
  discount?: number;
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "pending" | "paid";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

async function getOrder(id: string): Promise<Order> {
  try {
    const { data } = await fetchWithAuth(`/orders/admin/${id}`);
    if (!data) {
      notFound();
    }
    return data;
  } catch {
    notFound();
  }
}

export default function OrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(params.id as string);
        setOrder(data);
      } catch {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return notFound();
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "HH:mm - dd/MM/yyyy");
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return "Chưa thanh toán";
      case "paid":
        return "Đã thanh toán";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: Order["paymentMethod"]) => {
    return method === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán online";
  };

  const getShippingMethodText = (method: ShippingMethod["method"]) => {
    switch (method) {
      case "Express":
        return "Vận chuyển nhanh";
      case "SameDay":
        return "Vận chuyển trong ngày";
      default:
        return "Vận chuyển thường";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders/list">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </Badge>
          <Badge className={`px-3 py-1 text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
            {getPaymentStatusText(order.paymentStatus)}
          </Badge>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Thông báo đơn hàng đã bị hủy */}
      {order.status === "cancelled" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Đơn hàng đã bị hủy</AlertTitle>
          <AlertDescription>
            Đơn hàng này đã bị hủy và không thể thực hiện thêm thao tác nào.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Thông tin khách hàng */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Họ tên:</span> {order.shippingAddress.fullName}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {order.shippingAddress.phone}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {order.shippingAddress.address}
              </p>
              <p>
                <span className="font-medium">Ghi chú:</span>{" "}
                {order.shippingAddress.note || "Không có"}
              </p>
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Mã đơn hàng:</span> {order.shortId}
              </p>
              <p>
                <span className="font-medium">Ngày đặt:</span>{" "}
                {formatDate(order.createdAt)}
              </p>
              <p>
                <span className="font-medium">Phương thức thanh toán:</span>{" "}
                {getPaymentMethodText(order.paymentMethod)}
              </p>
              <p>
                <span className="font-medium">Phương thức vận chuyển:</span>{" "}
                {getShippingMethodText(order.shippingMethod.method)}
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.product.images.main}
                            alt={item.product.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product.category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(item.price)}
                      </div>
                      {item.discountPrice && (
                        <div className="text-sm text-red-500">
                          {formatCurrency(item.discountPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(
                        (item.discountPrice || item.price) * item.quantity
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="mt-8 flex justify-end">
          <div className="w-1/3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">
                  {formatCurrency(
                    order.items.reduce(
                      (total, item) =>
                        total + (item.discountPrice || item.price) * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <OrderDetails
              orderId={order._id}
              status={order.status}
              items={order.items}
              shippingAddress={order.shippingAddress}
              shippingMethod={order.shippingMethod}
              shippingFee={order.shippingFee}
              discount={order.discount}
              paymentMethod={order.paymentMethod}
              paymentStatus={order.paymentStatus}
              createdAt={order.createdAt}
              user={order.user}
            />
          </Suspense>
          {order.status === "pending" && (
            <Suspense fallback={<div>Loading...</div>}>
              <CancelOrder
                orderId={order._id}
                items={order.items.map(item => ({
                  product: item.product._id,
                  quantity: item.quantity
                }))}
                status={order.status}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
} 