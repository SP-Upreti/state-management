import { useState, useCallback } from 'react';
import { productsApi, Product } from '../utils/api';

interface ProductsState {
    products: Product[];
    currentProduct: Product | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    } | null;
}

interface ProductsActions {
    fetchProducts: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        order?: 'asc' | 'desc';
    }) => Promise<void>;
    fetchProduct: (id: number) => Promise<void>;
    createProduct: (productData: Partial<Product>) => Promise<Product>;
    updateProduct: (id: number, productData: Partial<Product>) => Promise<Product>;
    deleteProduct: (id: number) => Promise<void>;
    clearError: () => void;
    clearCurrentProduct: () => void;
}

export const useProducts = (): ProductsState & ProductsActions => {
    const [state, setState] = useState<ProductsState>({
        products: [],
        currentProduct: null,
        isLoading: false,
        error: null,
        pagination: null,
    });

    const setLoading = (loading: boolean) => {
        setState(prev => ({ ...prev, isLoading: loading }));
    };

    const setError = (error: string | null) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    };

    const fetchProducts = useCallback(async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        order?: 'asc' | 'desc';
    }) => {
        try {
            setLoading(true);
            const response = await productsApi.getProducts(params);
            const { products } = response.data.data;
            const { pagination } = response.data;

            setState(prev => ({
                ...prev,
                products,
                pagination: pagination ? { ...pagination, total: response.data.total || 0 } : null,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch products';
            setError(message);
        }
    }, []);

    const fetchProduct = useCallback(async (id: number) => {
        try {
            setLoading(true);
            const response = await productsApi.getProduct(id);
            const { product } = response.data.data;

            setState(prev => ({
                ...prev,
                currentProduct: product,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch product';
            setError(message);
        }
    }, []);

    const createProduct = useCallback(async (productData: Partial<Product>): Promise<Product> => {
        try {
            setLoading(true);
            const response = await productsApi.createProduct(productData);
            const { product } = response.data.data;

            // Add to products list
            setState(prev => ({
                ...prev,
                products: [product, ...prev.products],
                isLoading: false,
                error: null,
            }));

            return product;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create product';
            setError(message);
            throw error;
        }
    }, []);

    const updateProduct = useCallback(async (id: number, productData: Partial<Product>): Promise<Product> => {
        try {
            setLoading(true);
            const response = await productsApi.updateProduct(id, productData);
            const { product } = response.data.data;

            // Update in products list
            setState(prev => ({
                ...prev,
                products: prev.products.map(p => p.id === id ? product : p),
                currentProduct: prev.currentProduct?.id === id ? product : prev.currentProduct,
                isLoading: false,
                error: null,
            }));

            return product;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update product';
            setError(message);
            throw error;
        }
    }, []);

    const deleteProduct = useCallback(async (id: number): Promise<void> => {
        try {
            setLoading(true);
            await productsApi.deleteProduct(id);

            // Remove from products list
            setState(prev => ({
                ...prev,
                products: prev.products.filter(p => p.id !== id),
                currentProduct: prev.currentProduct?.id === id ? null : prev.currentProduct,
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete product';
            setError(message);
            throw error;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearCurrentProduct = useCallback(() => {
        setState(prev => ({ ...prev, currentProduct: null }));
    }, []);

    return {
        ...state,
        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        clearError,
        clearCurrentProduct,
    };
};