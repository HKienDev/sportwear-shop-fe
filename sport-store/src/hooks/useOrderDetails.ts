import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Order } from "@/types/order";

export const useOrderDetails = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithAuth<Order>(`/api/orders/admin/${orderId}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể lấy thông tin đơn hàng");
      }

      setOrder(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  return { order, loading, error, refreshOrder: fetchOrderDetails };
};