"use client"
import React, { useEffect } from 'react'


import Image from 'next/image'
import {
    Card,
   
  } from "@/components/ui/card"


import { Button } from '@/components/ui/button'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

  

export default function Login() {
  const { data: session, status } = useSession();
  const router=useRouter()
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/home');
    }
  }, [status, router])
  if(status==='loading'){
    return  <div className="flex items-center justify-center h-screen w-full">
    <div className="w-1/3 max-w-xs sm:max-w-md lg:max-w-lg transform translate-x-10 -translate-y-10">
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      Loading Please wait .....
    </h2>
    </div>
  </div>
  }
  if (status === "authenticated") {
    return null; // Prevents rendering if user is already authenticated
  }


  return (
    <main >
        <Card className='absolute top-[30%] left-[25%] w-[50vw] h-[45vh] flex flex-col justify-around items-center shadow-[0px_54px_55px_rgba(0,0,0,0.25),_0px_-12px_30px_rgba(0,0,0,0.12),_0px_4px_6px_rgba(0,0,0,0.12),_0px_12px_13px_rgba(0,0,0,0.17),_0px_-3px_5px_rgba(0,0,0,0.09)]'>
        <h3 className="scroll-m-20 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight">
  You need a Google account for this
</h3>


    <Button className='w-[80%] bg-blue-500 text-white rounded-[10px] hover:bg-blue-600' onClick={()=>signIn('google')}>
    <h3 className="scroll-m-20 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight">
  Continue With Google
</h3>

    <Image
      src='/images/google.webp'
      alt="Picture of the user"
       width={30} 
       height={30} 
       className='bg-white rounded-full border border-white'
     
    />
    </Button>
    <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="scroll-m-20 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight underline hover:text-blue-500">
  Open Google Account
</a>

 
</Card>


    </main>
  )
}

