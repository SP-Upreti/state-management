import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
    const navigate = useNavigate();
    const { cart } = useAppContext();
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    const handleQuantityChange = async (itemId: number, quantity: number) => {
        if (quantity < 1) {
            handleRemoveItem(itemId);
            return;
        }

        setUpdatingItems(prev => new Set(prev).add(itemId));
        try {
            await cart.updateQuantity(itemId, quantity);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        setUpdatingItems(prev => new Set(prev).add(itemId));
        try {
            await cart.removeItem(itemId);
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await cart.clearCart();
            } catch (error) {
                console.error('Failed to clear cart:', error);
            }
        }
    };

    const handleContinueShopping = () => {
        onClose();
        navigate('/products');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                        Shopping Cart ({cart.totals.totalQuantity})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-md"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Loading State */}
                {cart.isLoading && (
                    <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        <span className="ml-2 text-sm text-gray-600">Loading cart...</span>
                    </div>
                )}

                {/* Error State */}
                {cart.error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-400">
                        <p className="text-sm text-red-700">{cart.error}</p>
                        <button
                            onClick={cart.clearError}
                            className="text-sm text-red-600 hover:text-red-800 mt-1"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.items.length === 0 ? (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L2 21m5-8v8m0-8h10m-9 8h9" />
                            </svg>
                            <p className="mt-4 text-gray-500">Your cart is empty</p>
                            <button
                                onClick={handleContinueShopping}
                                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => {
                                const isUpdating = updatingItems.has(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex items-center space-x-4 bg-gray-50 p-3 rounded-lg ${isUpdating ? 'opacity-50' : ''}`}
                                    >
                                        <img
                                            src={item.product.thumbnail}
                                            alt={item.product.title}
                                            className="h-16 w-16 rounded-md object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {item.product.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">{item.product.brand}</p>
                                            <p className="text-xs text-indigo-600">{item.product.category?.name}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={isUpdating}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300 disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    disabled={isUpdating || item.quantity >= item.product.stock}
                                                    className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300 disabled:opacity-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{item.product.stock} available</p>
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
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={isUpdating}
                                                className="text-red-500 text-xs hover:text-red-700 mt-1 disabled:opacity-50"
                                            >
                                                {isUpdating ? 'Removing...' : 'Remove'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {cart.items.length > 1 && (
                                <button
                                    onClick={handleClearCart}
                                    className="w-full text-red-600 text-sm hover:text-red-800 mt-4 py-2 border border-red-200 rounded-md hover:bg-red-50"
                                >
                                    Clear Cart
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.items.length > 0 && (
                    <div className="border-t border-gray-200 p-4 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${cart.totals.totalAmount.toFixed(2)}</span>
                            </div>
                            {cart.totals.totalSavings > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Savings</span>
                                    <span>-${cart.totals.totalSavings.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-medium border-t pt-2">
                                <span>Total</span>
                                <span>${cart.totals.totalDiscountedAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.isLoading}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
                        >
                            Checkout
                        </button>
                        <button
                            onClick={handleContinueShopping}
                            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
