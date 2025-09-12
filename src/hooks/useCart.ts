import { useState, useEffect, useCallback } from 'react';
import { cartApi, CartItem, CartTotals, Cart } from '../utils/api';

interface CartState {
    cart: Cart | null;
    items: CartItem[];
    totals: CartTotals;
    isLoading: boolean;
    error: string | null;
}

interface CartActions {
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    mergeCart: (sessionId: string) => Promise<void>;
    clearError: () => void;
}

// Generate a session ID for guest users
const getSessionId = (): string => {
    let sessionId = localStorage.getItem('guest_session_id');
    if (!sessionId) {
        sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('guest_session_id', sessionId);
    }
    return sessionId;
};

export const useCart = (isAuthenticated = false): CartState & CartActions => {
    const [state, setState] = useState<CartState>({
        cart: null,
        items: [],
        totals: {
            totalQuantity: 0,
            totalAmount: 0,
            totalDiscountedAmount: 0,
            totalSavings: 0,
        },
        isLoading: false,
        error: null,
    });

    const sessionId = !isAuthenticated ? getSessionId() : undefined;

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, isLoading: loading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    };

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const response = await cartApi.getCart(sessionId);
            const { cart, items, totals } = response.data.data;
            setState(prev => ({
                ...prev,
                cart,
                items,
                totals,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch cart';
            setError(message);
        }
    }, [sessionId]);

    const addToCart = useCallback(async (productId: number, quantity: number) => {
        try {
            setLoading(true);
            await cartApi.addToCart({ productId, quantity }, sessionId);
            // Refresh cart after adding
            await fetchCart();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to add item to cart';
            setError(message);
            throw error;
        }
    }, [sessionId, fetchCart]);

    const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
        try {
            setLoading(true);
            await cartApi.updateCartItem(itemId, { quantity }, sessionId);
            // Update local state optimistically
            setState(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    item.id === itemId
                        ? {
                            ...item,
                            quantity,
                            total: item.discountedPrice * quantity
                        }
                        : item
                ),
                isLoading: false,
            }));
            // Refresh cart to get accurate totals
            await fetchCart();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update item quantity';
            setError(message);
            // Refresh cart to revert optimistic update
            await fetchCart();
        }
    }, [sessionId, fetchCart]);

    const removeItem = useCallback(async (itemId: number) => {
        try {
            setLoading(true);
            await cartApi.removeFromCart(itemId, sessionId);
            // Update local state optimistically
            setState(prev => ({
                ...prev,
                items: prev.items.filter(item => item.id !== itemId),
                isLoading: false,
            }));
            // Refresh cart to get accurate totals
            await fetchCart();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to remove item from cart';
            setError(message);
            // Refresh cart to revert optimistic update
            await fetchCart();
        }
    }, [sessionId, fetchCart]);

    const clearCart = useCallback(async () => {
        try {
            setLoading(true);
            await cartApi.clearCart(sessionId);
            setState(prev => ({
                ...prev,
                cart: null,
                items: [],
                totals: {
                    totalQuantity: 0,
                    totalAmount: 0,
                    totalDiscountedAmount: 0,
                    totalSavings: 0,
                },
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to clear cart';
            setError(message);
        }
    }, [sessionId]);

    const mergeCart = useCallback(async (guestSessionId: string) => {
        try {
            setLoading(true);
            await cartApi.mergeCart(guestSessionId);
            // Clear guest session ID after merge
            localStorage.removeItem('guest_session_id');
            // Refresh cart after merge
            await fetchCart();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to merge cart';
            setError(message);
        }
    }, [fetchCart]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return {
        ...state,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        mergeCart,
        clearError,
    };
};