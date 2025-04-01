import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/config/constants';
import type { PaginatedResponse } from '@/types/api';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    showToast?: boolean;
}

export function useApi<T>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async <R = T>(
        apiCall: () => Promise<{ data: { success: boolean; data: R; message?: string } }>,
        options: UseApiOptions<R> = {}
    ) => {
        const { onSuccess, onError, showToast = true } = options;

        try {
            setLoading(true);
            setError(null);

            const response = await apiCall();
            
            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
            }

            if (onSuccess) {
                onSuccess(response.data.data);
            }

            return response.data.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
            setError(errorMessage);
            
            if (showToast) {
                toast.error(errorMessage);
            }
            
            if (onError) {
                onError(err instanceof Error ? err : new Error(errorMessage));
            }

            console.error('API Error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const executePaginated = async <R = T>(
        apiCall: () => Promise<{ data: { success: boolean; data: PaginatedResponse<R>; message?: string } }>,
        options: UseApiOptions<PaginatedResponse<R>> = {}
    ) => {
        const { onSuccess, onError, showToast = true } = options;

        try {
            setLoading(true);
            setError(null);

            const response = await apiCall();
            
            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
            }

            if (onSuccess) {
                onSuccess(response.data.data);
            }

            return response.data.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
            setError(errorMessage);
            
            if (showToast) {
                toast.error(errorMessage);
            }
            
            if (onError) {
                onError(err instanceof Error ? err : new Error(errorMessage));
            }

            console.error('API Error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        execute,
        executePaginated
    };
} 