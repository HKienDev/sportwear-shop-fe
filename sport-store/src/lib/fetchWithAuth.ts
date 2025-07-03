import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api';
import type { AxiosRequestConfig } from 'axios';

export async function fetchWithAuth<T>(
    url: string,
    options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await apiClient.get(url, options);
        return response.data as ApiResponse<T>;
    } catch (error) {
        console.error('Fetch with auth error:', error);
        throw error;
    }
} 