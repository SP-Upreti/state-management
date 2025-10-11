import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useOrders } from '../hooks/useOrders';
import Navbar from '../components/navigation/navbar';
import Footer from '../components/footer/footer';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
    const { auth } = useAppContext();
    const { orders, isLoading, error, fetchOrders } = useOrders();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: auth.user?.firstName || '',
        lastName: auth.user?.lastName || '',
        email: auth.user?.email || '',
        phone: auth.user?.phone || '',
        birthDate: auth.user?.birthDate || '',
    });

    // Fetch orders when the orders tab is active
    useEffect(() => {
        if (activeTab === 'orders' && auth.user?.id) {
            fetchOrders({ userId: auth.user.id });
        }
    }, [activeTab, auth.user?.id, fetchOrders]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await auth.updateUser(formData);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: auth.user?.firstName || '',
            lastName: auth.user?.lastName || '',
            email: auth.user?.email || '',
            phone: auth.user?.phone || '',
            birthDate: auth.user?.birthDate || '',
        });
        setIsEditing(false);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={auth.user?.image || 'https://randomuser.me/api/portraits/men/46.jpg'}
                                    alt="Profile"
                                    className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-50"
                                />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {auth.user?.firstName} {auth.user?.lastName}
                                    </h1>
                                    <p className="text-gray-500">{auth.user?.email}</p>
                                    <span className={`inline-block px-3 py-1 mt-2 text-xs font-semibold rounded-full ${auth.user?.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {auth.user?.role === 'admin' ? 'Admin' : 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-6 text-sm font-medium ${activeTab === 'profile'
                                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`py-4 px-6 text-sm font-medium ${activeTab === 'orders'
                                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    My Orders
                                </button>
                            </nav>
                        </div>

                        <div className="p-6 sm:p-8">
                            {activeTab === 'profile' && (
                                <div>
                                    {auth.error && (
                                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                            {auth.error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    disabled={!isEditing}
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full !border border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 px-2 py-2"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    disabled={!isEditing}
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full !border border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 px-2 py-2"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    disabled={true}
                                                    value={formData.email}
                                                    className="mt-1 block w-full !border border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 px-2 py-2"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    disabled={!isEditing}
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full !border border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 px-2 py-2"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                                    Birth Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="birthDate"
                                                    id="birthDate"
                                                    disabled={!isEditing}
                                                    value={formData.birthDate}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full !border border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 px-2 py-2"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    value={auth.user?.username || ''}
                                                    className="mt-1 block w-full !border border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 px-2 py-2"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                            {isEditing ? (
                                                <div className="flex space-x-3">
                                                    <button
                                                        type="submit"
                                                        disabled={auth.isLoading}
                                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                                    >
                                                        {auth.isLoading ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancel}
                                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(true)}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Edit Profile
                                                </button>
                                            )}
                                        </div>
                                    </form>

                                    {/* Additional Info */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {auth.user?.createdAt
                                                        ? new Date(auth.user.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : 'N/A'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                                                <dd className="mt-1 text-sm text-gray-900 capitalize">{auth.user?.role || 'N/A'}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    {isLoading ? (
                                        <div className="flex justify-center py-12">
                                            <LoadingSpinner />
                                        </div>
                                    ) : error ? (
                                        <div className="text-center py-12">
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                                {error}
                                            </div>
                                            <button
                                                onClick={() => fetchOrders({ userId: auth.user?.id })}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    ) : orders.length === 0 ? (
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
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                                            <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                                            <div className="mt-6">
                                                <Link
                                                    to="/products"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    Browse Products
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                Order #{order.id}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="mt-3 sm:mt-0 flex flex-col items-start sm:items-end space-y-2">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                    order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                                order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Order Items */}
                                                    {order.items && order.items.length > 0 && (
                                                        <div className="space-y-3 mb-4">
                                                            {order.items.map((item) => (
                                                                <div key={item.id} className="flex items-center space-x-4">
                                                                    <img
                                                                        src={item.product.thumbnail}
                                                                        alt={item.product.title}
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <h4 className="text-sm font-medium text-gray-900">
                                                                            {item.product.title}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-500">
                                                                            Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-sm font-semibold text-gray-900">
                                                                        ${parseFloat(item.total).toFixed(2)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Order Total */}
                                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                                        {parseFloat(order.totalAmount) !== parseFloat(order.discountedTotal) && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Subtotal:</span>
                                                                <span className="text-gray-900">${parseFloat(order.totalAmount).toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                        {parseFloat(order.totalAmount) !== parseFloat(order.discountedTotal) && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Discount:</span>
                                                                <span className="text-green-600">
                                                                    -${(parseFloat(order.totalAmount) - parseFloat(order.discountedTotal)).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-base font-semibold">
                                                            <span className="text-gray-900">Total:</span>
                                                            <span className="text-gray-900">${parseFloat(order.discountedTotal).toFixed(2)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Shipping Address */}
                                                    {order.shippingAddress && (() => {
                                                        try {
                                                            const address = typeof order.shippingAddress === 'string'
                                                                ? JSON.parse(order.shippingAddress)
                                                                : order.shippingAddress;
                                                            return (
                                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                                                                    <div className="text-sm text-gray-600 space-y-1">
                                                                        <p className="font-medium text-gray-900">
                                                                            {address.firstName} {address.lastName}
                                                                        </p>
                                                                        <p>{address.address}</p>
                                                                        <p>
                                                                            {address.city}, {address.state} {address.zipCode}
                                                                        </p>
                                                                        <p>{address.country}</p>
                                                                        {address.phone && (
                                                                            <p className="mt-2 text-gray-500">
                                                                                Phone: {address.phone}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } catch (e) {
                                                            return (
                                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                                                                    <p className="text-sm text-gray-600 whitespace-pre-line">
                                                                        {order.shippingAddress}
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;
