import Image from "./Image"

interface ProductsInterface {
  images: string[],
  discountPercentage: number,
  title: string
}



export default function ProductCard({ images, discountPercentage, title }: ProductsInterface) {
  return (
    <li className="relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md">
      <span className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <Image src={images[0]} title={title} />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-sm font-medium text-white">
          {discountPercentage}% OFF
        </span>
      </span>
      <div className="mt-4 px-5">
        <h5 className="text-xl tracking-tight text-slate-900">
          {title.length > 20 ? title.substring(0, 20) + "..." : title}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">$449</span>
            <span className="text-sm text-slate-900 line-through">$699</span>
          </p>
        </div>
      </div>
    </li>
  )
}

export function DefaultCard({ images, discountPercentage, title }: ProductsInterface) {
  return (
    <li className="relative flex flex-col overflow-hidden rounded-md border bg-white shadow-md">
      <span className="relative mx-3 mt-3 flex h-24 sm:h-40 overflow-hidden rounded-xl" >
        <Image src={images[0]} title={title} />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-sm font-medium text-white">
          {discountPercentage}% OFF
        </span>
      </span>
      <div className="mt-4 px-5">
        <h5 className="sm:text-xl tracking-tight text-slate-900">
          {title.length > 20 ? title.substring(0, 20) + "..." : title}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">$449</span>
            <span className="text-sm text-slate-900 line-through">$699</span>
          </p>
        </div>
      </div>
    </li>
  )
}
