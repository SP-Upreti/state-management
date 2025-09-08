import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { closeCart, removeFromCart, updateQuantity } from '../../store/cart/cartSlice';

const CartSidebar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items, totalAmount, totalQuantity, isOpen } = useSelector((state: RootState) => state.cart);

    const handleCheckout = () => {
        dispatch(closeCart());
        navigate('/checkout');
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id, quantity }));
        } else {
            dispatch(removeFromCart(id));
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"
                onClick={() => dispatch(closeCart())}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                        Shopping Cart ({totalQuantity})
                    </h2>
                    <button
                        onClick={() => dispatch(closeCart())}
                        className="p-2 hover:bg-gray-100 rounded-md"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L2 21m5-8v8m0-8h10m-9 8h9" />
                            </svg>
                            <p className="mt-4 text-gray-500">Your cart is empty</p>
                            <button
                                onClick={() => {
                                    dispatch(closeCart());
                                    navigate('/products');
                                }}
                                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-16 w-16 rounded-md object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-500">{item.brand}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            ${item.total.toFixed(2)}
                                        </p>
                                        {item.discountPercentage > 0 && (
                                            <p className="text-xs text-gray-500 line-through">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            className="text-red-500 text-xs hover:text-red-700 mt-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-200 p-4 space-y-4">
                        <div className="flex justify-between text-lg font-medium">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 font-medium"
                        >
                            Checkout
                        </button>
                        <button
                            onClick={() => dispatch(closeCart())}
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
