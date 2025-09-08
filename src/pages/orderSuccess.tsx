import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderTotal, shippingInfo, items } = location.state || {};

    useEffect(() => {
        if (!orderTotal) {
            navigate('/products');
        }
    }, [orderTotal, navigate]);

    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    if (!orderTotal) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <svg
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                    </p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Order Details</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Order Number:</span> #{orderNumber}</p>
                                    <p><span className="font-medium">Total Amount:</span> ${orderTotal.toFixed(2)}</p>
                                    <p><span className="font-medium">Items:</span> {items} item{items > 1 ? 's' : ''}</p>
                                    <p><span className="font-medium">Estimated Delivery:</span> {estimatedDelivery.toLocaleDateString()}</p>
                                </div>
                            </div>

                            {shippingInfo && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                                    <div className="text-sm text-gray-600">
                                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                                        <p>{shippingInfo.address}</p>
                                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                                        <p>{shippingInfo.country}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
                        <div className="text-sm text-blue-700 text-left space-y-1">
                            <p>• You'll receive an email confirmation shortly</p>
                            <p>• We'll send you tracking information once your order ships</p>
                            <p>• Your order will be delivered within 3-7 business days</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Go to Homepage
                        </button>
                    </div>

                    {/* Support Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need help? Contact our customer support at{' '}
                            <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-500">
                                support@example.com
                            </a>{' '}
                            or call{' '}
                            <a href="tel:+1234567890" className="text-indigo-600 hover:text-indigo-500">
                                (123) 456-7890
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
