import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/config/constants';

interface UseAsyncOptions {
    onError?: (error: Error) => void;
    showToast?: boolean;
    successMessage?: string;
}

export function useAsync<T>() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (
        asyncFn: () => Promise<T>,
        options: UseAsyncOptions = {}
    ) => {
        const { onError, showToast = true, successMessage } = options;

        try {
            setIsLoading(true);
            setError(null);

            const result = await asyncFn();

            if (successMessage && showToast) {
                toast.success(successMessage);
            }

            return result;
        } catch (error) {
            console.error('Operation failed:', error);
            const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
            setError(errorMessage);
            
            if (showToast) {
                toast.error(errorMessage);
            }
            
            if (onError) {
                onError(error instanceof Error ? error : new Error(errorMessage));
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        execute
    };
} 