import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useDeleteProduct } from '../../hooks/admin';
import ProductFormModal from '../../components/admin/ProductFormModal';

const AdminProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    
    const { data: currentProduct, isLoading: loading, error } = useProduct(Number(id));
    const deleteProductMutation = useDeleteProduct();

    const handleDelete = async () => {
        if (currentProduct && window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProductMutation.mutateAsync(currentProduct.id);
                navigate('/admin/products');
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !currentProduct) {
        return (
            <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    The product you're looking for doesn't exist.
                </p>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="mt-4 text-pink-600 hover:text-pink-500 text-sm font-medium"
                >
                    ← Back to Products
                </button>
            </div>
        );
    }

    // Parse images - handle both array and string formats
    let productImages = [currentProduct.thumbnail];
    if (currentProduct.images) {
        if (Array.isArray(currentProduct.images)) {
            productImages = currentProduct.images;
        } else if (typeof currentProduct.images === 'string') {
            try {
                const parsed = JSON.parse(currentProduct.images);
                productImages = Array.isArray(parsed) ? parsed : [currentProduct.thumbnail];
            } catch {
                productImages = [currentProduct.thumbnail];
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="inline-flex items-center gap-2 mb-4 text-pink-600 hover:text-pink-700 text-sm font-medium transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Products
                </button>
                
                <div className="sm:flex sm:items-start sm:justify-between">
                    <div className="flex-1">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentProduct.title}</h1>
                                <p className="text-sm text-gray-600">
                                    Detailed view and management for this product
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                        currentProduct.stock > 10 
                                            ? 'bg-green-100 text-green-800' 
                                            : currentProduct.stock > 0 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-red-100 text-red-800'
                                    }`}>
                                        {currentProduct.stock} in stock
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {currentProduct.category?.name || 'Uncategorized'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 text-sm font-medium text-amber-700 shadow-sm hover:from-amber-100 hover:to-amber-200 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Product
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-sm font-medium text-red-700 shadow-sm hover:from-red-100 hover:to-red-200 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Product Information</h3>
                </div>
                <div className="border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        {/* Product Images */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Product Images</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {productImages.map((image: string, index: number) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${currentProduct.title} ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900">{currentProduct.description}</dd>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">${currentProduct.price}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Discount</dt>
                                    <dd className="mt-1 text-lg font-semibold text-green-600">
                                        {currentProduct.discountPercentage}%
                                    </dd>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{currentProduct.category?.name || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Brand</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{currentProduct.brand || 'N/A'}</dd>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Stock</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentProduct.stock > 10 ? 'bg-green-100 text-green-800' :
                                            currentProduct.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {currentProduct.stock} units
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Rating</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {currentProduct.rating}/5 ⭐
                                    </dd>
                                </div>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">SKU</dt>
                                <dd className="mt-1 text-sm text-gray-900">{currentProduct.sku}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500">Availability Status</dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentProduct.availabilityStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {currentProduct.availabilityStatus}
                                    </span>
                                </dd>
                            </div>

                            {currentProduct.tags && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tags</dt>
                                    <dd className="mt-1">
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(currentProduct.tags) 
                                                ? currentProduct.tags 
                                                : typeof currentProduct.tags === 'string' 
                                                    ? JSON.parse(currentProduct.tags) 
                                                    : []
                                            ).map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </dd>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            {(currentProduct.shippingInformation || currentProduct.returnPolicy || currentProduct.warrantyInformation || 
              currentProduct.weight || currentProduct.dimensions || currentProduct.minimumOrderQuantity) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Shipping & Return */}
                    {(currentProduct.shippingInformation || currentProduct.returnPolicy || currentProduct.warrantyInformation) && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping & Returns</h3>
                            <div className="space-y-3">
                                {currentProduct.shippingInformation && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Shipping Information</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentProduct.shippingInformation}</dd>
                                    </div>
                                )}
                                {currentProduct.returnPolicy && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Return Policy</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentProduct.returnPolicy}</dd>
                                    </div>
                                )}
                                {currentProduct.warrantyInformation && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Warranty</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentProduct.warrantyInformation}</dd>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Product Dimensions */}
                    {(currentProduct.weight || currentProduct.dimensions || currentProduct.minimumOrderQuantity) && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
                            <div className="space-y-3">
                                {currentProduct.weight && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Weight</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentProduct.weight} kg</dd>
                                    </div>
                                )}
                                {currentProduct.dimensions && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {currentProduct.dimensions.width} × {currentProduct.dimensions.height} × {currentProduct.dimensions.depth} cm
                                        </dd>
                                    </div>
                                )}
                                {currentProduct.minimumOrderQuantity && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Minimum Order Quantity</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentProduct.minimumOrderQuantity}</dd>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Reviews */}
            {currentProduct.reviews && currentProduct.reviews.length > 0 && (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Reviews</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {currentProduct.reviews.slice(0, 5).map((review, index: number) => (
                                <li key={review.id || index} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
                                                    <span className="text-sm font-medium leading-none text-white">
                                                        {review.user.firstName.charAt(0)}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {review.user.firstName} {review.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-yellow-500">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-700">
                                        {review.comment}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <ProductFormModal
                    isOpen={showEditModal}
                    onClose={handleEditModalClose}
                    product={currentProduct}
                />
            )}
        </div>
    );
};

export default AdminProductDetails;
