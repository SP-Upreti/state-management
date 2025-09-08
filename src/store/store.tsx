import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./products/productSlice"
import categoryReducer from "./categories/allCategories"
import adminReducer from "./admin/adminSlice"
import adminProductReducer from "./admin/adminProductSlice"
import cartReducer from "./cart/cartSlice"

export const store = configureStore({
    reducer: {
        products: productReducer,
        categories: categoryReducer,
        admin: adminReducer,
        adminProducts: adminProductReducer,
        cart: cartReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;