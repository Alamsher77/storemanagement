import { configureStore } from '@reduxjs/toolkit'
import productReducer from './productSlice'
import saleReducer from './saleSlice'
export const store = configureStore({
  reducer: {
    product:productReducer,
    sale: saleReducer,
  }
})