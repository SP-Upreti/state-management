import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
        color: string;
        type: string;
    };
    domain: string;
    ip: string;
    address: {
        address: string;
        city: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        postalCode: string;
        state: string;
    };
    macAddress: string;
    university: string;
    bank: {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    };
    company: {
        address: {
            address: string;
            city: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            postalCode: string;
            state: string;
        };
        department: string;
        name: string;
        title: string;
    };
    ein: string;
    ssn: string;
    userAgent: string;
    role: string;
}

export interface Order {
    id: number;
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
    products: {
        id: number;
        title: string;
        price: number;
        quantity: number;
        total: number;
        discountPercentage: number;
        discountedTotal: number;
        thumbnail: string;
    }[];
}

export interface AdminStats {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
    topProducts: any[];
    salesData: { month: string; sales: number }[];
}

interface AdminState {
    users: User[];
    orders: Order[];
    stats: AdminStats;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const initialState: AdminState = {
    users: [],
    orders: [],
    stats: {
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        topProducts: [],
        salesData: []
    },
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
};

// Async thunks
export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async ({ limit = 30, skip = 0 }: { limit?: number; skip?: number } = {}) => {
        const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
        const data = await response.json();
        return data;
    }
);

export const fetchOrders = createAsyncThunk(
    "admin/fetchOrders",
    async ({ limit = 30, skip = 0 }: { limit?: number; skip?: number } = {}) => {
        const response = await fetch(`https://dummyjson.com/carts?limit=${limit}&skip=${skip}`);
        const data = await response.json();
        return data;
    }
);

export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (userId: number) => {
        await fetch(`https://dummyjson.com/users/${userId}`, {
            method: 'DELETE',
        });
        return { userId };
    }
);

export const updateUserRole = createAsyncThunk(
    "admin/updateUserRole",
    async ({ userId, role }: { userId: number; role: string }) => {
        await fetch(`https://dummyjson.com/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role })
        });
        return { userId, role };
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateStats: (state) => {
            // Calculate stats from current data
            state.stats.totalUsers = state.users.length;
            state.stats.totalOrders = state.orders.length;
            state.stats.totalRevenue = state.orders.reduce((total, order) => total + order.discountedTotal, 0);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.totalPages = Math.ceil(action.payload.total / 30);
                state.stats.totalUsers = action.payload.total;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch users";
            })
            // Fetch Orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.carts;
                state.stats.totalOrders = action.payload.total;
                state.stats.totalRevenue = action.payload.carts.reduce(
                    (total: number, order: Order) => total + order.discountedTotal, 0
                );
                state.stats.recentOrders = action.payload.carts.slice(0, 5);
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch orders";
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload.userId);
            })
            // Update User Role
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const userIndex = state.users.findIndex(user => user.id === action.payload.userId);
                if (userIndex !== -1) {
                    state.users[userIndex].role = action.payload.role;
                }
            });
    }
});

export const { setCurrentPage, clearError, updateStats } = adminSlice.actions;
export default adminSlice.reducer;
