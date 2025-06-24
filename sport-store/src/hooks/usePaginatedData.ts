import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ERROR_MESSAGES } from '@/config/constants';
import type { AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, PaginatedResponse, ApiResponseData } from '@/types/api';

interface UsePaginatedDataOptions {
    onError?: (error: Error) => void;
    showToast?: boolean;
}

export function usePaginatedData<T extends ApiResponseData>() {
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (
        fetchFn: () => Promise<AxiosResponse<ApiResponse<PaginatedResponse<T>>>>,
        options: UsePaginatedDataOptions = {}
    ) => {
        const { onError, showToast = true } = options;

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetchFn();
            
            if (!response) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            
            if (!response.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            
            if (!response.data.data) {
                if (response.data.success) {
                    setData([]);
                    setTotal(0);
                    return;
                }
                throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
            }
            
            if (!response.data.data.items) {
                setData([]);
                setTotal(0);
                return;
            }
            
            setData(response.data.data.items);
            setTotal(response.data.data.total || 0);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            
            let errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
            
            if (error instanceof Error) {
                errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
            } else if (typeof error === 'object' && error !== null) {
                const axiosError = error as AxiosError<ApiResponse<unknown>>;
                if (axiosError.response && axiosError.response.data) {
                    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
                } else if (axiosError.message) {
                    errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
                }
            }
            
            setError(errorMessage);
            
            if (showToast) {
                toast.error(errorMessage);
            }
            
            if (onError) {
                onError(error instanceof Error ? error : new Error(errorMessage));
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        data,
        total,
        isLoading,
        error,
        fetchData
    };
} 