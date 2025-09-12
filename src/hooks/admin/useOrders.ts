import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../utils/api';

// Orders Query Hook
export const useOrders = (params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: ['admin', 'orders', params],
        queryFn: () => ordersApi.getOrders(params),
        select: (response) => response.data,
        placeholderData: (previousData) => previousData,
    });
};

// Single Order Query Hook
export const useOrder = (id: number) => {
    return useQuery({
        queryKey: ['admin', 'order', id],
        queryFn: () => ordersApi.getOrder(id),
        select: (response) => response.data.data.order,
        enabled: !!id,
    });
};

// Update Order Status Mutation
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            ordersApi.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-stats'] });
        },
    });
};