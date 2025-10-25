import { useEffect, useState } from "react";
import ProductCard from "../utils/productCard";
import { productsApi, Product } from "../../utils/api";

export default function PopularProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPopularProducts();
    }, []);

    const fetchPopularProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await productsApi.getPopularProducts(10);
            const { products } = response.data.data;
            setProducts(products);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch popular products';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 lg:px-0">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">{error}</div>
                        <button
                            onClick={fetchPopularProducts}
                            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="max-w-screen-xl mx-auto px-4 lg:px-0">
                <div className="flex justify-between items-center gap-4 flex-wrap mb-8">
                    <div>
                        <h3 className="text-gray-800 text-2xl font-semibold sm:text-4xl">Popular Products</h3>
                        <p className="text-gray-600 mt-2">Top rated products by our customers</p>
                    </div>
                </div>

                <div className="mt-1">
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, key) => (
                                <div key={key} className="flex flex-col bg-neutral-300 w-full animate-pulse rounded-xl p-4 gap-4">
                                    <div className="bg-neutral-400/50 w-full animate-pulse rounded-sm h-60"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-sm"></div>
                                        <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-sm"></div>
                                        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-sm"></div>
                                        <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-sm"></div>
                                    </div>
                                </div>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product, index) => (
                                <div key={product.id} className="relative">
                                   
                                    <ProductCard
                                        id={product.id}
                                        images={product.images.length > 0 ? product.images : '/placeholder.png'}
                                        discountPercentage={product.discountPercentage}
                                        title={product.title}
                                        price={product.price}
                                        thumbnail={product.thumbnail}
                                        brand={product.brand}
                                        category={product.category?.name || 'Uncategorized'}
                                        rating={product.rating || 0}
                                        stock={product.stock}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">No popular products found.</p>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
}
