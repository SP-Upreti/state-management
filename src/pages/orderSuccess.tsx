import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/bill.css';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const billRef = useRef<HTMLDivElement>(null);
    const { orderId, orderTotal, subtotal, shipping, tax, shippingInfo, paymentMethod, items, orderDate } = location.state || {};

    useEffect(() => {
        if (!orderTotal) {
            navigate('/products');
        }
    }, [orderTotal, navigate]);

    const orderNumber = orderId || Math.random().toString(36).substr(2, 9).toUpperCase();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const handleDownloadBill = () => {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow && billRef.current) {
            printWindow.document.write('<html><head><title>Order Bill</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
                body { font-family: Arial, sans-serif; padding: 40px; }
                .bill-container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .company-name { font-size: 28px; font-weight: bold; color: #ec4899; margin-bottom: 5px; }
                .bill-title { font-size: 20px; font-weight: bold; margin-top: 10px; }
                .section { margin-bottom: 25px; }
                .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
                .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                .info-label { font-weight: 600; color: #555; }
                .info-value { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
                td { padding: 12px; border-bottom: 1px solid #eee; }
                .totals { margin-top: 20px; }
                .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
                .final-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
                .payment-badge { display: inline-block; padding: 4px 12px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-size: 12px; font-weight: 600; }
            `);
            printWindow.document.write('</style></head><body>');
            printWindow.document.write(billRef.current.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    };

    if (!orderTotal) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Message */}
                <div className="bg-white shadow-sm rounded-lg p-6 mb-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
                </div>

                {/* Bill Section */}
                <div className="bg-white shadow-sm rounded-lg p-8 mb-6">
                    <div ref={billRef}>
                        <div className="bill-container">
                            {/* Header */}
                            <div className="header">
                                <div className="company-name">E-Commerce Store</div>
                                <div className="text-sm text-gray-600">123 Business Street, City, State 12345</div>
                                <div className="text-sm text-gray-600">Phone: (123) 456-7890 | Email: support@example.com</div>
                                <div className="bill-title">ORDER INVOICE</div>
                            </div>

                            {/* Order Info */}
                            <div className="section">
                                <div className="section-title">Order Information</div>
                                <div className="info-row">
                                    <span className="info-label">Order Number:</span>
                                    <span className="info-value">#{orderNumber}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Order Date:</span>
                                    <span className="info-value">{new Date(orderDate).toLocaleString()}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Payment Method:</span>
                                    <span className="info-value">
                                        {paymentMethod === 'card' ? 'Debit/Credit Card' : 'Cash on Delivery'}
                                        {paymentMethod === 'cod' && <span className="payment-badge ml-2">COD</span>}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Estimated Delivery:</span>
                                    <span className="info-value">{estimatedDelivery.toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {shippingInfo && (
                                <div className="section">
                                    <div className="section-title">Shipping Address</div>
                                    <div className="info-row">
                                        <span className="info-label">Name:</span>
                                        <span className="info-value">{shippingInfo.firstName} {shippingInfo.lastName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Address:</span>
                                        <span className="info-value">{shippingInfo.address}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">City, State ZIP:</span>
                                        <span className="info-value">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Country:</span>
                                        <span className="info-value">{shippingInfo.country}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Phone:</span>
                                        <span className="info-value">{shippingInfo.phone}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{shippingInfo.email}</span>
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="section">
                                <div className="section-title">Order Items</div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items && items.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="font-medium">{item.product.title}</div>
                                                    <div className="text-sm text-gray-500">{item.product.brand}</div>
                                                </td>
                                                <td>${item?.priceAtTime || 0}</td>
                                                <td>{item?.quantity}</td>
                                                <td>${item?.total || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="totals">
                                <div className="total-row">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Shipping:</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="total-row">
                                    <span>Tax (8%):</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="total-row final-total">
                                    <span>Total Amount:</span>
                                    <span>${orderTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="footer">
                                <p>Thank you for shopping with us!</p>
                                <p>For any queries, please contact our customer support.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <button
                        onClick={handleDownloadBill}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-sm hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Bill
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-pink-600 text-white font-medium rounded-sm hover:bg-pink-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-white text-gray-700 font-medium rounded-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Go to Homepage
                    </button>
                </div>

                {/* Next Steps */}
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-pink-900 mb-2">What happens next?</h3>
                    <div className="text-sm text-pink-700 space-y-1">
                        <p>• You'll receive an email confirmation shortly</p>
                        <p>• We'll send you tracking information once your order ships</p>
                        <p>• Your order will be delivered within 3-7 business days</p>
                        {paymentMethod === 'cod' && <p>• Please keep the exact amount ready for cash on delivery</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
