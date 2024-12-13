"use client"
import { Button } from "@/components/ui/button";

import {  useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import styles from './style.module.css'
import Modal from "react-modal";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { RootState } from '../../app/store'
import { useSelector, useDispatch } from 'react-redux'
import { addItems,removeItem, addQuantity,subtractQuantity } from "../../app/reducers/productSlice";
import { Checkbox } from "@/components/ui/checkbox"
import { GrSubtractCircle } from "react-icons/gr";
import { addItemsInCart } from "../reducers/cartSlice";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Image from "next/image";
import { ProductState } from "../../app/reducers/productSlice";
import { cartItem } from "../reducers/cartSlice";
import { Progress } from "@/components/ui/progress";
import { MdCancel } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Link from 'next/link'


export default function Dashboard() {

  
  const [categories,setCategories]=useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductState[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const products=useSelector((state:RootState)=>state.product)
  const reduxState=useSelector((state:RootState)=>state)
  console.log(reduxState,'Complete Redux state')
  const dispatch = useDispatch()

  const { toast } = useToast()

  


  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session])

 
 

  useEffect(() => {
    if (products?.product) {
      const uniqueCategories = [...new Set(products.product.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(products.product); // Show all products if no category is selected
    } else {
      const filtered = products.product.filter((product) =>
        selectedCategories.includes(product.category)
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategories, products]);
  
  


  
  
  
  const FormSchema = z.object({
    productname: z.string().min(3, {
      message: "Product Name must be at least 3 characters.",
    }),
    productdetails:z.string().min(8,{message:'Product details should be atleast 8 characters'}),
    category: z.string().min(1,{message:"Please select a category."}),
    price: z.string()
    .min(1,{message:"Please select a price "})
   ,
    image: z.object({
      file: z.instanceof(File).nullable(), // allow null values
      previewUrl: z.string(),
    }),
   
  })
  const openModal = ():void => setIsModalOpen(true);
  const closeModal = ():void => setIsModalOpen(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productname: "",
      productdetails:'',
      category:'',
      price:'',
      image: {
        file: null as File|null,
        previewUrl: '',
      },
    },
  })
  function onSubmit(data: z.infer<typeof FormSchema>) {
    
    
    const formattedData = {
      ...data,
      image: data.image.previewUrl,
      quantity:1
     
    };
    dispatch(addItems(formattedData))
    closeModal()
  
  }

 

  // Redirect to the sign-in page if the user is not authenticated
  
 

  if(status==='loading'|| status==='unauthenticated'){
    return  <div className="flex items-center justify-center h-screen w-full">
    <div className="w-1/3 max-w-xs sm:max-w-md lg:max-w-lg">
      <Progress value={33} />
    </div>
  </div>
  }

  const handleCategoryChange = (checked:boolean | string, category: string) => {
   
    if (checked) {
      
      setSelectedCategories((prev) => [...prev, category]);
   
    } else {
     
      setSelectedCategories((prev) =>
        prev.filter((selectedCategory) => selectedCategory !== category)
      );
     
    }
  };

  const deleteProduct=(id:string)=>{
     dispatch(removeItem(id)); // Update Redux store
    // setFilteredProducts((prev) => prev.filter((item) => item.id !== id));

  }

  const handleIncrement=(id:string)=>{
    dispatch(addQuantity(id))

  }
  const handleDecrement=(id:string)=>{
    dispatch(subtractQuantity(id))
  }

  const addItemsToCart=(item:cartItem)=>{
   
    toast({
      title: "Item is added to the cart",
      description: "hjkdghjkghjkdfhgjkhkjdfghkdfh",
      action: <ToastAction altText="Try again"><Link href='/cart'>Go to cart</Link></ToastAction>,
    })
    dispatch(addItemsInCart(item))

  }
 


  




  // Display user details
  return (<div>
  
    <div className={styles.parentContainer}>
      <div className={styles.sideMenu}>
        
        <Button  className=" bg-blue-500 text-white  border-white rounded-lg font-bold text-[1.1rem] hover:bg-blue-600 hover:text-white hover:border-white rounded-full"onClick={openModal}>Publish Items</Button>
        {categories.map((item,index)=>(
          <div className="flex items-center space-x-2"key={index}>
      <Checkbox id={`${item}-${index}`} onCheckedChange={(checked) => handleCategoryChange(checked, item)}/>
      <label
        htmlFor="terms"
        className="text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
      {item}
      </label>
    </div>
        ))}
     
  

      </div>
     
    
     
      <div className={styles.products}>
       
        {filteredProducts?.map((item,index)=>(
          <ResizablePanelGroup
          key={index}
      direction="horizontal"
      className=" rounded-md border border-black/50 shadow-md cursor-pointer"
      style={{ height: '36vh',width:'39vw' }}
     
    >
      <ResizablePanel defaultSize={40}>
        <div className="flex h-[200px] items-center justify-center p-6">
         
          <Image
      src={item.image}
      alt="Picture of the Product"
       width={150} 
       height={100} 
       
     
    />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>
  <div className="flex flex-col h-full items-center justify-center">
    <span className="scroll-m-20 text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-tight">{item.productname}</span>
    <span className="scroll-m-20 text-base sm:text-sm md:text-lg lg:text-lg tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">{item.productdetails}</span>
  </div>
</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={130}>
  <div className="flex flex-col h-full items-center justify-center space-y-2 sm:space-y-1">
    <span className="scroll-m-20 text-base sm:text-sm md:text-lg lg:text-xl tracking-tight">{item.category}</span>
    <span className="scroll-m-20 text-base sm:text-sm md:text-lg lg:text-xl  font-medium tracking-tight">{item.price}</span>
    <span className="scroll-m-20 text-base sm:text-sm md:text-lg lg:text-xl  tracking-tight flex items-center"><GrSubtractCircle style={{ width: '25px', height: '25px', color: 'red' }}onClick={()=>handleDecrement(item.id)}/> Quantity-{item?.quantity}<IoIosAddCircle style={{ width: '25px', height: '25px', color: 'green' }}onClick={()=>handleIncrement(item.id)}/></span>
    <Button className="bg-green-500 text-white cursor-pointer hover:bg-green-700 px-2 py-2 md:px-4 md:py-2 sm:px-4 sm:py-2 lg:px-8 lg:py-4 text-[.9rem] sm:text-[1rem] lg:text-[1.2rem]" onClick={()=>addItemsToCart(item)}>
  Add Items
</Button>

  </div>
</ResizablePanel>


        </ResizablePanelGroup>
      </ResizablePanel>
      <MdCancel style={{ width: '30px', height: '30px', color: 'red' }}onClick={()=>deleteProduct(item.id)}/>
    </ResizablePanelGroup>
        ))}
      
     
      </div>
     
   
    
     

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Publish Items Modal"
        className="bg-white p-8 rounded-lg max-w-lg w-[90%] text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        ariaHideApp={false}
      >
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="productname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-left  block">Product Name</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormDescription className=" italic text-left  block">
                This is your product name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="productdetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-left  block">Product Info</FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormDescription className=" italic text-left  block">
                This is your product description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-left  block">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white z-[9999]">
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Beauty Products">Beauty Products</SelectItem>
                  <SelectItem value="Kids Products">Kids Products</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className=" italic text-left  block">
                This is your product classification
           
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          {/* Status */}
          <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-left  block">Price</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a price range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white z-[9999]">
                      <SelectItem value="500">500</SelectItem>
                      <SelectItem value="1500">1000</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-left  block">Image</FormLabel>
                  <FormControl>
                  <FormControl>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const previewUrl = URL.createObjectURL(file);
              field.onChange({ file, previewUrl }); // Save both file and preview URL
            }
          }}
        />
      </FormControl>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        
        <div>
          <Button onClick={closeModal} className="bg-red-500 text-white mr-2 px-4 py-2 rounded cursor-pointer hover:bg-red-800">
            Cancel
          </Button>
          <Button  className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700"type='submit'>
            Confirm
          </Button>
        </div>
      </form>
    </Form>
       
      </Modal>
    
    </div>
    <div className={styles.pagination}>
        <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#"isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>

        </div>
    </div>
  );
}