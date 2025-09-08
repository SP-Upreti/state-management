import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
    slug: string;
    name: string;
    url: string;
}

interface CategoriesState {
    categories: Category[]
}

const initialState: CategoriesState = {
    categories: []
}

export const getAllCategories = createAsyncThunk("allCategories/getAllCategories", async () => {
    const response = await fetch('https://dummyjson.com/products/categories');
    const data = await response.json();
    return data as Category[]
})

const allCategoriesSlice = createSlice({
    name: "allCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload
        })
    }
});

// export const {  } = allCategoriesSlice.actions;
export default allCategoriesSlice.reducer