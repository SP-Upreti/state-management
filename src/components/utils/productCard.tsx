import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { addToCart } from '../../store/cart/cartSlice';
import Image from "./Image"

interface ProductsInterface {
  id: number;
  images: string[];
  discountPercentage: number;
  title: string;
  price: number;
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
  const dispatch = useDispatch<AppDispatch>();

  const discountedPrice = price * (1 - discountPercentage / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const product = {
      id,
      title,
      price,
      discountPercentage,
      thumbnail: thumbnail || images[0],
      brand: brand || '',
      category: category || '',
      rating: rating || 0,
      stock: stock || 0
    };

    dispatch(addToCart(product));
    alert('Product added to cart!');
  };

  return (
    <li className="relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md hover:shadow-lg transition-shadow">
      <span className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <Image src={images[0]} title={title} />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-sm font-medium text-white">
          {discountPercentage}% OFF
        </span>
      </span>
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl tracking-tight text-slate-900">
          {title.length > 20 ? title.substring(0, 20) + "..." : title}
        </h5>
        {brand && (
          <p className="text-sm text-gray-500 mt-1">{brand}</p>
        )}
        <div className="mt-2 mb-4 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">${discountedPrice.toFixed(2)}</span>
            <span className="text-sm text-slate-900 line-through ml-2">${price.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
        >
          Add to Cart
        </button>
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
  const dispatch = useDispatch<AppDispatch>();

  const discountedPrice = price * (1 - discountPercentage / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const product = {
      id,
      title,
      price,
      discountPercentage,
      thumbnail: thumbnail || images[0],
      brand: brand || '',
      category: category || '',
      rating: rating || 0,
      stock: stock || 0
    };

    dispatch(addToCart(product));
    alert('Product added to cart!');
  };

  return (
    <li className="relative flex flex-col overflow-hidden rounded-md border bg-white shadow-md hover:shadow-lg transition-shadow">
      <span className="relative mx-3 mt-3 flex h-24 sm:h-40 overflow-hidden rounded-xl" >
        <Image src={images[0]} title={title} />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-sm font-medium text-white">
          {discountPercentage}% OFF
        </span>
      </span>
      <div className="mt-4 px-5 pb-4">
        <h5 className="sm:text-xl tracking-tight text-slate-900">
          {title.length > 20 ? title.substring(0, 20) + "..." : title}
        </h5>
        {brand && (
          <p className="text-sm text-gray-500 mt-1">{brand}</p>
        )}
        <div className="mt-2 mb-4 flex items-center justify-between">
          <p>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">${discountedPrice.toFixed(2)}</span>
            <span className="text-sm text-slate-900 line-through ml-2">${price.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-indigo-600 text-white py-2 px-3 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          Add to Cart
        </button>
      </div>
    </li>
  )
}
