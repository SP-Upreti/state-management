import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminProduct {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: {
        rating: number;
        comment: string;
        date: string;
        reviewerName: string;
        reviewerEmail: string;
    }[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
    images: string[];
    thumbnail: string;
}

export interface NewProduct {
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    stock: number;
    brand: string;
    images: string[];
}

interface AdminProductState {
    products: AdminProduct[];
    currentProduct: AdminProduct | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    categories: string[];
}

const initialState: AdminProductState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    categories: []
};

// Async thunks
export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async ({ limit = 30, skip = 0 }: { limit?: number; skip?: number } = {}) => {
        const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
        const data = await response.json();
        return data;
    }
);

export const fetchProductById = createAsyncThunk(
    "adminProducts/fetchProductById",
    async (productId: number) => {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const data = await response.json();
        return data;
    }
);

export const addProduct = createAsyncThunk(
    "adminProducts/addProduct",
    async (productData: NewProduct, { rejectWithValue }) => {
        try {
            // Validate required fields
            if (!productData.title || !productData.category || productData.price <= 0) {
                throw new Error('Please fill in all required fields');
            }

            const response = await fetch('https://dummyjson.com/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...productData,
                    thumbnail: productData.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to add product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    "adminProducts/updateProduct",
    async ({ id, productData }: { id: number; productData: Partial<AdminProduct> }) => {
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        const data = await response.json();
        return data;
    }
);

export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (productId: number) => {
        await fetch(`https://dummyjson.com/products/${productId}`, {
            method: 'DELETE',
        });
        return productId;
    }
);

export const searchAdminProducts = createAsyncThunk(
    "adminProducts/searchProducts",
    async (query: string) => {
        const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
        const data = await response.json();
        return data;
    }
);

export const fetchProductsByCategory = createAsyncThunk(
    "adminProducts/fetchProductsByCategory",
    async (category: string) => {
        const response = await fetch(`https://dummyjson.com/products/category/${category}`);
        const data = await response.json();
        return data;
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentProduct: (state, action: PayloadAction<AdminProduct | null>) => {
            state.currentProduct = action.payload;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalProducts = action.payload.total;
                state.totalPages = Math.ceil(action.payload.total / 30);
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch products";
            })
            // Fetch Product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch product";
            })
            // Add Product
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.unshift(action.payload);
                state.totalProducts += 1;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to add product";
            })
            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                if (state.currentProduct?.id === action.payload.id) {
                    state.currentProduct = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update product";
            })
            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(p => p.id !== action.payload);
                state.totalProducts -= 1;
                if (state.currentProduct?.id === action.payload) {
                    state.currentProduct = null;
                }
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete product";
            })
            // Search Products
            .addCase(searchAdminProducts.fulfilled, (state, action) => {
                state.products = action.payload.products;
                state.totalProducts = action.payload.total;
                state.totalPages = Math.ceil(action.payload.total / 30);
            })
            // Fetch Products by Category
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.products = action.payload.products;
                state.totalProducts = action.payload.total;
                state.totalPages = Math.ceil(action.payload.total / 30);
            });
    }
});

export const {
    setCurrentPage,
    clearError,
    setCurrentProduct,
    clearCurrentProduct
} = adminProductSlice.actions;

export default adminProductSlice.reducer;
