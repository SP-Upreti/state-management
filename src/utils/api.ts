import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API Types
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
    total?: number;
    pagination?: {
        page: number;
        limit: number;
        pages: number;
    };
}

export interface DashboardStats {
    overview: {
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        totalCategories: number;
        totalRevenue: number;
        avgOrderValue: number;
    };
    period: {
        newUsers: number;
        newProducts: number;
        newOrders: number;
        periodRevenue: number;
    };
    topProducts: Array<{
        productId: number;
        totalSold: number;
        totalRevenue: number;
        product: {
            title: string;
            thumbnail: string;
            price: number;
        };
    }>;
    recentOrders: Array<{
        id: number;
        userId: number;
        totalAmount: number;
        discountedTotal: number;
        status: string;
        paymentStatus: string;
        createdAt: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    }>;
    salesData: Array<{
        month: string;
        sales: number;
    }>;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    stats?: {
        totalOrders: number;
        totalSpent: number;
    };
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
    images: string[];
    stock: number;
    brand: string;
    categoryId: number;
    isActive: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: number;
        name: string;
    };
}

export interface Order {
    id: number;
    userId: number;
    totalAmount: number;
    discountedTotal: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items?: Array<{
        id: number;
        productId: number;
        quantity: number;
        price: number;
        total: number;
        product: {
            title: string;
            thumbnail: string;
        };
    }>;
}

export interface ProductAnalytics {
    productsByCategory: Array<{
        id: number;
        name: string;
        productCount: number;
    }>;
    lowStockProducts: Array<Product>;
    mostViewedProducts: Array<Product>;
    productsWithReviews: Array<{
        id: number;
        title: string;
        thumbnail: string;
        reviewCount: number;
        avgRating: number;
    }>;
}

// Admin API functions
export const adminApi = {
    // Dashboard Stats
    getDashboardStats: (period = '30') =>
        api.get<ApiResponse<DashboardStats>>(`/admin/stats?period=${period}`),

    // Users
    getUsers: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        isActive?: boolean;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.role) queryParams.append('role', params.role);
        if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

        return api.get<ApiResponse<{ users: User[] }>>(`/admin/users?${queryParams.toString()}`);
    },

    updateUserRole: (userId: number, role: 'user' | 'admin') =>
        api.put<ApiResponse<{ user: User }>>(`/admin/users/${userId}/role`, { role }),

    toggleUserStatus: (userId: number) =>
        api.put<ApiResponse<{ user: User }>>(`/admin/users/${userId}/status`),

    deleteUser: (userId: number) =>
        api.delete<ApiResponse>(`/admin/users/${userId}`),

    // Products Analytics
    getProductAnalytics: () =>
        api.get<ApiResponse<ProductAnalytics>>('/admin/products/analytics'),
};

// Products API
export const productsApi = {
    getProducts: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        order?: 'asc' | 'desc';
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.order) queryParams.append('order', params.order);

        return api.get<ApiResponse<{ products: Product[] }>>(`/products?${queryParams.toString()}`);
    },

    getProduct: (id: number) =>
        api.get<ApiResponse<{ product: Product }>>(`/products/${id}`),

    createProduct: (productData: Partial<Product>) =>
        api.post<ApiResponse<{ product: Product }>>('/products', productData),

    updateProduct: (id: number, productData: Partial<Product>) =>
        api.put<ApiResponse<{ product: Product }>>(`/products/${id}`, productData),

    deleteProduct: (id: number) =>
        api.delete<ApiResponse>(`/products/${id}`),
};

// Orders API
export const ordersApi = {
    getOrders: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        userId?: number;
        startDate?: string;
        endDate?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.userId) queryParams.append('userId', params.userId.toString());
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        return api.get<ApiResponse<{ orders: Order[] }>>(`/orders?${queryParams.toString()}`);
    },

    getOrder: (id: number) =>
        api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`),

    updateOrderStatus: (id: number, status: string) =>
        api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, { status }),

    createOrder: (orderData: {
        items: Array<{ productId: number; quantity: number; price: number }>;
        shippingAddress: string;
        totalAmount: number;
        discountedTotal: number;
    }) =>
        api.post<ApiResponse<{ order: Order }>>('/orders', orderData),
};

// Categories API
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
    productCount?: number;
    products?: Product[];
    createdAt: string;
    updatedAt: string;
}

export const categoriesApi = {
    getCategories: (includeProducts = false) =>
        api.get<ApiResponse<{ categories: Category[] }>>(`/categories?includeProducts=${includeProducts}`),

    getCategory: (id: number) =>
        api.get<ApiResponse<{ category: Category }>>(`/categories/${id}`),

    getCategoryBySlug: (slug: string) =>
        api.get<ApiResponse<{ category: Category }>>(`/categories/slug/${slug}`),

    createCategory: (categoryData: Partial<Category>) =>
        api.post<ApiResponse<{ category: Category }>>('/categories', categoryData),

    updateCategory: (id: number, categoryData: Partial<Category>) =>
        api.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, categoryData),

    deleteCategory: (id: number) =>
        api.delete<ApiResponse>(`/categories/${id}`),
};

// Authentication API
export interface AuthUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    image?: string;
    phone?: string;
    birthDate?: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    birthDate?: string;
}

export const authApi = {
    login: (credentials: LoginCredentials) =>
        api.post<ApiResponse<{ user: AuthUser }> & { token: string }>('/auth/login', credentials),

    register: (userData: RegisterData) =>
        api.post<ApiResponse<{ user: AuthUser }> & { token: string }>('/auth/register', userData),

    getMe: () =>
        api.get<ApiResponse<{ user: AuthUser }>>('/auth/me'),

    updateDetails: (userData: Partial<AuthUser>) =>
        api.put<ApiResponse<{ user: AuthUser }>>('/auth/updatedetails', userData),

    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.put<ApiResponse<{ user: AuthUser }> & { token: string }>('/auth/updatepassword', data),

    logout: () =>
        api.post<ApiResponse>('/auth/logout'),
};

// Cart API
export interface CartItem {
    id: number;
    quantity: number;
    priceAtTime: number;
    discountPercentage: number;
    discountedPrice: number;
    total: number;
    product: {
        id: number;
        title: string;
        thumbnail: string;
        brand: string;
        stock: number;
        category?: Category;
    };
}

export interface CartTotals {
    totalQuantity: number;
    totalAmount: number;
    totalDiscountedAmount: number;
    totalSavings: number;
}

export interface Cart {
    id: number;
    userId?: number;
    sessionId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const cartApi = {
    getCart: (sessionId?: string) => {
        const headers = sessionId ? { 'x-session-id': sessionId } : {};
        return api.get<ApiResponse<{ cart: Cart | null; items: CartItem[]; totals: CartTotals }>>('/cart', { headers });
    },

    addToCart: (data: { productId: number; quantity: number }, sessionId?: string) => {
        const headers = sessionId ? { 'x-session-id': sessionId } : {};
        return api.post<ApiResponse<{ totals: CartTotals }>>('/cart/add', data, { headers });
    },

    updateCartItem: (itemId: number, data: { quantity: number }, sessionId?: string) => {
        const headers = sessionId ? { 'x-session-id': sessionId } : {};
        return api.put<ApiResponse>(`/cart/items/${itemId}`, data, { headers });
    },

    removeFromCart: (itemId: number, sessionId?: string) => {
        const headers = sessionId ? { 'x-session-id': sessionId } : {};
        return api.delete<ApiResponse>(`/cart/items/${itemId}`, { headers });
    },

    clearCart: (sessionId?: string) => {
        const headers = sessionId ? { 'x-session-id': sessionId } : {};
        return api.delete<ApiResponse>('/cart/clear', { headers });
    },

    mergeCart: (sessionId: string) =>
        api.post<ApiResponse>('/cart/merge', { sessionId }),
};

export default api;