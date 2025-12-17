import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sale: [],
  monthlySaleData:{},
  todayIncome:{},
}; 

export const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
     setSale: (state, action) => {
      state.sale = action.payload;
    },
    setMonthlySaleData : (state,action) => {
      state.monthlySaleData = action.payload
    },
    setTodayIncome: (state,action) =>{
      state.todayIncome = action.payload
    },
    createSaleData: (state,action) =>{
      state.sale.unshift(action.payload)
    },
    editSale: (state, action) => {
      const updated = action.payload;
      state.sale = state.sale.map(p =>
        p.id === updated.id ? updated : p
      );
    },
    deleteSale : (state,action) =>{
      const id = action.payload;
      state.sale = state.sale.filter(p => p.id !== id)
    }
  },
})

// Action creators are generated for each case reducer function
export const {setSale,setMonthlySaleData,createSaleData,setTodayIncome,editSale,deleteSale} = saleSlice.actions

export default saleSlice.reducer