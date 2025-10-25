import Image from "./Image"
import { useAppContext } from "../../contexts/AppContext";
import { Link } from "react-router-dom";

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

  stock
}: ProductsInterface) {
  const { cart } = useAppContext();

  // Ensure price is a number and handle potential undefined/null values
  const safePrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const safeDiscountPercentage = discountPercentage;
  const discountedPrice = safePrice * (1 - safeDiscountPercentage / 100);

  // Ensure images array is valid
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : thumbnail;



  const isOutOfStock = !stock || stock <= 0;

  return (
    <Link to={`/products/${id}`}>
      <li className="relative hover:shadow cursor-pointer flex flex-col overflow-hidden rounded-sm border border-gray-200 bg-white  transition-shadow">
      <span className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <Image src={imageUrl} title={title} />
        {
          safeDiscountPercentage > 0 && (
              <span className="absolute top-0 left-0 m-2 rounded-full bg-pink-100 px-2 text-sm font-medium text-pink-500">
              {safeDiscountPercentage}% OFF
            </span>
          )}
        {isOutOfStock && (
          <span className="absolute top-0 right-0 m-2 rounded-full bg-red-600 px-2 text-sm font-medium text-white">
            Out of Stock
          </span>
        )}
      </span>
      <div className="mt-4 px-5 pb-5">
          <h5 className="text-xl truncate line-clamp-1 tracking-tight text-slate-900">
            {title}
        </h5>
        {brand && (
          <p className="text-sm text-gray-500 mt-1">{brand}</p>
        )}
        <div className="mt-2 mb-4 flex items-center justify-between">
          <p>
              <span className="text-2xl font-semibold text-slate-900">${discountedPrice.toFixed(2)}</span>
            {safeDiscountPercentage > 0 && (
              <span className="text-sm text-slate-900 line-through ml-2">${safePrice.toFixed(2)}</span>
            )}
            </p>
          </div>
        {cart.error && (
          <p className="text-red-500 text-sm mt-2">{cart.error}</p>
        )}
      </div>
    </li>
    </Link>
  )
}

export function DefaultCard({
  id,
  images,
  discountPercentage,
  title,
  price,
  thumbnail,
  stock
}: ProductsInterface) {
  const { cart } = useAppContext();

  // Ensure price is a number and handle potential undefined/null values
  const safePrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const safeDiscountPercentage = discountPercentage;
  const discountedPrice = safePrice * (1 - safeDiscountPercentage / 100);

  // Ensure images array is valid
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : thumbnail;


  const isOutOfStock = !stock || stock <= 0;

  return (
    <Link to={`/products/${id}`}>
      <li className="relative flex hover:shadow flex-col overflow-hidden rounded-sm border bg-white  transition-shadow">
      <span className="relative mx-3 mt-3 flex h-24 sm:h-40 overflow-hidden rounded-xl" >
        <Image src={imageUrl} title={title} />
          <span className="absolute top-0 left-0 m-1 rounded-full bg-pink-100 px-2 text-sm font-medium text-pink-500">
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
        <div className="mt-2 mb-4 flex items-center justify-between">
          <p>
              <span className="text-xl  font-semibold text-slate-900">${discountedPrice.toFixed(2)}</span>
            {safeDiscountPercentage > 0 && (
              <span className="text-sm text-slate-900 line-through ml-2">${safePrice.toFixed(2)}</span>
            )}
          </p>
          </div>
        {cart.error && (
          <p className="text-red-500 text-xs mt-2">{cart.error}</p>
        )}
      </div>
    </li>
    </Link>
  )
}
