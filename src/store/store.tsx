import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./products/productSlice"
import categoryReducer from "./categories/allCategories"

export const store = configureStore({
    reducer: {
        products: productReducer,
        categories: categoryReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;