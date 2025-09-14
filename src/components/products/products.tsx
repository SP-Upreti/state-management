import { useEffect, useState } from "react";
import ProductCard from "../utils/productCard";
import { useProducts, useCategories } from "../../hooks";

export default function Products() {
    const {
        products,
        isLoading,
        error,
        pagination,
        fetchProducts,
        clearError
    } = useProducts();

    const {
        categories,
        fetchCategories
    } = useCategories();

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const limit = 12;

    useEffect(() => {
        fetchProducts({
            page: currentPage,
            limit,
            category: selectedCategory || undefined,
            sortBy,
            order
        });
    }, [currentPage, selectedCategory, sortBy, order, fetchProducts]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when category changes
    };

    const handleSortChange = (newSortBy: string, newOrder: 'asc' | 'desc' = 'desc') => {
        setSortBy(newSortBy);
        setOrder(newOrder);
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const totalPages = pagination ? pagination.pages : 1;

    if (error) {
        return (
            <section className="py-12">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">{error}</div>
                        <button
                            onClick={() => {
                                clearError();
                                fetchProducts({ page: currentPage, limit });
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <h3 className="text-gray-800 text-2xl font-semibold sm:text-4xl">Our Popular Products</h3>
                    <div className="flex gap-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="border min-w-[120px] py-1 rounded-md px-2 focus:outline-2 focus:outline-indigo-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={`${sortBy}-${order}`}
                            onChange={(e) => {
                                const [newSortBy, newOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
                                handleSortChange(newSortBy, newOrder);
                            }}
                            className="border min-w-[120px] py-1 rounded-md px-2 focus:outline-2 focus:outline-indigo-500"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="title-asc">Name: A to Z</option>
                            <option value="title-desc">Name: Z to A</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8">
                    {pagination && (
                        <div className="mb-4 text-gray-600">
                            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} products
                        </div>
                    )}

                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {isLoading ? (
                            Array.from({ length: limit }).map((_, key) => (
                                <div key={key} className="flex flex-col bg-neutral-300 w-full animate-pulse rounded-xl p-4 gap-4">
                                    <div className="bg-neutral-400/50 w-full animate-pulse rounded-md h-60"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                                        <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
                                        <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
                                        <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
                                    </div>
                                </div>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    images={product.images.length > 0 ? product.images : '/placeholder.png'}
                                    discountPercentage={product.discountPercentage}
                                    title={product.title}
                                    price={product.price}
                                    thumbnail={product.thumbnail}
                                    brand={product.brand}
                                    category={product.category?.name || 'Uncategorized'}
                                    rating={0} // TODO: Add rating to Product interface
                                    stock={product.stock}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">No products found.</p>
                            </div>
                        )}
                    </ul>
                </div>

                {totalPages > 1 && (
                    <div className="mx-auto mt-12 text-gray-600">
                        <div className="flex items-center justify-between text-sm font-medium">
                            <button
                                disabled={currentPage === 1 || isLoading}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-4 py-2 border rounded-lg duration-150 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <div>
                                Page {currentPage} of {totalPages}
                            </div>
                            <button
                                disabled={currentPage === totalPages || isLoading}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-4 py-2 border rounded-lg duration-150 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
