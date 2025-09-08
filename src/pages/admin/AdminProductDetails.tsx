import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductById, deleteProduct } from '../../store/admin/adminProductSlice';

const AdminProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentProduct, loading } = useSelector((state: RootState) => state.adminProducts);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(parseInt(id)));
        }
    }, [dispatch, id]);

    const handleDelete = async () => {
        if (currentProduct && window.confirm('Are you sure you want to delete this product?')) {
            await dispatch(deleteProduct(currentProduct.id));
            navigate('/admin/products');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    The product you're looking for doesn't exist.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="mb-4 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                        ← Back to Products
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">{currentProduct.title}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Detailed view and management for this product.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Edit Product
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Delete Product
                    </button>
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
                                {currentProduct.images.map((image, index) => (
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
                                    <dd className="mt-1 text-sm text-gray-900">{currentProduct.category}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Brand</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{currentProduct.brand}</dd>
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

                            {currentProduct.tags && currentProduct.tags.length > 0 && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tags</dt>
                                    <dd className="mt-1">
                                        <div className="flex flex-wrap gap-2">
                                            {currentProduct.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipping & Return */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping & Returns</h3>
                    <div className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Shipping Information</dt>
                            <dd className="mt-1 text-sm text-gray-900">{currentProduct.shippingInformation}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Return Policy</dt>
                            <dd className="mt-1 text-sm text-gray-900">{currentProduct.returnPolicy}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Warranty</dt>
                            <dd className="mt-1 text-sm text-gray-900">{currentProduct.warrantyInformation}</dd>
                        </div>
                    </div>
                </div>

                {/* Product Dimensions */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
                    <div className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Weight</dt>
                            <dd className="mt-1 text-sm text-gray-900">{currentProduct.weight} kg</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {currentProduct.dimensions.width} × {currentProduct.dimensions.height} × {currentProduct.dimensions.depth} cm
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Minimum Order Quantity</dt>
                            <dd className="mt-1 text-sm text-gray-900">{currentProduct.minimumOrderQuantity}</dd>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            {currentProduct.reviews && currentProduct.reviews.length > 0 && (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Reviews</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {currentProduct.reviews.slice(0, 5).map((review, index) => (
                                <li key={index} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
                                                    <span className="text-sm font-medium leading-none text-white">
                                                        {review.reviewerName.charAt(0)}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {review.reviewerName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(review.date).toLocaleDateString()}
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
        </div>
    );
};

export default AdminProductDetails;
