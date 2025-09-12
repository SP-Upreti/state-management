import { useDashboardStats, useProductAnalytics } from '../../hooks/admin';

const AdminAnalytics = () => {
    const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats('30');
    const { data: productAnalytics, isLoading: analyticsLoading, error: analyticsError } = useProductAnalytics();

    const isLoading = statsLoading || analyticsLoading;
    const hasError = statsError || analyticsError;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-600 text-lg font-semibold mb-2">Error loading analytics</div>
                    <div className="text-gray-600">Please try refreshing the page</div>
                </div>
            </div>
        );
    }

    // Use real data from API with fallbacks
    const salesData = stats?.salesData || [];
    const topProducts = productAnalytics?.lowStockProducts || [];
    const productsByCategory = productAnalytics?.productsByCategory || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Track your store's performance with detailed analytics and insights.
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 rounded-md bg-indigo-50">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                    <dd className="text-lg font-medium text-gray-900">${stats?.overview?.totalRevenue?.toLocaleString() || '0'}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 rounded-md bg-green-50">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats?.overview?.totalOrders?.toLocaleString() || '0'}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 rounded-md bg-yellow-50">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats?.overview?.totalUsers?.toLocaleString() || '0'}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 rounded-md bg-purple-50">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats?.overview?.totalProducts?.toLocaleString() || '0'}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Monthly Sales</h3>
                        <div className="space-y-3">
                            {salesData.length > 0 ? salesData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">{item.month}</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{ width: `${Math.min((item.sales / Math.max(...salesData.map(d => d.sales))) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-900 w-16 text-right">
                                            ${(item.sales / 1000).toFixed(0)}k
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500">No sales data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products by Category */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Products by Category</h3>
                        <div className="space-y-4">
                            {productsByCategory.length > 0 ? productsByCategory.map((category, index) => {
                                const maxProducts = Math.max(...productsByCategory.map(c => c.productCount));
                                const percentage = maxProducts > 0 ? (category.productCount / maxProducts) * 100 : 0;

                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                                <span className="text-sm text-gray-500">{category.productCount} products</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-sm text-gray-500">No category data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Low Stock Products</h3>
                    {topProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topProducts.slice(0, 6).map((product) => (
                                <div key={product.id} className="border rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="h-12 w-12 rounded-md object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Stock: {product.stock} units
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ${product.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No low stock products</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
