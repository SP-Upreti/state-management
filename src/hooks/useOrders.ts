import { useState, useCallback } from 'react';
import { ordersApi, Order } from '../utils/api';

interface OrdersState {
    orders: Order[];
    currentOrder: Order | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    } | null;
}

interface OrdersActions {
    fetchOrders: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        userId?: number;
        startDate?: string;
        endDate?: string;
    }) => Promise<void>;
    fetchOrder: (id: number) => Promise<void>;
    createOrder: (orderData: {
        items: Array<{ productId: number; quantity: number; price: number }>;
        shippingAddress: string;
        totalAmount: number;
        discountedTotal: number;
    }) => Promise<Order>;
    updateOrderStatus: (id: number, status: string) => Promise<void>;
    clearError: () => void;
    clearCurrentOrder: () => void;
}

export const useOrders = (): OrdersState & OrdersActions => {
    const [state, setState] = useState<OrdersState>({
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: null,
        pagination: null,
    });

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, isLoading: loading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    };

    const fetchOrders = useCallback(async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        userId?: number;
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            setLoading(true);
            const response = await ordersApi.getOrders(params);
            const { orders } = response.data.data;
            const { pagination } = response.data;

            setState(prev => ({
                ...prev,
                orders,
                pagination: pagination ? { ...pagination, total: response.data.total || 0 } : null,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch orders';
            setError(message);
        }
    }, []);

    const fetchOrder = useCallback(async (id: number) => {
        try {
            setLoading(true);
            const response = await ordersApi.getOrder(id);
            const { order } = response.data.data;

            setState(prev => ({
                ...prev,
                currentOrder: order,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch order';
            setError(message);
        }
    }, []);

    const createOrder = useCallback(async (orderData: {
        items: Array<{ productId: number; quantity: number; price: number }>;
        shippingAddress: string;
        totalAmount: number;
        discountedTotal: number;
    }): Promise<Order> => {
        try {
            setLoading(true);
            const response = await ordersApi.createOrder(orderData);
            const { order } = response.data.data;

            // Add to orders list
            setState(prev => ({
                ...prev,
                orders: [order, ...prev.orders],
                isLoading: false,
                error: null,
            }));

            return order;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create order';
            setError(message);
            throw error;
        }
    }, []);

    const updateOrderStatus = useCallback(async (id: number, status: string) => {
        try {
            setLoading(true);
            const response = await ordersApi.updateOrderStatus(id, status);
            const { order } = response.data.data;

            // Update in orders list
            setState(prev => ({
                ...prev,
                orders: prev.orders.map(o => o.id === id ? order : o),
                currentOrder: prev.currentOrder?.id === id ? order : prev.currentOrder,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update order status';
            setError(message);
            throw error;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearCurrentOrder = useCallback(() => {
        setState(prev => ({ ...prev, currentOrder: null }));
    }, []);

    return {
        ...state,
        fetchOrders,
        fetchOrder,
        createOrder,
        updateOrderStatus,
        clearError,
        clearCurrentOrder,
    };
};