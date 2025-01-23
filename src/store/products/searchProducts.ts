import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
    total: number,
    current: number,
    loading: boolean
}

// ✅ Initial state
const initialState: CounterState = {
    value: [],
    total: 0,
    current: 1,
    loading: false
};

// ✅ Create an async thunk to fetch products
export const searchProduct = createAsyncThunk("counter/searchProduct", async ({ query }: { query: string, }) => {
    const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
    const data = await response.json();
    return data; // Assuming the API returns { products: [] }
});


// ✅ Create a slice
const searchSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        // ✅ Reducer to manually set products
        incrementPage: (state) => {
            if (state.current <= state.total) {
                state.current += 1;
            }
        },
        decrementPage: (state) => {
            if (state.current != 1) {
                state.current -= 1;
            }
        }
    },
    // ✅ Handle async thunk in extraReducers
    extraReducers: (builder) => {
        builder.addCase(searchProduct.pending, (state) => {
            state.loading = true
        });
        builder.addCase(searchProduct.fulfilled, (state, action) => {
            state.loading = false
            state.value = action.payload.products;
            state.total = Math.ceil(action.payload.total);
        });
    }
});

// ✅ Export actions and reducer
export const { incrementPage, decrementPage } = searchSlice.actions;
export default searchSlice.reducer;
