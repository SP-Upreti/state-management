import { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '../../hooks/admin';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
    const { categories, fetchCategories } = useCategories();
    const createProductMutation = useCreateProduct();
    const updateProductMutation = useUpdateProduct();
    
    const loading = createProductMutation.isPending || updateProductMutation.isPending;
    const error = (createProductMutation.error as any)?.response?.data?.message || 
                  (updateProductMutation.error as any)?.response?.data?.message || null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: 0,
        discountPercentage: 0,
        stock: 0,
        brand: '',
        images: ['']
    });

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, fetchCategories]);

    useEffect(() => {
        if (product) {
            // Parse images - handle both array and string formats
            let productImages = [''];
            if (product.images) {
                if (Array.isArray(product.images)) {
                    productImages = product.images.length > 0 ? product.images : [''];
                } else if (typeof product.images === 'string') {
                    try {
                        const parsed = JSON.parse(product.images);
                        productImages = Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
                    } catch {
                        productImages = [product.images];
                    }
                }
            } else if (product.thumbnail) {
                productImages = [product.thumbnail];
            }
            
            setFormData({
                title: product.title || '',
                description: product.description || '',
                category: product.categoryId?.toString() || '',
                price: product.price || 0,
                discountPercentage: product.discountPercentage || 0,
                stock: product.stock || 0,
                brand: product.brand || '',
                images: productImages
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: '',
                price: 0,
                discountPercentage: 0,
                stock: 0,
                brand: '',
                images: ['']
            });
        }
        setFormErrors({});
    }, [product, isOpen]);

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!formData.category) {
            errors.category = 'Category is required';
        }

        if (formData.price <= 0) {
            errors.price = 'Price must be greater than 0';
        }

        if (formData.stock < 0) {
            errors.stock = 'Stock cannot be negative';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Filter out empty image URLs
            const filteredImages = formData.images.filter(img => img.trim() !== '');
            
            const productData = {
                title: formData.title,
                description: formData.description,
                categoryId: Number(formData.category),
                price: formData.price,
                discountPercentage: formData.discountPercentage,
                stock: formData.stock,
                brand: formData.brand || undefined,
                thumbnail: filteredImages.length > 0 ? filteredImages[0] : undefined,
                images: filteredImages.length > 0 ? filteredImages : undefined,
            };

            if (product) {
                await updateProductMutation.mutateAsync({
                    id: product.id,
                    productData
                });
            } else {
                await createProductMutation.mutateAsync(productData);
            }
            
            // Reset form after successful submission
            setFormData({
                title: '',
                description: '',
                category: '',
                price: 0,
                discountPercentage: 0,
                stock: 0,
                brand: '',
                images: ['']
            });
            setFormErrors({});
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            // Error is handled by mutation state
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'discountPercentage' || name === 'stock'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 sm:p-0">
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={onClose}></div>

                <div className="relative inline-block align-middle bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 sm:px-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {product ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white px-6 py-6 sm:px-8">
                            {error && (
                                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r shadow-sm">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Basic Information Section */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                                        <span className="w-1 h-5 bg-pink-600 rounded-full mr-2"></span>
                                        Basic Information
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                className={`block w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm ${formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                placeholder="e.g., Premium Wireless Headphones"
                                            />
                                            {formErrors.title && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {formErrors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows={4}
                                                className={`block w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm ${formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                placeholder="Describe your product in detail..."
                                            />
                                            {formErrors.description && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {formErrors.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Category & Brand Section */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                                        <span className="w-1 h-5 bg-pink-600 rounded-full mr-2"></span>
                                        Category & Brand
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className={`block w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm ${formErrors.category ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.category && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {formErrors.category}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Brand
                                            </label>
                                            <input
                                                type="text"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
                                                placeholder="e.g., Sony, Apple, Nike"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Inventory Section */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                                        <span className="w-1 h-5 bg-pink-600 rounded-full mr-2"></span>
                                        Pricing & Inventory
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Price ($) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                    className={`block w-full pl-7 pr-4 py-2.5 border rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm ${formErrors.price ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            {formErrors.price && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {formErrors.price}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="discountPercentage"
                                                    value={formData.discountPercentage}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    max="100"
                                                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
                                                    placeholder="0"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stock Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleInputChange}
                                                min="0"
                                                required
                                                className={`block w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm ${formErrors.stock ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                placeholder="0"
                                            />
                                            {formErrors.stock && (
                                                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {formErrors.stock}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Product Images Section */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                                        <span className="w-1 h-5 bg-pink-600 rounded-full mr-2"></span>
                                        Product Images
                                    </h4>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-500 mb-3">Add image URLs for your product. The first image will be used as the thumbnail.</p>
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="flex gap-3 items-start">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-medium text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="url"
                                                        value={image}
                                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                                        placeholder="https://example.com/image.jpg"
                                                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm"
                                                    />
                                                    {index === 0 && (
                                                        <p className="mt-1 text-xs text-pink-600 flex items-center">
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            Primary thumbnail
                                                        </p>
                                                    )}
                                                </div>
                                                {formData.images.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageField(index)}
                                                        className="flex-shrink-0 p-2.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                                                        title="Remove image"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addImageField}
                                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-pink-600 hover:border-pink-400 hover:bg-pink-50 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Add Another Image</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 sm:px-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={product ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                                        </svg>
                                        <span>{product ? 'Update Product' : 'Create Product'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductFormModal;
