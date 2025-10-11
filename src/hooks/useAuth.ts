import { useState, useEffect, useCallback, useRef } from 'react';
import { authApi, AuthUser, LoginCredentials, RegisterData } from '../utils/api';

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<AuthUser>) => Promise<void>;
    updatePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
    const [state, setState] = useState<AuthState>(() => {
        const token = localStorage.getItem('token');
        return {
            user: null,
            token,
            isAuthenticated: !!token,
            isLoading: !!token, // Set to true if token exists on mount
            error: null,
        };
    });
    const isRefreshingRef = useRef(false);

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, isLoading: loading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    };

    const setAuth = (user: AuthUser, token: string) => {
        localStorage.setItem('token', token);
        setState(prev => ({
            ...prev,
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
        }));
    };

    const clearAuth = () => {
        localStorage.removeItem('token');
        setState(prev => ({
            ...prev,
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        }));
    };

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            const response = await authApi.login(credentials);
            const { user } = response.data.data;
            const { token } = response.data;
            setAuth(user, token);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            setError(message);
            throw error;
        }
    }, []);

    const register = useCallback(async (userData: RegisterData) => {
        try {
            setLoading(true);
            const response = await authApi.register(userData);
            const { user } = response.data.data;
            const { token } = response.data;
            setAuth(user, token);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            setError(message);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        // Call logout API in background, but don't wait for it
        authApi.logout().catch(() => { });
        clearAuth();
    }, []);

    const updateUser = useCallback(async (userData: Partial<AuthUser>) => {
        try {
            setLoading(true);
            const response = await authApi.updateDetails(userData);
            const { user } = response.data.data;
            setState(prev => ({
                ...prev,
                user,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Update failed';
            setError(message);
            throw error;
        }
    }, []);

    const updatePassword = useCallback(async (data: { currentPassword: string; newPassword: string }) => {
        try {
            setLoading(true);
            const response = await authApi.updatePassword(data);
            const { user } = response.data.data;
            const { token } = response.data;
            setAuth(user, token);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Password update failed';
            setError(message);
            throw error;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('refreshUser: No token found, clearing auth');
            clearAuth();
            return;
        }

        // Prevent multiple simultaneous refresh calls
        if (isRefreshingRef.current) {
            console.log('refreshUser: Already refreshing, skipping');
            return;
        }

        try {
            console.log('refreshUser: Fetching user data with token');
            isRefreshingRef.current = true;
            setLoading(true);
            const response = await authApi.getMe();
            const { user } = response.data.data;
            console.log('refreshUser: User data fetched successfully', user);
            setState(prev => ({
                ...prev,
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            console.error('refreshUser: Error fetching user', error);
            // If token is invalid, clear auth
            if (error.response?.status === 401) {
                console.log('refreshUser: Token invalid (401), clearing auth');
                clearAuth();
            } else {
                console.log('refreshUser: Other error, keeping token but showing error');
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Failed to fetch user data'
                }));
            }
        } finally {
            isRefreshingRef.current = false;
        }
    }, []);

    // Auto-fetch user data on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('useAuth mount effect - Token exists:', !!token, 'User exists:', !!state.user);

        if (token && !state.user && !state.error) {
            console.log('useAuth: Calling refreshUser on mount');
            refreshUser();
        } else if (!token) {
            console.log('useAuth: No token on mount, clearing auth state');
            clearAuth();
        } else if (state.user) {
            console.log('useAuth: User already loaded');
        }
    }, []); // Only run once on mount

    return {
        ...state,
        login,
        register,
        logout,
        updateUser,
        updatePassword,
        clearError,
        refreshUser,
    };
};