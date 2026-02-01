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
       const updatedData = action.payload
       state.customers = state.customers?.map((customer)=> customer?.id === Number(updatedData.id) ? updatedData : customer)
       
     },
     deleteCustomers: (state,action)=>{
       const deletedId = action.payload
       state.customers = state.customers?.filter((customer)=> customer?.id !== Number(deletedId))
       
     },
      increaseDue:(state,action)=>{
       const {userId,amount,latest_transaction_payment_type,latest_transaction_date,latest_transaction_amount} = action.payload
       const user = state.customers.find( u => u.id === Number(userId))
       
       if (user) {
         user.grand_total_due -= Number(amount)
         user.latest_transaction_payment_type = latest_transaction_payment_type
         user.latest_transaction_date = latest_transaction_date
         user.latest_transaction_amount = latest_transaction_amount
       }
     },
      decreaseDue:(state,action)=>{
       const {userId,amount,latest_transaction_payment_type,latest_transaction_date,latest_transaction_amount} = action.payload
       const user = state.customers.find( u => u.id === Number(userId))
      
       if (user) {
         user.grand_total_due += Number(amount)
          user.latest_transaction_payment_type = latest_transaction_payment_type
         user.latest_transaction_date = latest_transaction_date
         user.latest_transaction_amount = latest_transaction_amount
       }
     },
  },
})

// Action creators are generated for each case reducer function
export const { setCustomers,createCustomers,updateCustomers ,increaseDue,decreaseDue,deleteCustomers} = ledgerSlice.actions

export default ledgerSlice.reducer