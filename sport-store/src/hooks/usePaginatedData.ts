import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/config/constants';
import type { AxiosResponse } from 'axios';
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
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            setData(response.data.data.items);
            setTotal(response.data.data.total);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
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