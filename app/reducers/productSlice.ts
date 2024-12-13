import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
// Define the structure of a single product
export interface ProductState {
  id:string
  productname: string;
  productdetails: string;
  price: string;
  image: string;
  category: string;
  quantity:number
}

// Define the state shape for the product slice
export interface ProductSliceState {
  product: ProductState[]; // Array of products
}

// Initialize the state
const initialState: ProductSliceState = {
  product: [], // Empty array initially
};

// Create the slice
export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
   
    addItems: (state, action: PayloadAction<Omit<ProductState, 'id'>>) => {
      state.product = [...state.product, {id:uuidv4(), ...action.payload}];
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.product = state.product.filter((item) => item.id !== action.payload);
    },
   addQuantity:(state,action:PayloadAction<string>)=>{
    const producTItem=state.product.find(item=>item.id===action.payload)
    if(producTItem){
      producTItem.quantity=(producTItem.quantity??0)+1

    }
   

   },
   subtractQuantity:(state,action:PayloadAction<string>)=>{
    const productItem=state.product.find(item=>item.id===action.payload)
    if(productItem){
      if(productItem.quantity===0){
        return 
        
      }
      productItem.quantity=productItem.quantity-1
    }

   }
  
  },
});

// Export actions and reducer
export const { addItems,removeItem,addQuantity,subtractQuantity} = productSlice.actions;
export default productSlice.reducer;
