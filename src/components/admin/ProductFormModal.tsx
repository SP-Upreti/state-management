import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addProduct, updateProduct } from '../../store/admin/adminProductSlice';
import { getAllCategories } from '../../store/categories/allCategories';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories } = useSelector((state: RootState) => state.categories);
    const { loading, error } = useSelector((state: RootState) => state.adminProducts);

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
        dispatch(getAllCategories());
    }, [dispatch]);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || '',
                description: product.description || '',
                category: product.category || '',
                price: product.price || 0,
                discountPercentage: product.discountPercentage || 0,
                stock: product.stock || 0,
                brand: product.brand || '',
                images: product.images || ['']
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
    }, [product]);

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
            if (product) {
                await dispatch(updateProduct({ id: product.id, productData: formData })).unwrap();
            } else {
                await dispatch(addProduct(formData)).unwrap();
            }
            onClose();
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
        } catch (error) {
            console.error('Error saving product:', error);
            // Error is handled by Redux state
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
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {product ? 'Edit Product' : 'Add New Product'}
                                    </h3>

                                    {error && (
                                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.title ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter product title"
                                            />
                                            {formErrors.title && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description *
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows={3}
                                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.description ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Enter product description"
                                            />
                                            {formErrors.description && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Category *
                                                </label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.category ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((category) => (
                                                        <option key={category.slug} value={category.slug}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formErrors.category && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Brand
                                                </label>
                                                <input
                                                    type="text"
                                                    name="brand"
                                                    value={formData.brand}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="Enter brand name"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Price ($) *
                                                </label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.price ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                    placeholder="0.00"
                                                />
                                                {formErrors.price && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Discount (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="discountPercentage"
                                                    value={formData.discountPercentage}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    max="100"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Stock *
                                                </label>
                                                <input
                                                    type="number"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    required
                                                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.stock ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                    placeholder="0"
                                                />
                                                {formErrors.stock && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Product Images
                                            </label>
                                            <div className="space-y-2">
                                                {formData.images.map((image, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="url"
                                                            value={image}
                                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                                            placeholder="https://example.com/image.jpg"
                                                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        />
                                                        {formData.images.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImageField(index)}
                                                                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addImageField}
                                                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                                >
                                                    + Add another image
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    product ? 'Update Product' : 'Create Product'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductFormModal;
