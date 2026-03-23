'use client'

import deleteShop from "@/libs/shops/deleteShop";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DeleteButton({shopId}:{shopId:string}){
  const {data: session} = useSession();
  const router = useRouter();
  
  async function handleDelete() {
    try{
      if(!session){
        signIn(undefined, {
          callbackUrl: window.location.href 
        });
        return;
      }
      const res = await deleteShop(shopId, session?.user.token);
      if (res?.success || res?.ok) {
        router.push("/shop");
      }
    }catch(err){
      console.log("Cannot delete");
    }
  }

  return(
    <button className="bg-red-500 hover:bg-red-600 cursor-pointer transition-all duration-150 px-5 py-2 fixed bottom-6 right-10 rounded-xl"
    onClick={handleDelete}>
      Delete This Shop
    </button>
  )
}