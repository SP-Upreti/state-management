import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../utils/api';

// Dashboard Stats Hook
export const useDashboardStats = (period: string = '30') => {
    return useQuery({
        queryKey: ['admin', 'dashboard-stats', period],
        queryFn: () => adminApi.getDashboardStats(period),
        select: (response) => response.data.data,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Product Analytics Hook
export const useProductAnalytics = () => {
    return useQuery({
        queryKey: ['admin', 'product-analytics'],
        queryFn: () => adminApi.getProductAnalytics(),
        select: (response) => response.data.data,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};