import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],     // product list  ke liye
  produtCategry: [],
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
     setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductCategry: (state,action) => {
      state.produtCategry = action.payload
    },
    
    addProductData: (state, action) => {
      state.products.unshift(action.payload); // fast & instant
    },

    editProduct: (state, action) => {
      const updated = action.payload;
      state.products = state.products.map(p =>
        p.id === updated.id ? updated : p
      );
    },

    removeProduct: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter(p => p.id !== id);
    },
  },
})

// Action creators are generated for each case reducer function
export const { setProducts,addProductData,editProduct,removeProduct,setProductCategry } = productSlice.actions

export default productSlice.reducer