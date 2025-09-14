import { useEffect, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';

const AdminCategories = () => {
    const {
        categories,
        isLoading,
        error,
        fetchCategories,
        createCategory,
        clearError
    } = useCategories();

    const {
        products,
        isLoading: productsLoading,
        fetchProducts
    } = useProducts();

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [newCategory, setNewCategory] = useState({
        name: '',
        slug: '',
        description: ''
    });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchCategories(false);
    }, [fetchCategories]);

    const handleCategorySelect = async (categorySlug: string) => {
        setSelectedCategory(categorySlug);
        // Fetch products by category
        fetchProducts({ category: categorySlug });
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleNameChange = (name: string) => {
        setNewCategory(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.name.trim()) {
            try {
                await createCategory({
                    name: newCategory.name.trim(),
                    slug: newCategory.slug,
                    description: newCategory.description.trim() || undefined
                });
                setNewCategory({ name: '', slug: '', description: '' });
                setShowAddForm(false);
            } catch (error) {
                console.error('Failed to create category:', error);
            }
        }
    };

    const getCategoryStats = () => {
        // This would typically come from the backend
        return {
            productCount: Math.floor(Math.random() * 50) + 1,
            revenue: Math.floor(Math.random() * 10000) + 1000,
            popularity: Math.floor(Math.random() * 100) + 1
        };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage product categories and their organization.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Category
                    </button>
                </div>
            </div>

            {/* Add Category Form */}
            {showAddForm && (
                <div className="bg-white shadow rounded-lg p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Enter category name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug
                            </label>
                            <input
                                type="text"
                                value={newCategory.slug}
                                onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="category-slug"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={newCategory.description}
                                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter category description"
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Adding...' : 'Add'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewCategory({ name: '', slug: '', description: '' });
                                    clearError();
                                }}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                    const stats = getCategoryStats();
                    return (
                        <div
                            key={category.slug}
                            className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedCategory === category.slug ? 'ring-2 ring-indigo-500' : ''
                                }`}
                            onClick={() => handleCategorySelect(category.slug)}
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                {category.name}
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {stats.productCount} products
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Revenue: ${stats.revenue.toLocaleString()}</span>
                                        <span>Pop: {stats.popularity}%</span>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{ width: `${stats.popularity}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new category.
                    </p>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add Category
                        </button>
                    </div>
                </div>
            )}

            {/* Category Products */}
            {selectedCategory && (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Products in "{selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}"
                        </h3>

                        {productsLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products.slice(0, 6).map((product) => (
                                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-32 object-cover rounded-md mb-3"
                                        />
                                        <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                                        <p className="text-sm text-gray-500 truncate">{product.description}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No products found in this category.
                            </p>
                        )}

                        {products.length > 6 && (
                            <div className="mt-4 text-center">
                                <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                                    View all {products.length} products →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
