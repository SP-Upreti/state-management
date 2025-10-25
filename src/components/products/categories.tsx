import { useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

export default function Categories() {
    const { categories, isLoading, error, fetchCategories } = useCategories();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    if (isLoading) {
        return (
            <section className="py-10 max-w-7xl mx-auto">
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-10 max-w-7xl mx-auto">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => fetchCategories()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 max-w-7xl mx-auto">
            <div className="container relative mx-auto">
                <div className="mb-5 mx-4 lg:mx-0">
                    <h2 className="text-gray-800 text-2xl font-semibold sm:text-4xl">Shop by Categories</h2>
                    <p className="max-w-xl">
                        Browse our wide range of product categories and find exactly what you're looking for.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600">No categories available at the moment.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center">
                        {categories.slice(0, 8).map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.slug}`}
                                className="block w-1/2 py-10 text-center border lg:w-1/4 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div>
                                    {category.imageUrl ? (
                                        <img
                                            src={category.imageUrl}
                                            alt={category.name}
                                            className="block mx-auto size-20 object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/64?text=Category';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-2xl text-gray-500">
                                                {category.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    <p className="pt-4 text-sm font-medium capitalize text-gray-900 lg:text-lg md:text-base md:pt-6">
                                        {category.name}
                                    </p>

                                    {category.productCount !== undefined && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {category.productCount} products
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                        </div>
                )}
            </div>
        </section>
    );
}