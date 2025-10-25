import { useEffect, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Category } from '../../utils/api';

const AdminCategories = () => {
    const {
        categories,
        isLoading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        clearError
    } = useCategories();

    const [newCategory, setNewCategory] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories(false);
    }, [fetchCategories]);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setNewCategory({ name: '', slug: '', description: '' });
        setImageFile(null);
        setImagePreview('');
        setEditingCategory(null);
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.name.trim()) {
            try {
                const formData = new FormData();
                formData.append('name', newCategory.name.trim());
                formData.append('slug', newCategory.slug);
                if (newCategory.description.trim()) {
                    formData.append('description', newCategory.description.trim());
                }
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                await createCategory(formData as any);
                resetForm();
                setShowAddModal(false);
            } catch (error) {
                console.error('Failed to create category:', error);
            }
        }
    };

    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !newCategory.name.trim()) return;

        try {
            const formData = new FormData();
            formData.append('name', newCategory.name.trim());
            formData.append('slug', newCategory.slug);
            if (newCategory.description.trim()) {
                formData.append('description', newCategory.description.trim());
            }
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await updateCategory(editingCategory.id, formData as any);
            resetForm();
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setNewCategory({
            name: category.name,
            slug: category.slug,
            description: category.description || ''
        });
        setImagePreview(category.imageUrl || category.image || '');
        setShowAddModal(true);
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await deleteCategory(id);
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
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
                        onClick={() => {
                            resetForm();
                            setShowAddModal(true);
                        }}
                        className="inline-flex items-center justify-center rounded-sm border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Category
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {category.imageUrl ? (
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className="h-10 w-10 rounded-lg object-cover"
                                                onError={(e) => {
                                                    console.error('Image failed to load:', category.imageUrl);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{category.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                        {category.description || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{category.productCount || 0}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="text-pink-600 hover:text-pink-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(category.id)}
                                        className="text-red-600 hover:text-red-900 ml-4"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && !isLoading && (
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
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(true);
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                Add Category
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h3>
                        </div>
                        <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Enter category name"
                                    className="block w-full rounded-sm border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm px-3 py-2 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug *
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.slug}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="category-slug"
                                    className="block w-full rounded-sm border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm px-3 py-2 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-20 w-20 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter category description"
                                    rows={3}
                                    className="block w-full rounded-sm border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm px-3 py-2 border"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (editingCategory ? 'Updating...' : 'Adding...') : (editingCategory ? 'Update Category' : 'Add Category')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                        clearError();
                                    }}
                                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to delete this category? This action cannot be undone.
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteCategory(deleteConfirm)}
                                disabled={isLoading}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
