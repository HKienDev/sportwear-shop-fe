"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order } from "@/types/order";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import CancelOrder from "@/components/orders/details/cancelOrder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/orders/admin/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải thông tin đơn hàng");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">Lỗi: {error || "Không tìm thấy đơn hàng"}</div>
        <Link href="/admin/orders/list">
          <Button>Quay lại danh sách đơn hàng</Button>
        </Link>
      </div>
    );
  }

  // Hàm lấy màu sắc và text cho trạng thái đơn hàng
  const getStatusStyle = (status: string) => {
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

  // Hàm chuyển đổi text trạng thái sang tiếng Việt
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đã xác nhận";
      case "shipped":
        return "Đang vận chuyển";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  // Hàm kiểm tra xem đơn hàng có thể hủy không
  const canCancelOrder = (status: string) => {
    return ["pending", "processing", "shipped"].includes(status);
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
          <Badge className={`px-3 py-1 text-sm font-medium ${getStatusStyle(order.status)}`}>
            {getStatusText(order.status)}
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
                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </p>
              <p>
                <span className="font-medium">Phương thức thanh toán:</span>{" "}
                {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
              </p>
              <p>
                <span className="font-medium">Phương thức vận chuyển:</span>{" "}
                {order.shippingMethod === "standard" ? "Tiêu chuẩn" : "Nhanh"}
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
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.product.images[0]}
                            alt={item.product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product.category}
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

        {/* Nút hủy đơn */}
        {canCancelOrder(order.status) && (
          <div className="mt-8 flex justify-end">
            <CancelOrder
              orderId={order._id}
              status={order.status}
              items={order.items}
            />
          </div>
        )}
      </div>
    </div>
  );
} 