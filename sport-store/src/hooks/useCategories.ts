import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/config/constants';
import type { Category } from '@/types/base';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await apiClient.categories.getAll();
            if (response.data.success && response.data.data) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(ERROR_MESSAGES.NETWORK_ERROR);
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryById = async (id: string) => {
        try {
            const response = await apiClient.categories.getById(id);
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch category:', error);
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            throw error;
        }
    };

    return {
        categories,
        isLoading,
        error,
        fetchCategories,
        getCategoryById
    };
} 