import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../utils/api';

// Products Query Hook
export const useProducts = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
}) => {
    return useQuery({
        queryKey: ['admin', 'products', params],
        queryFn: () => productsApi.getProducts(params),
        select: (response) => response.data,
        placeholderData: (previousData) => previousData,
    });
};

// Single Product Query Hook
export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['admin', 'product', id],
        queryFn: () => productsApi.getProduct(id),
        select: (response) => response.data.data.product,
        enabled: !!id,
    });
};

// Create Product Mutation
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData: any) => productsApi.createProduct(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-stats'] });
        },
    });
};

// Update Product Mutation
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, productData }: { id: number; productData: any }) =>
            productsApi.updateProduct(id, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-stats'] });
        },
    });
};

// Delete Product Mutation
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => productsApi.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-stats'] });
        },
    });
};