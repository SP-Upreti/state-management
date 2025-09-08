import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrders, setCurrentPage } from '../../store/admin/adminSlice';

const AdminOrders = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, currentPage, totalPages } = useSelector((state: RootState) => state.admin);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        dispatch(fetchOrders({ limit: 30, skip: (currentPage - 1) * 30 }));
    }, [dispatch, currentPage]);

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    const getStatusColor = (total: number) => {
        if (total > 2000) return 'bg-green-100 text-green-800';
        if (total > 1000) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getStatusText = (total: number) => {
        if (total > 2000) return 'High Value';
        if (total > 1000) return 'Medium Value';
        return 'Low Value';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage and track all customer orders.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <option value="">All Orders</option>
                        <option value="high">High Value ($2000+)</option>
                        <option value="medium">Medium Value ($1000-$2000)</option>
                        <option value="low">Low Value (&lt;$1000)</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <li key={order.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Order #{order.id}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.discountedTotal)}`}>
                                                {getStatusText(order.discountedTotal)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Customer ID: {order.userId} • {order.totalProducts} items • {order.totalQuantity} total quantity
                                        </p>
                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Original: ${order.total.toFixed(2)}</span>
                                            <span>Final: ${order.discountedTotal.toFixed(2)}</span>
                                            <span className="text-green-600">
                                                Saved: ${(order.total - order.discountedTotal).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900">
                                            ${order.discountedTotal.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.totalProducts} {order.totalProducts === 1 ? 'item' : 'items'}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Process order:', order.id);
                                            }}
                                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                                        >
                                            Process
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {orders.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No orders match your current filter criteria.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedOrder(null)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Order #{selectedOrder.id} Details
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Customer ID</p>
                                                    <p className="text-lg text-gray-900">{selectedOrder.userId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                                    <p className="text-lg text-gray-900">${selectedOrder.discountedTotal.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Total Items</p>
                                                    <p className="text-lg text-gray-900">{selectedOrder.totalProducts}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                                                    <p className="text-lg text-gray-900">{selectedOrder.totalQuantity}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-md font-medium text-gray-900 mb-3">Order Items</h4>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <ul className="divide-y divide-gray-200">
                                                        {selectedOrder.products.map((product: any) => (
                                                            <li key={product.id} className="p-4 flex items-center space-x-4">
                                                                <img
                                                                    src={product.thumbnail}
                                                                    alt={product.title}
                                                                    className="h-12 w-12 rounded-md object-cover"
                                                                />
                                                                <div className="flex-1">
                                                                    <h5 className="text-sm font-medium text-gray-900">{product.title}</h5>
                                                                    <p className="text-sm text-gray-500">
                                                                        Qty: {product.quantity} × ${product.price.toFixed(2)}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        ${product.discountedTotal.toFixed(2)}
                                                                    </p>
                                                                    {product.discountPercentage > 0 && (
                                                                        <p className="text-xs text-green-600">
                                                                            {product.discountPercentage}% off
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
