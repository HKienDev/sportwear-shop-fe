import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/config/constants';
import type { AxiosResponse } from 'axios';
import type { ApiResponse, ApiResponseData } from '@/types/api';

interface UseApiCallOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    showToast?: boolean;
}

export function useApiCall<T extends ApiResponseData>() {
    const execute = useCallback(async (
        apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>,
        options: UseApiCallOptions = {}
    ) => {
        const { onSuccess, onError, showToast = true } = options;

        try {
            const response = await apiCall();
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }

            if (onSuccess) {
                onSuccess();
            }

            return response.data.data;
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
            
            if (showToast) {
                toast.error(errorMessage);
            }
            
            if (onError) {
                onError(error instanceof Error ? error : new Error(errorMessage));
            }

            throw error;
        }
    }, []);

    return { execute };
} 