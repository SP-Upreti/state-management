import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { addToCart } from '../../store/cart/cartSlice';
import Image from "../utils/Image"

interface DetailsProps {
    product?: any;
}

export default function Details({ product }: DetailsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    // Default product data if none provided
    const defaultProduct = {
        id: 1,
        title: "Custom Makeup Bag | Portable Pu Leather | Waterproof Toiletry Pouch | Travel Make Up Bag for Women",
        price: 1480,
        discountPercentage: 20,
        brand: "Famous Brand",
        category: "beauty",
        rating: 5,
        stock: 50,
        thumbnail: "https://img.freepik.com/free-vector/realistic-can-podium-bottle-natural-ice-green-tea_1268-15509.jpg?t=st=1737615345~exp=1737618945~hmac=ef1eed848cfed00139730770c9f164576b2bac3ea28105dd92a8ce279fac386f&w=1060",
        images: Array(5).fill("https://img.freepik.com/free-vector/jar-tube-with-golden-lid-round-marble-podium-stage_88138-803.jpg?t=st=1737617614~exp=1737621214~hmac=3e41baced4aae752199d4f732e62c43175bff8e3722c249c7a01e0a03fa1695b&w=1060")
    };

    const currentProduct = product || defaultProduct;
    const discountedPrice = currentProduct.price * (1 - currentProduct.discountPercentage / 100);

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= currentProduct.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart(currentProduct));
        }
        // Show success message or notification here
        alert(`Added ${quantity} item(s) to cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    return (
        <section className="max-w-7xl mx-auto lg:grid grid-cols-2 gap-8 p-4 lg:p-6 ">
            <div className="">
                <div className="min-h-[200px]">
                    <Image title="product image" src={currentProduct.thumbnail} />
                </div>
                <div className="grid gap-4 overflow-auto my-4 grid-cols-5">
                    {currentProduct.images.map((image: string, idx: number) => (
                        <div className="bg-indigo-50 h-[80px] flex justify-center items-center p-1 cursor-pointer" key={idx}>
                            <Image title="product image" src={image} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="">
                <p className="uppercase text-gray-300">sku {currentProduct.id}-{currentProduct.category}</p>
                <h2 className="text-2xl font-semibold">{currentProduct.title}</h2>
                <div className="flex gap-1 items-center my-4">
                    {Array.from({ length: 5 }, (_, idx) => (
                        <span key={idx}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z" className={`${idx < Math.round(currentProduct.rating) ? 'fill-yellow-500' : 'fill-gray-300'}`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    ))}
                    <span className="text-sm px-4 capitalize font-semibold text-indigo-500">
                        average {currentProduct.rating} ratings
                    </span>
                </div>
                <p className="font-semibold">Brand: <span className="text-blue-500 font-semibold">{currentProduct.brand}</span></p>
                <p className="my-2 flex flex-col">
                    <span className="text-3xl font-semibold text-yellow-500">Rs. {discountedPrice.toFixed(2)}</span>
                    {currentProduct.discountPercentage > 0 && (
                        <span className="flex items-center">
                            <span className="line-through text-[#aaa]">Rs. {currentProduct.price}</span>
                            <span className="pl-3 font-semibold">-{currentProduct.discountPercentage}%</span>
                        </span>
                    )}
                </p>
                <div className="flex gap-2 my-3 items-center">
                    <span className="font-semibold">Color: </span>
                    <span className="h-5 w-5 flex bg-blue-500 rounded-sm cursor-pointer border-2 border-transparent hover:border-blue-700"></span>
                    <span className="h-5 w-5 flex bg-red-500 rounded-sm cursor-pointer border-2 border-transparent hover:border-red-700"></span>
                    <span className="h-5 w-5 flex bg-yellow-500 rounded-sm cursor-pointer border-2 border-transparent hover:border-yellow-700"></span>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className="h-8 text-lg font-semibold w-8 bg-indigo-50 flex justify-center items-center hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            -
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
                            className="h-8 w-14 outline-none p-2 appearance-none text-center border"
                        />
                        <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= currentProduct.stock}
                            className="h-8 text-lg font-semibold w-8 bg-indigo-50 flex justify-center items-center hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                        ({currentProduct.stock} available)
                    </span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <button
                        onClick={handleBuyNow}
                        className="bg-indigo-500 px-6 py-2 rounded-md min-w-[150px] capitalize text-white text-lg font-semibold hover:bg-indigo-600 transition-colors"
                    >
                        buy now
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="bg-yellow-500 px-6 py-2 rounded-md min-w-[150px] capitalize text-white text-lg font-semibold hover:bg-yellow-600 transition-colors"
                    >
                        add to cart
                    </button>
                </div>
            </div>
        </section>
    )
}