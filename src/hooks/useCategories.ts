import { useState, useCallback } from 'react';
import { categoriesApi, Category } from '../utils/api';

interface CategoriesState {
    categories: Category[];
    currentCategory: Category | null;
    isLoading: boolean;
    error: string | null;
}

interface CategoriesActions {
    fetchCategories: (includeProducts?: boolean) => Promise<void>;
    fetchCategory: (id: number) => Promise<void>;
    fetchCategoryBySlug: (slug: string) => Promise<void>;
    createCategory: (categoryData: Partial<Category>) => Promise<Category>;
    updateCategory: (id: number, categoryData: Partial<Category>) => Promise<Category>;
    deleteCategory: (id: number) => Promise<void>;
    clearError: () => void;
    clearCurrentCategory: () => void;
}

export const useCategories = (): CategoriesState & CategoriesActions => {
    const [state, setState] = useState<CategoriesState>({
        categories: [],
        currentCategory: null,
        isLoading: false,
        error: null,
    });

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, isLoading: loading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    };

    const fetchCategories = useCallback(async (includeProducts = false) => {
        try {
            setLoading(true);
            const response = await categoriesApi.getCategories(includeProducts);
            const { categories } = response.data.data;

            setState(prev => ({
                ...prev,
                categories,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch categories';
            setError(message);
        }
    }, []);

    const fetchCategory = useCallback(async (id: number) => {
        try {
            setLoading(true);
            const response = await categoriesApi.getCategory(id);
            const { category } = response.data.data;

            setState(prev => ({
                ...prev,
                currentCategory: category,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch category';
            setError(message);
        }
    }, []);

    const fetchCategoryBySlug = useCallback(async (slug: string) => {
        try {
            setLoading(true);
            const response = await categoriesApi.getCategoryBySlug(slug);
            const { category } = response.data.data;

            setState(prev => ({
                ...prev,
                currentCategory: category,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch category';
            setError(message);
        }
    }, []);

    const createCategory = useCallback(async (categoryData: Partial<Category>): Promise<Category> => {
        try {
            setLoading(true);
            const response = await categoriesApi.createCategory(categoryData);
            const { category } = response.data.data;

            // Add to categories list
            setState(prev => ({
                ...prev,
                categories: [category, ...prev.categories],
                isLoading: false,
                error: null,
            }));

            return category;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create category';
            setError(message);
            throw error;
        }
    }, []);

    const updateCategory = useCallback(async (id: number, categoryData: Partial<Category>): Promise<Category> => {
        try {
            setLoading(true);
            const response = await categoriesApi.updateCategory(id, categoryData);
            const { category } = response.data.data;

            // Update in categories list
            setState(prev => ({
                ...prev,
                categories: prev.categories.map(c => c.id === id ? category : c),
                currentCategory: prev.currentCategory?.id === id ? category : prev.currentCategory,
                isLoading: false,
                error: null,
            }));

            return category;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update category';
            setError(message);
            throw error;
        }
    }, []);

    const deleteCategory = useCallback(async (id: number): Promise<void> => {
        try {
            setLoading(true);
            await categoriesApi.deleteCategory(id);

            // Remove from categories list
            setState(prev => ({
                ...prev,
                categories: prev.categories.filter(c => c.id !== id),
                currentCategory: prev.currentCategory?.id === id ? null : prev.currentCategory,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete category';
            setError(message);
            throw error;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearCurrentCategory = useCallback(() => {
        setState(prev => ({ ...prev, currentCategory: null }));
    }, []);

    return {
        ...state,
        fetchCategories,
        fetchCategory,
        fetchCategoryBySlug,
        createCategory,
        updateCategory,
        deleteCategory,
        clearError,
        clearCurrentCategory,
    };
};