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
  orders: Order[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
} as const;

const ITEMS_PER_PAGE = 5;

export default function OrderList({ orders }: OrderListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const handleOrderClick = (orderId: string) => {
    router.push(`/admin/orders/details/${orderId}`);
  };

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, endIndex);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Lịch Sử Đơn Hàng</h2>
      {orders.length === 0 ? (
        <p className="text-neutral-500">Chưa có đơn hàng nào</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Đơn</TableHead>
                <TableHead>Ngày Đặt</TableHead>
                <TableHead>Tổng Tiền</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order._id} className="cursor-pointer hover:bg-neutral-50" onClick={() => handleOrderClick(order._id)}>
                  <TableCell className="font-medium">{order.shortId}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{order.totalPrice.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderClick(order._id);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Chi tiết
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
} 