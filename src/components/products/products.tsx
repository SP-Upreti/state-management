import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { decrementPage, fetchProducts, incrementPage } from "../../store/products/productSlice";
import Image from "../utils/Image";

export default function Products({ imgSize }: { imgSize: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state: RootState) => state.products.value);
    const total = useSelector((state: RootState) => state.products.total);
    const current = useSelector((state: RootState) => state.products.current);
    const loading = useSelector((state: RootState) => state.products.loading);
    const [increment, setIncrement] = useState(0);

    useEffect(() => {
        dispatch(fetchProducts({ skip: increment, limit: 10 }));
    }, [dispatch, increment]);

    return (
        <section className="py-12">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <h3 className="text-gray-800 text-2xl font-semibold sm:text-4xl">Our Popular Products</h3>
                    <select className="border min-w-[100px] py-1 rounded-md px-2 focus:outline-2 focus:outline-indigo-500">
                        <option>All Products</option>
                        <option>Fashion</option>
                        <option>Grocery</option>
                        <option>Accessories</option>
                    </select>
                </div>

                <div className="mt-8">
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, key) => (
                                <div key={key} className="flex flex-col bg-neutral-300 w-full animate-pulse rounded-xl p-4 gap-4">
                                    <div className={`bg-neutral-400/50 w-full  animate-pulse rounded-md h-52 ${imgSize}`}></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                                        <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
                                        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                                        <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            products.slice(0, 8).map((data, key) => (
                                <li key={key} className="relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md">
                                    <a className={`relative mx-3 mt-3 flex h-52 overflow-hidden rounded-xl ${imgSize}`} href="#">
                                        <Image src={data.images[0]} title={data.title} />
                                        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-sm font-medium text-white">
                                            {data.discountPercentage}% OFF
                                        </span>
                                    </a>
                                    <div className="mt-4 px-5">
                                        <h5 className="text-xl tracking-tight text-slate-900">
                                            {data.title.length > 20 ? data.title.substring(0, 20) + "..." : data.title}
                                        </h5>
                                        <div className="mt-2 mb-5 flex items-center justify-between">
                                            <p>
                                                <span className="text-3xl font-bold text-slate-900">$449</span>
                                                <span className="text-sm text-slate-900 line-through">$699</span>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="mx-auto mt-12 text-gray-600">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <button
                            disabled={current === 1}
                            onClick={() => {
                                dispatch(decrementPage());
                                setIncrement((prev) => prev - 10);
                            }}
                            className="px-4 py-2 border rounded-lg duration-150 disabled:bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <div>
                            Page {current} of {Math.ceil(total / 10)}
                        </div>
                        <button
                            disabled={current === Math.ceil(total / 10)}
                            onClick={() => {
                                dispatch(incrementPage());
                                setIncrement((prev) => prev + 10);
                            }}
                            className="px-4 py-2 border rounded-lg duration-150 disabled:hover:bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
