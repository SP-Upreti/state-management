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

    // Show loading spinner while checking authentication
    if (auth.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!auth.isAuthenticated || !auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If admin access is required and user is not admin, show unauthorized
    if (requireAdmin && auth.user.role !== 'admin') {
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
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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