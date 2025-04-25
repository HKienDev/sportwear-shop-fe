import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import type { Order } from '@/types/base';

export const useOrderDetails = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.orders.getById(orderId);
      
      // Đảm bảo dữ liệu trả về có đầy đủ các trường bắt buộc
      const orderData = response.data.data;
      if (!orderData.items?.length || !orderData.totalPrice) {
        throw new Error('Dữ liệu đơn hàng không hợp lệ');
      }
      
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin đơn hàng');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [fetchOrderDetails, orderId]);

  return { order, loading, error, refreshOrder: fetchOrderDetails };
};