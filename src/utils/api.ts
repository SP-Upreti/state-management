import axios from 'axios';
import { OrderResponse, Order } from '../components/order';

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
        // Only redirect on 401 if it's not a login/register request
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token');
            // Use React Router navigation instead of window.location
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
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
    images: string[] | string;
    stock: number;
    brand: string;
    categoryId: number;
    isActive: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
    // Additional fields from the API
    rating?: number;
    sku?: string;
    weight?: number | null;
    dimensions?: any | null;
    warrantyInformation?: string | null;
    shippingInformation?: string | null;
    availabilityStatus?: string;
    returnPolicy?: string | null;
    minimumOrderQuantity?: number;
    tags?: string[] | string;
    isFeatured?: boolean;
    deletedAt?: string | null;
    createdBy?: number | null;
    category?: {
        id: number;
        name: string;
        slug?: string;
    };
    reviews?: Array<{
        id: number;
        rating: number;
        comment: string;
        isVerifiedPurchase: boolean;
        isApproved: boolean;
        helpfulCount: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        userId: number;
        productId: number;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            image: string | null;
        };
    }>;
    reviewCount?: number;
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

    // Advanced BM25 Search
    searchProducts: (params: {
        q: string;
        limit?: number;
        includeScore?: boolean;
    }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('q', params.q);
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.includeScore) queryParams.append('includeScore', params.includeScore.toString());

        return api.get<ApiResponse<{ products: Product[]; algorithm: string }>>(`/products/search?${queryParams.toString()}`);
    },

    // Get search suggestions (autocomplete)
    getSearchSuggestions: (query: string, limit = 5) => {
        const queryParams = new URLSearchParams();
        if (query) queryParams.append('q', query);
        if (limit) queryParams.append('limit', limit.toString());

        return api.get<ApiResponse<{ suggestions: Array<{ text: string; score: number }> }>>(`/products/suggestions?${queryParams.toString()}`);
    },

    getProduct: (id: number) =>
        api.get<ApiResponse<{ product: Product }>>(`/products/${id}`),

    getRecentProducts: (limit = 10) =>
        api.get<ApiResponse<{ products: Product[] }>>(`/products/recent?limit=${limit}`),

    getPopularProducts: (limit = 10) =>
        api.get<ApiResponse<{ products: Product[] }>>(`/products/popular?limit=${limit}`),

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
        isAdmin?: boolean;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.userId) queryParams.append('userId', params.userId.toString());
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        // Use admin endpoint if isAdmin is true
        const endpoint = params?.isAdmin ? '/orders/admin/all' : '/orders';
        return api.get<OrderResponse>(`${endpoint}?${queryParams.toString()}`);
    },

    getOrder: (id: number) =>
        api.get<OrderResponse>(`/orders/${id}`),

    updateOrderStatus: (id: number, status: string) =>
        api.put<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, { status }),

    createOrder: (orderData: {
        shippingAddress: {
            firstName: string;
            lastName: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            phone?: string;
        };
        billingAddress?: {
            firstName: string;
            lastName: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
        paymentMethod: 'card' | 'paypal' | 'cash_on_delivery';
        paymentId?: string;
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
    imageUrl?: string;
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

    createCategory: (categoryData: Partial<Category> | FormData) => {
        const headers = categoryData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        return api.post<ApiResponse<{ category: Category }>>('/categories', categoryData, { headers });
    },

    updateCategory: (id: number, categoryData: Partial<Category> | FormData) => {
        const headers = categoryData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        return api.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, categoryData, { headers });
    },

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