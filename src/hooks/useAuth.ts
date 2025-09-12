import { useState, useEffect, useCallback } from 'react';
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
    const [state, setState] = useState<AuthState>({
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: !!localStorage.getItem('token'),
        isLoading: false,
        error: null,
    });

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
        if (!state.token) return;

        try {
            setLoading(true);
            const response = await authApi.getMe();
            const { user } = response.data.data;
            setState(prev => ({
                ...prev,
                user,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            // If token is invalid, clear auth
            if (error.response?.status === 401) {
                clearAuth();
            } else {
                setError('Failed to fetch user data');
            }
        }
    }, [state.token]);

    // Auto-fetch user data on mount if token exists
    useEffect(() => {
        if (state.token && !state.user) {
            refreshUser();
        }
    }, [state.token, state.user, refreshUser]);

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