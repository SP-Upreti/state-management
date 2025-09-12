import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import LoadingSpinner from '../components/LoadingSpinner';

interface ShippingInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
}

const Checkout = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { items, totals, updateQuantity, removeItem, clearCart } = useCart(isAuthenticated);
    const { createOrder } = useOrders();

    // Calculate totals
    const { totalAmount, totalQuantity } = totals;

    const [currentStep, setCurrentStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
    });

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Shipping cost calculation
    const shippingCost = totalAmount > 100 ? 0 : 15;
    const tax = totalAmount * 0.08; // 8% tax
    const finalTotal = totalAmount + shippingCost + tax;

    useEffect(() => {
        if (items.length === 0) {
            navigate('/products');
        }
    }, [items.length, navigate]);

    const validateShippingInfo = () => {
        const newErrors: { [key: string]: string } = {};

        if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
        if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone is required';
        if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
        if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
        if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
        if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (shippingInfo.email && !emailRegex.test(shippingInfo.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePaymentInfo = () => {
        if (paymentMethod !== 'card') return true;

        const newErrors: { [key: string]: string } = {};

        if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
        if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
        if (!paymentInfo.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';

        const cardNumberRegex = /^\d{16}$/;
        if (paymentInfo.cardNumber && !cardNumberRegex.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (paymentInfo.expiryDate && !expiryRegex.test(paymentInfo.expiryDate)) {
            newErrors.expiryDate = 'Please enter MM/YY format';
        }

        const cvvRegex = /^\d{3,4}$/;
        if (paymentInfo.cvv && !cvvRegex.test(paymentInfo.cvv)) {
            newErrors.cvv = 'Please enter a valid CVV';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
        } else if (name === 'expiryDate') {
            // Format expiry date MM/YY
            let formatted = value.replace(/\D/g, '');
            if (formatted.length >= 2) {
                formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
            }
            setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
        } else {
            setPaymentInfo(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity > 0) {
            updateQuantity(id, quantity);
        }
    };

    const handleRemoveItem = (id: number) => {
        removeItem(id);
    };

    const handleNextStep = () => {
        if (currentStep === 1 && validateShippingInfo()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validatePaymentInfo()) {
            setCurrentStep(3);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            const shippingAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}, ${shippingInfo.country}`;

            const orderData = {
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.priceAtTime
                })),
                shippingAddress,
                totalAmount: finalTotal,
                discountedTotal: totalAmount
            };

            const order = await createOrder(orderData);

            // Clear cart and redirect to success page
            clearCart();
            navigate('/order-success', {
                state: {
                    orderId: order.id,
                    orderTotal: finalTotal,
                    shippingInfo,
                    items: items.length
                }
            });
        } catch (error) {
            console.error('Order placement failed:', error);
            setErrors({ submit: 'Failed to place order. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const steps = [
        { id: 1, title: 'Shipping', description: 'Delivery information' },
        { id: 2, title: 'Payment', description: 'Payment method' },
        { id: 3, title: 'Review', description: 'Order summary' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <nav aria-label="Progress">
                        <ol className="flex items-center justify-center">
                            {steps.map((step, stepIdx) => (
                                <li key={step.id} className={`${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} relative`}>
                                    <div className="flex items-center">
                                        <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step.id <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                                            }`}>
                                            <span className="text-sm font-medium text-white">{step.id}</span>
                                        </div>
                                        <div className="ml-4 min-w-0 flex flex-col">
                                            <span className={`text-sm font-medium ${step.id <= currentStep ? 'text-indigo-600' : 'text-gray-500'
                                                }`}>
                                                {step.title}
                                            </span>
                                            <span className="text-sm text-gray-500">{step.description}</span>
                                        </div>
                                    </div>
                                    {stepIdx !== steps.length - 1 && (
                                        <div className="absolute top-4 left-8 -ml-px mt-0.5 h-0.5 w-full bg-gray-300" />
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
                    {/* Main Content */}
                    <div className="lg:col-span-7">
                        {/* Step 1: Shipping Information */}
                        {currentStep === 1 && (
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Information</h2>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            First name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={shippingInfo.firstName}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Last name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={shippingInfo.lastName}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={shippingInfo.email}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingInfo.phone}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.address ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.city ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingInfo.state}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.state ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            ZIP / Postal code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingInfo.zipCode}
                                            onChange={handleShippingInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.zipCode ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Country *
                                        </label>
                                        <select
                                            name="country"
                                            value={shippingInfo.country}
                                            onChange={handleShippingInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Australia">Australia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment Information */}
                        {currentStep === 2 && (
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Information</h2>

                                {/* Payment Method Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Payment Method
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <input
                                                id="card"
                                                name="payment-method"
                                                type="radio"
                                                value="card"
                                                checked={paymentMethod === 'card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                                                Credit / Debit Card
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="paypal"
                                                name="payment-method"
                                                type="radio"
                                                value="paypal"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                                                PayPal
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Details */}
                                {paymentMethod === 'card' && (
                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Cardholder name *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardholderName"
                                                value={paymentInfo.cardholderName}
                                                onChange={handlePaymentInputChange}
                                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Card number *
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={paymentInfo.cardNumber}
                                                onChange={handlePaymentInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Expiry date *
                                            </label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={paymentInfo.expiryDate}
                                                onChange={handlePaymentInputChange}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={paymentInfo.cvv}
                                                onChange={handlePaymentInputChange}
                                                placeholder="123"
                                                maxLength={4}
                                                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.cvv ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'paypal' && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                        <p className="text-sm text-gray-600">
                                            You will be redirected to PayPal to complete your payment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Order Review */}
                        {currentStep === 3 && (
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Review</h2>

                                {/* Shipping Info Review */}
                                <div className="mb-6">
                                    <h3 className="text-md font-medium text-gray-900 mb-3">Shipping Address</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            {shippingInfo.firstName} {shippingInfo.lastName}<br />
                                            {shippingInfo.address}<br />
                                            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                                            {shippingInfo.country}<br />
                                            {shippingInfo.email}<br />
                                            {shippingInfo.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Method Review */}
                                <div className="mb-6">
                                    <h3 className="text-md font-medium text-gray-900 mb-3">Payment Method</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            {paymentMethod === 'card' ? (
                                                <>Card ending in {paymentInfo.cardNumber.slice(-4)}</>
                                            ) : (
                                                'PayPal'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-6 flex justify-between">
                            {errors.submit && (
                                <div className="flex-1 mr-4">
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-sm text-red-700">{errors.submit}</p>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handlePrevStep}
                                disabled={currentStep === 1}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${currentStep === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Previous
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    onClick={handleNextStep}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isProcessing && <LoadingSpinner size="sm" />}
                                    <span>{isProcessing ? 'Processing...' : 'Place Order'}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="mt-10 lg:mt-0 lg:col-span-5">
                        <div className="bg-white shadow-sm rounded-lg p-6 sticky top-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img
                                            src={item.product.thumbnail}
                                            alt={item.product.title}
                                            className="h-16 w-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {item.product.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">{item.product.brand}</p>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-red-500 text-sm hover:text-red-700 ml-2"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                ${item.total.toFixed(2)}
                                            </p>
                                            {item.discountPercentage > 0 && (
                                                <p className="text-xs text-gray-500 line-through">
                                                    ${(item.priceAtTime * item.quantity).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Totals */}
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal ({totalQuantity} items)</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between text-lg font-medium">
                                        <span>Total</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {totalAmount < 100 && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        Add ${(100 - totalAmount).toFixed(2)} more to get free shipping!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
