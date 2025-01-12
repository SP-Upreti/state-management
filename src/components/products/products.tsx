import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../store/store"
import { RootState } from "../../store/store"
import { useEffect } from "react"
import { fetchProducts } from "../../store/products/productSlice"
import Image from "../utils/Image"

export default function Products() {

    const dispactch = useDispatch<AppDispatch>()
    const products = useSelector((state: RootState) => state.products.value)

    useEffect(() => {
        dispactch(fetchProducts());
    })

    console.log(products);


    return (
        <section className="py-12">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className=" flex justify-between items-center gap-4 flex-wrap">
                    <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                        Our Popular Products
                    </h3>
                    <button>
                        <select name="" id="" className="border min-w-[100px] py-1 rounded-md px-2">
                            <option value="">All Products</option>
                            <option value="">Fashion</option>
                            <option value="">Grocery</option>
                            <option value="">Accessories</option>
                        </select>
                    </button>
                </div>
                <div className="mt-8">
                    <ul className="grid   sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {
                            products.slice(0, 8).map((data, key) => {
                                return (
                                    <div className="" key={key}>
                                        <div className="relative  flex w-full  flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                                            <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
                                                <Image src={data.images[0]} title={data.title} />
                                                <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">{data.discountPercentage}% OFF</span>
                                            </a>
                                            <div className="mt-4 px-5 ">
                                                <a href="#">
                                                    <h5 className="text-xl tracking-tight text-slate-900">{data.title.length > 20 ? data.title.substring(0, 20) + "..." : data.title}</h5>
                                                </a>
                                                <div className="mt-2 mb-5 flex items-center justify-between">
                                                    <p>
                                                        <span className="text-3xl font-bold text-slate-900">$449</span>
                                                        <span className="text-sm text-slate-900 line-through">$699</span>
                                                    </p>
                                                    <div className="flex items-center">
                                                        <svg aria-hidden="true" className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                        <svg aria-hidden="true" className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                        <svg aria-hidden="true" className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                        <svg aria-hidden="true" className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                        <svg aria-hidden="true" className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                        <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">5.0</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}