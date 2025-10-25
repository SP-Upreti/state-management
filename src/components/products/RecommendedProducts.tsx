import { useEffect, useState } from 'react';
import { Product } from '../../utils/api';
import { getDiverseRecommendations } from '../../utils/recommendations';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../utils/productCard';
import LoadingSpinner from '../LoadingSpinner';

interface RecommendedProductsProps {
    currentProduct: Product;
}

export default function RecommendedProducts({ currentProduct }: RecommendedProductsProps) {
    const { products, fetchProducts, isLoading } = useProducts();
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Fetch all products if not already loaded
        if (products.length === 0) {
            fetchProducts({ limit: 100 }); // Fetch more products for better recommendations
        }
    }, [products.length, fetchProducts]);

    useEffect(() => {
        if (products.length > 0 && currentProduct) {
            // Get recommendations using content-based filtering
            const recommendations = getDiverseRecommendations(
                currentProduct,
                products,
                8 // Show 8 recommendations
            );
            setRecommendedProducts(recommendations);
        }
    }, [products, currentProduct]);

    if (isLoading && products.length === 0) {
        return (
            <div className="mt-12 max-w-7xl mx-auto p-4 lg:p-6">
                <h2 className="text-2xl font-bold mb-6">Products You May Like</h2>
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (recommendedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 max-w-7xl mx-auto p-4 lg:p-0">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Products You May Like</h2>
                <p className="text-sm text-gray-500">
                    Based on category, brand, and features
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        images={product.images}
                        discountPercentage={product.discountPercentage}
                        title={product.title}
                        price={product.price}
                        thumbnail={product.thumbnail}
                        brand={product.brand}
                        category={product.category?.name}
                        rating={product.rating}
                        stock={product.stock}
                    />
                ))}
            </div>

            {/* Algorithm Info */}
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <div className="flex items-start gap-3">
                    <svg
                        className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>
                        <h3 className="font-semibold text-pink-800 mb-1">
                            Smart Recommendations
                        </h3>
                        <p className="text-sm text-gray-700">
                            These products are selected using our <span className="font-semibold">content-based filtering algorithm</span> that analyzes:
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                <span><strong>Category match</strong> (35% weight) - Products from the same category</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                <span><strong>Brand similarity</strong> (25% weight) - Products from the same brand</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                <span><strong>Description analysis</strong> (20% weight) - Similar product descriptions</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                <span><strong>Feature matching</strong> (15% weight) - Products with similar tags/features</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                                <span><strong>Price range</strong> (5% weight) - Products in similar price range</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
