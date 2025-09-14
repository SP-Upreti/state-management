import { useState } from "react";
import Image from "./Image"
import { useAppContext } from "../../contexts/AppContext";

interface ProductsInterface {
  id: number;
  images: string | string[];
  discountPercentage: number;
  title: string;
  price: number | string;
  thumbnail: string;
  brand?: string;
  category?: string;
  rating?: number;
  stock?: number;
}

export default function ProductCard({
  id,
  images,
  discountPercentage,
  title,
  price,
  thumbnail,
  brand,
  category,
  rating,
  stock
}: ProductsInterface) {
  const { cart } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  // Ensure price is a number and handle potential undefined/null values
  const safePrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const safeDiscountPercentage = typeof discountPercentage === 'number' ? discountPercentage : 0;
  const discountedPrice = safePrice * (1 - safeDiscountPercentage / 100);

  // Ensure images array is valid
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : thumbnail;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || !stock || stock <= 0) return;

    try {
      setIsAdding(true);
      await cart.addToCart(id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = !stock || stock <= 0;

  return (
    <li className="relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md hover:shadow-lg transition-shadow">
      <span className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <Image src={imageUrl} title={title} />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-sm font-medium text-white">
          {safeDiscountPercentage}% OFF
        </span>
        {isOutOfStock && (
          <span className="absolute top-0 right-0 m-2 rounded-full bg-red-600 px-2 text-sm font-medium text-white">
            Out of Stock
          </span>
        )}
      </span>
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl tracking-tight text-slate-900">
          {title.length > 20 ? title.substring(0, 20) + "..." : title}
        </h5>
        {brand && (
          <p className="text-sm text-gray-500 mt-1">{brand}</p>
        )}
        {category && (
          <p className="text-sm text-indigo-600 mt-1">{category}</p>
        )}
        <div className="mt-2 mb-4 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">${discountedPrice.toFixed(2)}</span>
            {safeDiscountPercentage > 0 && (
              <span className="text-sm text-slate-900 line-through ml-2">${safePrice.toFixed(2)}</span>
            )}
          </p>
          {stock && stock > 0 && (
            <p className="text-sm text-gray-500">{stock} in stock</p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAdding
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        {cart.error && (
          <p className="text-red-500 text-sm mt-2">{cart.error}</p>
        )}
      </div>
    </li>
  )
}

export function DefaultCard({
  id,
  images,
  discountPercentage,
  title,
  price,
  thumbnail,
  brand,
  category,
  rating,
  stock
}: ProductsInterface) {
  const { cart } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  // Ensure price is a number and handle potential undefined/null values
  const safePrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const safeDiscountPercentage = typeof discountPercentage === 'number' ? discountPercentage : 0;
  const discountedPrice = safePrice * (1 - safeDiscountPercentage / 100);

  // Ensure images array is valid
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : thumbnail;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || !stock || stock <= 0) return;

    try {
      setIsAdding(true);
      await cart.addToCart(id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = !stock || stock <= 0;

  return (
    <li className="relative flex flex-col overflow-hidden rounded-md border bg-white shadow-md hover:shadow-lg transition-shadow">
      <span className="relative mx-3 mt-3 flex h-24 sm:h-40 overflow-hidden rounded-xl" >
        <Image src={imageUrl} title={title} />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-sm font-medium text-white">
          {safeDiscountPercentage}% OFF
        </span>
        {isOutOfStock && (
          <span className="absolute top-0 right-0 m-2 rounded-full bg-red-600 px-2 text-xs font-medium text-white">
            Out of Stock
          </span>
        )}
      </span>
      <div className="mt-4 px-5 pb-4">
        <h5 className="sm:text-xl tracking-tight text-slate-900">
          {title.length > 20 ? title.substring(0, 20) + "..." : title}
        </h5>
        {brand && (
          <p className="text-sm text-gray-500 mt-1">{brand}</p>
        )}
        {category && (
          <p className="text-sm text-indigo-600 mt-1">{category}</p>
        )}
        <div className="mt-2 mb-4 flex items-center justify-between">
          <p>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">${discountedPrice.toFixed(2)}</span>
            {safeDiscountPercentage > 0 && (
              <span className="text-sm text-slate-900 line-through ml-2">${safePrice.toFixed(2)}</span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className={`w-full py-2 px-3 rounded-md transition-colors font-medium text-sm ${isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAdding
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        {cart.error && (
          <p className="text-red-500 text-xs mt-2">{cart.error}</p>
        )}
      </div>
    </li>
  )
}
