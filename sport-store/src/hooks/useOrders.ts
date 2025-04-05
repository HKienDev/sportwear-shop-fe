import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import type { Order, OrderQueryParams } from '@/types/api';
import type { CreateOrderData, UpdateOrderData } from '@/types/base';
import { OrderStatus, PaymentStatus } from '@/types/base';

export function useOrders(options: OrderQueryParams = {}) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await apiClient.orders.getAll(options);
            if (response.data.success && response.data.data) {
                setOrders(response.data.data.items);
                setTotal(response.data.data.total);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(ERROR_MESSAGES.NETWORK_ERROR);
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchOrders]);

    const getOrderById = async (id: string) => {
        try {
            const response = await apiClient.orders.getById(id);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch order:', error);
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            throw error;
        }
    };

    const createOrder = async (data: CreateOrderData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            if (!data.phone) {
                throw new Error('Số điện thoại là bắt buộc');
            }

            const orderData: CreateOrderData = {
                ...data,
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                phone: data.phone
            };

            const response = await apiClient.orders.create(orderData);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            toast.success(SUCCESS_MESSAGES.ORDER_CREATED);
            return response.data.data;
        } catch (error) {
            console.error('Failed to create order:', error);
            toast.error(ERROR_MESSAGES.ORDER_CREATE_ERROR);
            throw error;
        }
    };

    const cancelOrder = async (id: string) => {
        try {
            const updateData: UpdateOrderData = {
                id,
                status: OrderStatus.CANCELLED
            };

            const response = await apiClient.orders.update(id, updateData);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            toast.success(SUCCESS_MESSAGES.ORDER_CANCELLED);
            fetchOrders();
        } catch (error) {
            console.error('Failed to cancel order:', error);
            toast.error(ERROR_MESSAGES.ORDER_CANCEL_ERROR);
            throw error;
        }
    };

    const fetchOrdersByPhone = async (phone: string) => {
        try {
            setIsLoading(true);
            const response = await apiClient.orders.getByPhone(phone);
            setOrders(response.data.data || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải đơn hàng');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        orders,
        total,
        isLoading,
        error,
        fetchOrders,
        fetchOrdersByPhone,
        getOrderById,
        createOrder,
        cancelOrder
    };
} 