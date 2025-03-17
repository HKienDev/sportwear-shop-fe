"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface CancelOrderProps {
  orderId: string;
  items: {
    product: string;
    quantity: number;
  }[];
  status: string;
}

export default function CancelOrder({ orderId, items, status }: CancelOrderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelOrder = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, status }),
      });

      if (!response.ok) {
        throw new Error("Không thể hủy đơn hàng");
      }

      toast.success("Hủy đơn hàng thành công");
      router.refresh();
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          Hủy đơn hàng
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể
            hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelOrder}>
            Có, hủy đơn hàng
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 