import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { ERROR_MESSAGES } from '@/config/constants';
import type { Order } from '@/types/order';

export function useOrderDetails(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch order details
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getOrderById(orderId);

      if (response.data.success) {
        setOrder(response.data.data as Order);
      } else {
        throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      console.error('Fetch order details error:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Update order status
  const updateOrderStatus = useCallback(async (status: string) => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.updateOrderStatus(orderId, status);

      if (response.data.success) {
        setOrder(response.data.data as Order);
        toast.success('Trạng thái đơn hàng đã được cập nhật');
        return response.data.data;
      } else {
        throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Update order status error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Load order details on mount
  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  return {
    order,
    loading,
    error,
    fetchOrderDetails,
    updateOrderStatus
  };
}