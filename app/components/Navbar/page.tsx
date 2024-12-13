
"use client"
import React,{useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { signOut, useSession } from "next-auth/react";

import {
    Menubar,
 
  } from "@/components/ui/menubar"
import { Button } from '@/components/ui/button';

 

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function Navbar() {
  const { data: session, status } = useSession();
  const [position, setPosition] = useState<string>("bottom")
  
 
  return (
    <main >
     
          <Menubar className="flex justify-between items-center bg-blue-500 h-[14vh] text-white">
            <div className="flexflex-col items-center justify-evenly flex-wrap md:flex-row">
              <div className='flex flex-row gap-2 justify-evenly items-center'>

             
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
     ECommerce App
    </h4>
            <Image
      src='/images/ecommerce.jpg'
      alt="Picture of the author"
       width={50} 
       height={50} 
       className="rounded-full border-2 border-white"
   
     
    />
     </div>
    {session?.user ?<div>
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
         
            <Link href="/home">Home</Link>
         
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
        
            <Link href="/cart">Cart</Link>
         
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      
      </BreadcrumbList>
    </Breadcrumb>
    </div>:null}
    </div>
    <div className="flex flex-row gap-2 justify-evenly items-center">
    <h3 className="scroll-m-20 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight">
 {session?.user?.name}
</h3>

{session?.user?.image && (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Image 
        src={session.user.image} 
        alt={session.user.name || "User"} 
        width={50} 
        height={30} 
        className="rounded-full border-2 border-white cursor-pointer"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent 
      className="bg-white z-[9999] shadow-lg rounded-md p-4 
                 w-[10rem] md:w-[12rem] lg:w-[14rem] 
                 overflow-auto"
    >
      <DropdownMenuLabel className="text-black font-semibold cursor-pointer text-md">Panel Position</DropdownMenuLabel>
      <DropdownMenuSeparator className="my-2 border-gray-300" />
      <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
      <DropdownMenuRadioItem
  value="top"
  className="group flex items-center pl-8 pr-2 py-1 rounded cursor-pointer data-[state=checked]:bg-gray-200 hover:bg-gray-100"
>
  <span className="group-data-[state=checked]:text-gray-800">User Profile</span>
</DropdownMenuRadioItem>

<DropdownMenuRadioItem
  value="bottom"
  className="group flex items-center pl-8 pr-2 py-1 rounded cursor-pointer data-[state=checked]:bg-gray-200 hover:bg-gray-100"
>
  <span className="group-data-[state=checked]:text-gray-800"><Link href='/cart'>Cart</Link></span>
</DropdownMenuRadioItem>


      
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)}

      {session?<Button  onClick={()=>signOut()}className="bg-white text-blue-500  border-blue-500 rounded-lg font-bold text-[1.1rem] hover:bg-slate-100 px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-full">Sign Out</Button>:null}
    </div>
     
      </Menubar>

    </main>
  )
}

  