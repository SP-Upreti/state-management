import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/footer/footer";
import Navbar from "../components/navigation/navbar";
import Filtre from "../components/products/filtre";
import { AppDispatch, RootState } from "../store/store";
import { DefaultCard } from "../components/utils/productCard";
import { useEffect, useState } from "react";
import { decrementPage, fetchProducts, incrementPage } from "../store/products/productSlice";
import { HashLink } from 'react-router-hash-link';
export default function Products() {
    const products = useSelector((state: RootState) => state.products.value);
    const current = useSelector((state: RootState) => state.products.current)
    const total = useSelector((state: RootState) => state.products.total);
    const loading = useSelector((state: RootState) => state.products.loading);
    const dispatch = useDispatch<AppDispatch>();
    const [increment, setIncrement] = useState(10)

    useEffect(() => {
        dispatch(fetchProducts({ skip: increment, limit: 20 }));
    }, [dispatch, increment]);
    return (
        <>
            <Navbar />
            <Filtre >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1" id="productList">
                    {products.map((prod, key) => {
                        return (
                            <>
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
                                ) : (<HashLink to={'/products/details#'}>
                                    <DefaultCard key={key} images={prod.images} title={prod.title} discountPercentage={prod.discountPercentage} />
                                </HashLink>)
                                }
                            </>

                        )
                    })}

                </div>
                <div className="mx-auto mt-12 text-gray-600 col-span-4">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <HashLink to={"#"}>
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
                        </HashLink>
                        <div>
                            Page {current} of {Math.ceil(total / 10)}
                        </div>
                        <HashLink to={"#"}>
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
                        </HashLink>
                    </div>
                </div>
            </Filtre>
            <Footer />
        </>
    )
}
