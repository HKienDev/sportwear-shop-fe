import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/authContext';
import apiClient from '@/lib/api';
import { useApiCall } from './useApiCall';
import type { CartItem } from '@/types/base';
import { SUCCESS_MESSAGES } from '@/config/constants';

export function useCart() {
    const { user } = useAuth();
    const { execute: executeApiCall } = useApiCall<CartItem[]>();

    const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }

        return await executeApiCall(
            () => apiClient.cart.addToCart(productId, quantity),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.ADD_TO_CART_SUCCESS) }
        );
    }, [user, executeApiCall]);

    const updateCartItem = useCallback(async (productId: string, quantity: number) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để cập nhật giỏ hàng');
            return;
        }

        return await executeApiCall(
            () => apiClient.cart.updateCart(productId, quantity),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.UPDATE_CART_SUCCESS) }
        );
    }, [user, executeApiCall]);

    const removeFromCart = useCallback(async (productId: string) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để xóa khỏi giỏ hàng');
            return;
        }

        return await executeApiCall(
            () => apiClient.cart.removeFromCart(productId),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.REMOVE_FROM_CART_SUCCESS) }
        );
    }, [user, executeApiCall]);

    const clearCart = useCallback(async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để xóa giỏ hàng');
            return;
        }

        return await executeApiCall(
            () => apiClient.cart.clearCart(),
            { onSuccess: () => toast.success(SUCCESS_MESSAGES.CLEAR_CART_SUCCESS) }
        );
    }, [user, executeApiCall]);

    return {
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
    };
} 