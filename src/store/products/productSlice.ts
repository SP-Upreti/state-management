import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const url = "https://dummyjson.com/products";

// ✅ Define the Product type
interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    discountPercentage: number;
    // Add other properties from the API response as needed
}

// ✅ Define the state type
interface CounterState {
    value: Product[];
}

// ✅ Initial state
const initialState: CounterState = {
    value: []
};

// ✅ Create an async thunk to fetch products
export const fetchProducts = createAsyncThunk("counter/fetchProducts", async () => {
    const response = await fetch(url);
    const data = await response.json();
    return data.products; // Assuming the API returns { products: [] }
});

// ✅ Create a slice
const counterSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        // ✅ Reducer to manually set products
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.value = action.payload;
        }
    },
    // ✅ Handle async thunk in extraReducers
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.value = action.payload;
        });
    }
});

// ✅ Export actions and reducer
export const { setProducts } = counterSlice.actions;
export default counterSlice.reducer;
