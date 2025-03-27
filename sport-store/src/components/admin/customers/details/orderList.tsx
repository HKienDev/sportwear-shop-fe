"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

interface OrderListProps {
  phone: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
} as const;

const ITEMS_PER_PAGE = 5;

export default function OrderList({ phone }: OrderListProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOrderClick = (orderId: string) => {
    router.push(`/admin/orders/details/${orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth(`/orders/admin/by-phone?phone=${phone}`);
        if (!response.ok) {
          throw new Error("Không thể tải danh sách đơn hàng");
        }
        setOrders(response.data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    if (phone) {
      fetchOrders();
    }
  }, [phone]);

  // Tính toán currentOrders và totalPages
  const currentOrders = orders?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) || [];
  const totalPages = Math.max(1, Math.ceil((orders?.length || 0) / ITEMS_PER_PAGE));

  // Xử lý khi chuyển trang
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return (
      <Card className="relative overflow-hidden p-5 space-y-4 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl border border-gray-100 mt-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden p-5 space-y-4 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl border border-gray-100 mt-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px]" />
        </div>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="relative overflow-hidden p-5 space-y-4 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl border border-gray-100 mt-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px]" />
        </div>
        <div className="text-center text-gray-500">
          <p>Không tìm thấy đơn hàng nào</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden p-5 space-y-4 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl border border-gray-100 mt-6">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:16px_16px]" />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lịch sử đơn hàng</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Phương thức thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    <button 
                      onClick={() => handleOrderClick(order._id)}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      #{order.shortId}
                    </button>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{order.totalPrice.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>
                    {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${statusColors[order.status as keyof typeof statusColors]} border-0`}
                    >
                      {order.status === "pending" && <Clock className="w-3.5 h-3.5 mr-1" />}
                      {order.status === "processing" && <Package className="w-3.5 h-3.5 mr-1" />}
                      {order.status === "shipped" && <Package className="w-3.5 h-3.5 mr-1" />}
                      {order.status === "delivered" && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                      {order.status === "cancelled" && <XCircle className="w-3.5 h-3.5 mr-1" />}
                      {order.status === "pending" && "Chờ xác nhận"}
                      {order.status === "processing" && "Đã xác nhận"}
                      {order.status === "shipped" && "Đang vận chuyển"}
                      {order.status === "delivered" && "Đã giao hàng"}
                      {order.status === "cancelled" && "Đã hủy"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Card>
  );
} 