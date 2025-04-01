import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from '@/lib/api';
import { ERROR_MESSAGES } from "@/config/constants";
import type { Order } from "@/types/order";

export const useOrderDetails = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.orders.getById(orderId);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || ERROR_MESSAGES.ORDER_NOT_FOUND);
      }

      setOrder(response.data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  return { order, loading, error, refreshOrder: fetchOrderDetails };
};