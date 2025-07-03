import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { ERROR_MESSAGES } from '@/config/constants';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.getCategories();
            
            if (response.data.success) {
                setCategories(response.data.data.categories);
            } else {
                throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
            setError(errorMessage);
            console.error('Fetch categories error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create category
    const createCategory = useCallback(async (categoryData: CreateCategoryRequest) => {
        try {
            setLoading(true);
            
            const response = await apiClient.createCategory(categoryData);
            
            if (response.data.success) {
                toast.success('Danh mục đã được tạo thành công');
                await fetchCategories(); // Refresh list
                return response.data.data;
            } else {
                throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
            toast.error(errorMessage);
            console.error('Create category error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchCategories]);

    // Update category
    const updateCategory = useCallback(async (id: string, categoryData: UpdateCategoryRequest) => {
        try {
            setLoading(true);
            
            const response = await apiClient.updateCategory(id, categoryData);
            
            if (response.data.success) {
                toast.success('Danh mục đã được cập nhật thành công');
                await fetchCategories(); // Refresh list
                return response.data.data;
            } else {
                throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
            toast.error(errorMessage);
            console.error('Update category error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchCategories]);

    // Delete category
    const deleteCategory = useCallback(async (id: string) => {
        try {
            setLoading(true);
            
            const response = await apiClient.deleteCategory(id);
            
            if (response.data.success) {
                toast.success('Danh mục đã được xóa thành công');
                await fetchCategories(); // Refresh list
                return response.data.data;
            } else {
                throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
            toast.error(errorMessage);
            console.error('Delete category error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchCategories]);

    // Load categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory
    };
} 