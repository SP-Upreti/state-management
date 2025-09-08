import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { decrementPage, fetchProducts, incrementPage } from "../../store/products/productSlice";
import ProductCard from "../utils/productCard";

export default function Products() {
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
                                    <div className="bg-neutral-400/50 w-full  animate-pulse rounded-md h-60"></div>
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
                                <ProductCard
                                    key={key}
                                    id={data.id}
                                    images={data.images}
                                    discountPercentage={data.discountPercentage}
                                    title={data.title}
                                    price={data.price}
                                    thumbnail={data.thumbnail}
                                    brand={data.brand}
                                    category={data.category}
                                    rating={data.rating}
                                    stock={data.stock}
                                />
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
