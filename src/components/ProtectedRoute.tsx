import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { auth } = useAppContext();
    const location = useLocation();

    // Debug logging
    console.log('ProtectedRoute check:', {
        path: location.pathname,
        isAuthenticated: auth.isAuthenticated,
        hasUser: !!auth.user,
        isLoading: auth.isLoading,
        user: auth.user,
        token: !!auth.token
    });

    // Show loading spinner while checking authentication
    if (auth.isLoading) {
        console.log('ProtectedRoute: Showing loading spinner');
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    console.log(auth)

    // If not authenticated, redirect to login
    if (!auth.isAuthenticated) {
        console.log('ProtectedRoute: Redirecting to login', {
            isAuthenticated: auth.isAuthenticated,
            hasUser: !!auth.user,
            hasToken: !!auth.token,
            hasError: !!auth.error
        });

        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If admin access is required and user is not admin, show unauthorized
    if (requireAdmin && (!auth.user || auth.user.role !== 'admin')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-24 w-24 text-red-400">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" />
                        </svg>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Unauthorized
                    </h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">
                        You don't have permission to access this page. Admin access required.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <button
                            onClick={() => window.history.back()}
                            className="rounded-sm bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                        >
                            Go back
                        </button>
                        <a href="/" className="text-sm font-semibold text-gray-900">
                            Go home <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // If all checks pass, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute;