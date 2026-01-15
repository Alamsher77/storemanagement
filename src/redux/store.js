import { configureStore } from '@reduxjs/toolkit'
import productReducer from './productSlice'
import saleReducer from './saleSlice'
import ledgerSlice from './ledgerSlice'
export const store = configureStore({
  reducer: {
    product:productReducer,
    sale: saleReducer,
    customers: ledgerSlice,
  }
})