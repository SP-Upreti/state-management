import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    discountedPrice: number;
    quantity: number;
    total: number;
    thumbnail: string;
    category: string;
    brand: string;
}

export interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<any>) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.total = existingItem.quantity * existingItem.discountedPrice;
            } else {
                const discountedPrice = newItem.price * (1 - newItem.discountPercentage / 100);
                state.items.push({
                    id: newItem.id,
                    title: newItem.title,
                    price: newItem.price,
                    discountPercentage: newItem.discountPercentage,
                    discountedPrice,
                    quantity: 1,
                    total: discountedPrice,
                    thumbnail: newItem.thumbnail,
                    category: newItem.category,
                    brand: newItem.brand,
                });
            }

            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + item.total, 0);
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(item => item.id !== id);
                } else {
                    existingItem.quantity -= 1;
                    existingItem.total = existingItem.quantity * existingItem.discountedPrice;
                }
            }

            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + item.total, 0);
        },

        removeItemCompletely: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + item.total, 0);
        },

        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem && quantity > 0) {
                existingItem.quantity = quantity;
                existingItem.total = existingItem.quantity * existingItem.discountedPrice;
            }

            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = state.items.reduce((total, item) => total + item.total, 0);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },

        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },

        closeCart: (state) => {
            state.isOpen = false;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    removeItemCompletely,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
