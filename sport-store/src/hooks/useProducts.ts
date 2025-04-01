import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';
import type { Product, ProductQueryParams } from '@/types/api';
import type { CreateProductData, UpdateProductData } from '@/types/base';
import { usePaginatedData } from './usePaginatedData';
import { useApiCall } from './useApiCall';

export function useProducts(options: ProductQueryParams = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { data: products, total, fetchData: fetchProducts } = usePaginatedData<Product>();
    const { execute: executeApiCall } = useApiCall<Product>();

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts(() => apiClient.products.getAll(options));
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, fetchProducts, options]);

    const getProductById = async (id: string) => {
        try {
            const response = await apiClient.products.getById(id);
            if (!response.data.data) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error(ERROR_MESSAGES.NETWORK_ERROR);
            throw error;
        }
    };

    const createProduct = async (data: CreateProductData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            return await executeApiCall(() => apiClient.products.create(data), {
                onSuccess: () => {
                    toast.success(SUCCESS_MESSAGES.PRODUCT_CREATED);
                    fetchProducts(() => apiClient.products.getAll(options));
                }
            });
        } catch (error) {
            console.error('Failed to create product:', error);
            toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            throw error;
        }
    };

    const updateProduct = async (id: string, data: UpdateProductData) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            return await executeApiCall(() => apiClient.products.update(id, data), {
                onSuccess: () => {
                    toast.success(SUCCESS_MESSAGES.PRODUCT_UPDATED);
                    fetchProducts(() => apiClient.products.getAll(options));
                }
            });
        } catch (error) {
            console.error('Failed to update product:', error);
            toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            if (!user) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            await executeApiCall(() => apiClient.products.delete(id), {
                onSuccess: () => {
                    toast.success(SUCCESS_MESSAGES.PRODUCT_DELETED);
                    fetchProducts(() => apiClient.products.getAll(options));
                }
            });
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
            throw error;
        }
    };

    return {
        products,
        total,
        isLoading,
        fetchProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct
    };
} 