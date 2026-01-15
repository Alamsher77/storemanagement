import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  customers: [],     // product list  ke liye 
};

export const ledgerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: { 
     setCustomers:(state,action)=>{
       state.customers = action.payload;
     },
     createCustomers: (state,action)=>{
       state.customers.unshift(action.payload);
     },
     updateCustomers: (state,action)=>{
       
     },
      increaseDue:(state,action)=>{
       const {userId,amount} = action.payload
       const user = state.customers.find( u => u.id === userId)
       if (user) {
         user.grand_total_due -= Number(amount)
       }
     },
      decreaseDue:(state,action)=>{
       const {userId,amount} = action.payload
       const user = state.customers.find( u => u.id === userId)
       if (user) {
         user.grand_total_due += Number(amount)
       }
     },
  },
})

// Action creators are generated for each case reducer function
export const { setCustomers,createCustomers,updateCustomers ,increaseDue,decreaseDue} = ledgerSlice.actions

export default ledgerSlice.reducer