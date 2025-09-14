import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
// @ts-expect-error link
import { HashLink } from 'react-router-hash-link';
import Footer from "../components/footer/footer";
import Navbar from "../components/navigation/navbar";
import Filtre from "../components/products/filtre";
import { DefaultCard } from "../components/utils/productCard";
import { useProducts, useCategories } from "../hooks";

export default function Products() {
    const [searchParams] = useSearchParams();
    const {
        products,
        isLoading,
        error,
        pagination,
        fetchProducts,
        clearError
    } = useProducts();

    const { categories, fetchCategories } = useCategories();

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const limit = 12;
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        fetchProducts({
            page: currentPage,
            limit,
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
            sortBy,
            order
        });
    }, [currentPage, searchQuery, selectedCategory, sortBy, order, fetchProducts]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortBy: string, newOrder: 'asc' | 'desc' = 'desc') => {
        setSortBy(newSortBy);
        setOrder(newOrder);
        setCurrentPage(1);
    };

    const totalPages = pagination ? pagination.pages : 1;

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
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
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Filtre>
                <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">

                    {/* Sort Filter */}
                    <select
                        value={`${sortBy}-${order}`}
                        onChange={(e) => {
                            const [newSortBy, newOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
                            handleSortChange(newSortBy, newOrder);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="title-asc">Name: A to Z</option>
                        <option value="title-desc">Name: Z to A</option>
                    </select>
                </div>

                {searchQuery && (
                    <div className="mb-4 text-gray-600">
                        Search results for: <span className="font-medium">"{searchQuery}"</span>
                    </div>
                )}

                {pagination && (
                    <div className="mb-4 text-gray-600">
                        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} products
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 w-full" id="productList">
                    {isLoading ? (
                        Array.from({ length: limit }).map((_, key) => (
                            <div key={key} className="flex flex-col bg-neutral-300 w-full animate-pulse rounded-xl p-4 gap-4">
                                <div className="bg-neutral-400/50 w-full animate-pulse rounded-md h-40 sm:h-60"></div>
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
                            <Link to={`/products/${product.id}`} key={product.id}>
                                <DefaultCard
                                    id={product.id}
                                    images={product.images}
                                    title={product.title}
                                    discountPercentage={product.discountPercentage}
                                    price={product.price}
                                    thumbnail={product.thumbnail}
                                    brand={product.brand}
                                    category={product.category?.name || 'Uncategorized'}
                                    rating={0} // TODO: Add rating to Product interface
                                    stock={product.stock}
                                />
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">
                                {searchQuery
                                    ? `No products found for "${searchQuery}"`
                                    : 'No products found.'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mx-auto mt-12 text-gray-600 col-span-4">
                        <div className="flex items-center justify-between text-sm font-medium">
                            <HashLink to={"#productList"}>
                                <button
                                    disabled={currentPage === 1 || isLoading}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="px-4 py-2 border rounded-lg duration-150 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                            </HashLink>
                            <div>
                                Page {currentPage} of {totalPages}
                                {pagination && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({pagination.total} products)
                                    </span>
                                )}
                            </div>
                            <HashLink to={"#productList"}>
                                <button
                                    disabled={currentPage === totalPages || isLoading}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="px-4 py-2 border rounded-lg duration-150 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </HashLink>
                        </div>
                    </div>
                )}
            </Filtre>
            <Footer />
        </>
    )
}
