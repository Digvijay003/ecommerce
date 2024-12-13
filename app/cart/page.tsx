"use client";
import React, { useEffect, useState } from 'react';
import type { RootState } from '../../app/store';
import { useSelector,useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import { MdCancel } from "react-icons/md";
import axios from 'axios'

import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
  import { removeItem } from '../reducers/cartSlice';

  interface TotalsState {
    totalQuantities: number;
    totalPrice: number;
}

export default function Cart() {
    const { data: session, status } = useSession();
    const cartItems = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch()

    // Use state to hold total quantities and total price
    const [totals, setTotals] = useState<TotalsState>({ totalQuantities: 0, totalPrice: 0 });

    useEffect(() => {
        let totalQuantities = 0;
        let totalPrice = 0;

        cartItems.cart.forEach(item => {
            totalQuantities += item.quantity;
            totalPrice += item.quantity * Number(item.price);
        });

        // Update state with calculated totals
        setTotals({ totalQuantities, totalPrice });
    }, [cartItems]); // Recalculate totals whenever cartItems change

    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <div className="w-1/3 max-w-xs sm:max-w-md lg:max-w-lg">
                    <Progress value={33} />
                </div>
            </div>
        );
    }

    const deleteItem=(id:string)=>{
      dispatch(removeItem(id))

    }
    const handlePayment = async () => {
      try {
          const response = await axios.post('/api/dummyPayment', { totals }, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          // Handle success
          if (response?.data) {
            
              alert(`Payment successful! ${response?.data?.data?.totals?.totalPrice}`);
              // Redirect to success page
          } else {
              alert('Payment failed!');
          }
      } catch (error) {
          console.error('Payment error:', error);
          alert('Payment failed due to a network error.');
      }
  };
  

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-start overflow-hidden">
            <h1>Cart Page</h1>
            <h2>Total Quantities: {totals.totalQuantities}</h2>
            <h2>Total Price: {totals.totalPrice}</h2>
            {cartItems?.cart?.map((item, index) => (
  <div 
    key={index}
    className="relative w-[50vw] flex flex-col items-center cursor-pointer border border-gray justify-center rounded-md shadow-md sm:w-[90vw] md:w-[75vw] lg:w-[50vw] m-2 p-2"
  >
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[150px] max-w-md  md:min-w-[320px] "
    >
      <ResizablePanel defaultSize={15}>
        <div className="flex h-full items-center justify-center flex-col ">
          <span className="font-semibold">Name-{item.productname}</span>
        </div>
      </ResizablePanel>
    
      <ResizablePanel defaultSize={85}>
        <div className="flex h-full items-center justify-between ">
        <div className="h-full flex flex-col items-center justify-center flex-wrap overflow-auto">
  <span className=" w-full max-h-[150px] overflow-auto">Description- <span className='font-medium'>{item.productdetails}</span></span>
  <span className="">Total Quantity - <span className='font-medium'>{item.quantity}</span></span>
  <span className="">Total Price - <span className='font-semibold   sm:text-sm md:text-base lg:text-lg font-medium '>{item.price}</span></span>
</div>

        
          <Image
            src={item.image}
            alt="Picture of the Product"
            width={60}
            height={50}
            className="w-12 h-12 rounded-full border-2 border-blue-500"
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>

    {/* Cancel Icon */}
    <MdCancel 
      style={{
        width: '30px',
        height: '30px',
        color: 'red',
      }} 
      onClick={()=>deleteItem(item.id)}
      className="absolute top-2 right-2 cursor-pointer"
    />
  </div>
))}

              <Button className="bg-green-500 text-white cursor-pointer hover:bg-green-700 px-2 py-2 md:px-4 md:py-2 sm:px-4 sm:py-2 lg:px-8 lg:py-4 text-[.9rem] sm:text-[1rem] lg:text-[1.2rem]"onClick={handlePayment}>
  CheckOut
</Button>
           
        </div>
    );
}
