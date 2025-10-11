import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../utils/api';

// Dashboard Stats Hook
export const useDashboardStats = (period: string = '30') => {
    return useQuery({
        queryKey: ['admin', 'dashboard-stats', period],
        queryFn: async () => {
            try {
                const response = await adminApi.getDashboardStats(period);
                return response;
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                throw error;
            }
        },
        select: (response) => response.data.data,
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: 1,
        throwOnError: false, // Prevent errors from propagating to ErrorBoundary
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