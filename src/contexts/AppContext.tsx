import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

interface AppContextType {
    auth: ReturnType<typeof useAuth>;
    cart: ReturnType<typeof useCart>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const auth = useAuth();
    const cart = useCart(auth.isAuthenticated);

    // Auto-merge guest cart when user logs in
    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            const guestSessionId = localStorage.getItem('guest_session_id');
            if (guestSessionId) {
                cart.mergeCart(guestSessionId).catch(console.error);
            }
        }
    }, [auth.isAuthenticated, auth.user, cart]);

    const value: AppContextType = {
        auth,
        cart,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};