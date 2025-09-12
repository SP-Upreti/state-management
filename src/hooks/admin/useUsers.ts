import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../utils/api';

// Users Query Hook
export const useUsers = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
}) => {
    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: () => adminApi.getUsers(params),
        select: (response) => response.data,
        placeholderData: (previousData) => previousData, // Replaces keepPreviousData in v5
    });
};

// Update User Role Mutation
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: number; role: 'user' | 'admin' }) =>
            adminApi.updateUserRole(userId, role),
        onSuccess: () => {
            // Invalidate and refetch users data
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

// Toggle User Status Mutation
export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => adminApi.toggleUserStatus(userId),
        onSuccess: () => {
            // Invalidate and refetch users data
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

// Delete User Mutation
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => adminApi.deleteUser(userId),
        onSuccess: () => {
            // Invalidate and refetch users data
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};