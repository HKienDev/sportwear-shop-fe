import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import type { Order, OrderQueryParams } from '@/types/api';
import type { CreateOrderData, UpdateOrderData } from '@/types/base';

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

            const orderData: CreateOrderData = {
                ...data,
                status: 'pending',
                paymentStatus: 'pending'
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
                status: 'cancelled'
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

    return {
        orders,
        total,
        isLoading,
        error,
        fetchOrders,
        getOrderById,
        createOrder,
        cancelOrder
    };
} 