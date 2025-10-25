import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useAppContext } from '../../contexts/AppContext';
import LoadingSpinner from '../LoadingSpinner';
import Image from "../utils/Image"
import RecommendedProducts from './RecommendedProducts';

export default function Details() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { currentProduct, isLoading, error, fetchProduct, clearError } = useProducts();
    const { cart } = useAppContext();
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            const productId = parseInt(id, 10);
            if (!isNaN(productId)) {
                fetchProduct(productId);
                setSelectedImageIndex(0); // Reset to first image when product changes
            }
        }
    }, [id, fetchProduct]);

    // Clear any previous errors when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    if (!id || isNaN(parseInt(id, 10))) {
        return (
            <section className="max-w-7xl mx-auto p-4 lg:p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 text-lg">Invalid product ID</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-sm hover:bg-pink-600"
                    >
                        Back to Products
                    </button>
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto p-4 lg:p-6">
                <div className="flex justify-center items-center py-20">
                    <LoadingSpinner />
                </div>
            </section>
        );
    }

    if (error || !currentProduct) {
        return (
            <section className="max-w-7xl mx-auto p-4 lg:p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 text-lg mb-4">
                        {error || 'Product not found'}
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-pink-500 text-white px-6 py-2 rounded-sm hover:bg-pink-600"
                    >
                        Back to Products
                    </button>
                </div>
            </section>
        );
    }

    const discountedPrice = currentProduct.price * (1 - currentProduct.discountPercentage / 100);

    // Parse images if it's a string (from API)
    const productImages = (() => {
        if (typeof currentProduct.images === 'string') {
            try {
                return JSON.parse(currentProduct.images);
            } catch {
                return [currentProduct.thumbnail];
            }
        }
        return Array.isArray(currentProduct.images) ? currentProduct.images : [currentProduct.thumbnail];
    })();

    // Parse tags if it's a string
    const productTags = (() => {
        if (currentProduct.tags && typeof currentProduct.tags === 'string') {
            try {
                return JSON.parse(currentProduct.tags);
            } catch {
                return [];
            }
        }
        return Array.isArray(currentProduct.tags) ? currentProduct.tags : [];
    })();

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= currentProduct.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!currentProduct) return;

        try {
            await cart.addToCart(currentProduct.id, quantity);
            alert(`Added ${quantity} item(s) to cart!`);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/checkout');
    };

    return (
        <section className="max-w-7xl mx-auto p-4 lg:p-0 mt-4">
            <div className="lg:grid grid-cols-2 gap-8">
                <div className="">
                    <div className="w-full  aspect-video border bg-gray-100">
                        <Image title="product image" src={productImages[selectedImageIndex] || currentProduct.thumbnail} />
                    </div>
                    <div className="grid gap-4 overflow-auto my-4 grid-cols-5">
                        {productImages && productImages.length > 0 ? (
                            productImages.map((image: string, idx: number) => (
                                <div
                                    className={`h-[80px] flex justify-center items-center p-1 cursor-pointer transition-all duration-200 ${selectedImageIndex === idx
                                        ? 'bg-pink-200 border-2 border-pink-500'
                                        : 'bg-pink-50 border-2 border-transparent hover:bg-pink-100'
                                        }`}
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                >
                                    <Image title="product image" src={image} />
                                </div>
                            ))
                        ) : (
                            <div
                                className={`h-[80px] flex justify-center items-center p-1 cursor-pointer transition-all duration-200 ${selectedImageIndex === 0
                                        ? 'bg-pink-200 border-2 border-pink-500'
                                        : 'bg-pink-50 border-2 border-transparent hover:bg-pink-100'
                                    }`}
                                onClick={() => setSelectedImageIndex(0)}
                            >
                                <Image title="product image" src={currentProduct.thumbnail} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="">
                    <p className="uppercase text-gray-500">
                        {currentProduct.sku ? `SKU: ${currentProduct.sku}` : `sku ${currentProduct.id}-${currentProduct.category?.name || 'uncategorized'}`}
                    </p>
                    <h2 className="text-2xl font-semibold">{currentProduct.title}</h2>
                    <div className="flex gap-1 text-green-500 items-center mt-2 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8.587 8.236l2.598-5.232a.911.911 0 0 1 1.63 0l2.598 5.232l5.808.844a.902.902 0 0 1 .503 1.542l-4.202 4.07l.992 5.75c.127.738-.653 1.3-1.32.952L12 18.678l-5.195 2.716c-.666.349-1.446-.214-1.319-.953l.992-5.75l-4.202-4.07a.902.902 0 0 1 .503-1.54z"></path></svg>
                        <span className="text-sm px-1 capitalize font-semibold text-green-500">
                            {currentProduct.rating ? `${currentProduct.rating} rating` : 'average 4.0 ratings'}
                            {currentProduct.reviewCount && ` (${currentProduct.reviewCount} reviews)`}
                        </span>
                    </div>
                    <p className="font-semibold text-gray-600">Brand: <span className="text-zinc-800 font-semibold">{currentProduct.brand}</span></p>

                    {/* Availability Status */}
                    {currentProduct.availabilityStatus && (
                        <p className="font-semibold text-gray-600">
                            Stock: <span className={`font-semibold ${currentProduct.availabilityStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
                                {currentProduct.availabilityStatus}
                            </span>
                        </p>
                    )}

                    {/* Product Tags */}
                    {productTags && productTags.length > 0 && (
                        <div className="my-2">
                            <span className="font-semibold">Tags: </span>
                            <div className="flex gap-2 mt-1">
                                {productTags.map((tag: string, idx: number) => (
                                    <span key={idx} className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Description */}
                    {currentProduct.description && (
                        <div className="my-4">
                            <p className=" text-lg ">{currentProduct.description}</p>
                        </div>
                    )}

                    <p className="my-2 flex flex-col">
                        <span className="text-3xl font-semibold text-black-500">Rs. {discountedPrice.toFixed(2)}</span>
                        {currentProduct.discountPercentage > 0 && (
                            <span className="flex items-center">
                                <span className="line-through text-[#aaa]">Rs. {currentProduct.price}</span>
                                <span className="pl-3 font-semibold">-{currentProduct.discountPercentage}%</span>
                            </span>
                        )}
                    </p>

                    <div className="flex gap-2 my-4 mb-6 items-center">
                        <span className="font-semibold">Quantity:</span>
                        <div className="flex items-center">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className=" size-10 rounded-full border flex justify-center text-gray-400 items-center hover:text-pink-500 hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M4 11h16v2H4z"></path></svg>
                            </button>
                            <input
                                type="number"
                                min={1}
                                max={currentProduct.stock}
                                value={quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= currentProduct.stock) {
                                        setQuantity(value);
                                    }
                                }}
                                className="h-8 w-14 outline-none p-2 appearance-none text-center "
                            />
                            <button
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= currentProduct.stock}
                                className=" size-10 rounded-full border flex justify-center text-gray-400 items-center hover:text-pink-500 hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M21 13h-8v8h-2v-8H3v-2h8V3h2v8h8z"></path></svg>
                            </button>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                            ({currentProduct.stock} available)
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={handleBuyNow}
                            disabled={cart.isLoading || currentProduct.stock === 0}
                            className="bg-pink-500 px-6 py-2 rounded-sm min-w-[150px] capitalize text-white text-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cart.isLoading ? 'Processing...' : 'buy now'}
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={cart.isLoading || currentProduct.stock === 0}
                            className="border text-pink-500  px-6 py-2 rounded-sm min-w-[150px] capitalize border-pink-500 text-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cart.isLoading ? 'Adding...' : 'add to cart'}
                        </button>
                    </div>

                    {currentProduct.stock === 0 && (
                        <p className="text-red-500 mt-2 font-semibold">Out of Stock</p>
                    )}

                    {cart.error && (
                        <p className="text-red-500 mt-2">{cart.error}</p>
                    )}
                </div>
            </div>

            {/* Product Reviews Section */}
            {currentProduct.reviews && currentProduct.reviews.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                        Customer Reviews ({currentProduct.reviewCount || currentProduct.reviews.length})
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {currentProduct.reviews.map((review) => (
                            <div key={review.id} className="border p-4 rounded-sm border-gray-200 ">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xl">
                                            {review.user.firstName} {review.user.lastName}
                                        </span>
                                        {review.isVerifiedPurchase && (
                                            <span className=" text-green-500  rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} className='size-5' viewBox="0 0 12 12"><path fill="currentColor" d="m6.933.332l.113.101l.89.89l1.26.001a1.48 1.48 0 0 1 1.453 1.198l.02.138l.007.143l-.002 1.259l.893.892a1.48 1.48 0 0 1 .19 1.86l-.089.12l-.101.112l-.893.891l.001 1.258c0 .659-.432 1.224-1.056 1.415l-.136.035l-.142.023l-.144.007h-1.26l-.891.892a1.48 1.48 0 0 1-1.86.19l-.12-.089l-.112-.101l-.892-.893l-1.258.001A1.48 1.48 0 0 1 1.35 9.48l-.02-.139l-.006-.142V7.936l-.89-.89a1.48 1.48 0 0 1-.19-1.86l.088-.12l.101-.112l.89-.891l.001-1.26c0-.72.516-1.32 1.198-1.452l.139-.02l.142-.007h1.26l.891-.89a1.48 1.48 0 0 1 1.98-.102zm1.212 3.657l-.085.071L5.5 6.62L4.44 5.56a.63.63 0 0 0-.88 0a.63.63 0 0 0-.071.795l.071.085l1.5 1.5a.625.625 0 0 0 .804.065l.076-.065l3-3a.61.61 0 0 0 0-.88a.63.63 0 0 0-.795-.071"></path></svg>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, idx) => (
                                            <svg key={idx} width="16" height="16" className='size-7 text-pink-500' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z" className={`${idx < review.rating ? 'fill-pink-500' : 'fill-pink-200'}`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ))}
                                        <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{review.comment}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                    {review.helpfulCount > 0 && (
                                        <span>{review.helpfulCount} found this helpful</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Specifications */}
            {(currentProduct.weight || currentProduct.dimensions) && (
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentProduct.weight && (
                            <div>
                                <h4 className="font-semibold text-gray-700">Weight</h4>
                                <p className="text-sm text-gray-600">{currentProduct.weight} kg</p>
                            </div>
                        )}
                        {currentProduct.dimensions && (
                            <div>
                                <h4 className="font-semibold text-gray-700">Dimensions</h4>
                                <p className="text-sm text-gray-600">
                                    {typeof currentProduct.dimensions === 'object' ?
                                        JSON.stringify(currentProduct.dimensions) :
                                        currentProduct.dimensions
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Additional Product Information */}
            {(currentProduct.warrantyInformation || currentProduct.shippingInformation || currentProduct.returnPolicy) && (
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentProduct.warrantyInformation && (
                            <div>
                                <h4 className="font-semibold text-gray-700">Warranty</h4>
                                <p className="text-sm text-gray-600">{currentProduct.warrantyInformation}</p>
                            </div>
                        )}
                        {currentProduct.shippingInformation && (
                            <div>
                                <h4 className="font-semibold text-gray-700">Shipping</h4>
                                <p className="text-sm text-gray-600">{currentProduct.shippingInformation}</p>
                            </div>
                        )}
                        {currentProduct.returnPolicy && (
                            <div>
                                <h4 className="font-semibold text-gray-700">Return Policy</h4>
                                <p className="text-sm text-gray-600">{currentProduct.returnPolicy}</p>
                            </div>
                        )}
                    </div>
                    {currentProduct.minimumOrderQuantity && currentProduct.minimumOrderQuantity > 1 && (
                        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                            <p className="text-sm text-yellow-800">
                                <strong>Minimum Order Quantity:</strong> {currentProduct.minimumOrderQuantity} items
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Recommended Products - Content-based Filtering */}
            <RecommendedProducts currentProduct={currentProduct} />
        </section>
    )
}