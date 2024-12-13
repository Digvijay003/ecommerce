import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addItems } from './productSlice';


export interface cartItem{
    productname:string,
    productdetails:string,
    price:string,
    image:string,
    category:string,
    quantity:number,
    id:string
}

export interface cartSliceState {
    cart:cartItem[]
}

const initialState:cartSliceState={
    cart:[]
}

export  const cartSlice=createSlice({
    name:'cart',
    initialState,
    reducers:{
        addItemsInCart:(state,action:PayloadAction<cartItem>)=>{
            const findDupliacteItem=state.cart.find(item=>item.id===action.payload.id)
            if(findDupliacteItem){
                return
            }
            state.cart=[...state.cart, action.payload]

        },
        resetState:()=>{
            return initialState
        },
        removeItem:(state,action:PayloadAction<string>)=>{
            state.cart=state.cart.filter(item=>item.id!==action.payload)

        }
    }

})

export const {addItemsInCart,removeItem}=cartSlice.actions
export default cartSlice.reducer