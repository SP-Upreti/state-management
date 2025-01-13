import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Categories from "../../components/products/categories";

interface Categories {
    categories: string[]
}

const initialState: Categories = {
    categories: []
}

export const getAllCategories = createAsyncThunk("allCategories/getAllCategories", async () => {
    const response = await fetch('https://dummyjson.com/products/categories');
    const data = await response.json();
    return data as string[]
})

const allCategoriesSlice = createSlice({
    name: "allCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
            state.categories = action.payload
        })
    }
});

// export const {  } = allCategoriesSlice.actions;
export default allCategoriesSlice.reducer