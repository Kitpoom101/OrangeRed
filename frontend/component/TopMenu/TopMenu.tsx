'use client'
import LogoSection from "./LogoSection";
import TopMenuItem from "./TopMenuItem";
import UserSection from "./UserSection";
import { useSession, signOut, signIn } from "next-auth/react";

export default function TopMenu(){
  // 1. Destructure 'status' from useSession
  const { data: session, status } = useSession();
  
  return(
    <div className="w-full h-20 border-b-2 border-white/40 flex justify-between items-center relative">
      <LogoSection/>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center gap-12 tracking-wide uppercase text-sm font-light">
        <TopMenuItem item="Shop" pageRef="/shop"/>
        <TopMenuItem item="Reservation" pageRef="/reservations"/>
        
        {session?.user.role==="admin" && <TopMenuItem item="CreateShop" pageRef="/admin/create"/>}
        {session ? (
          <>
<TopMenuItem item="Logout" pageRef="/api/auth/signout"/>
          </>
        ):(
          <TopMenuItem item="Login" pageRef="/api/auth/signin"/>
        )}          
      </div>

      <UserSection/>
    </div>
  )
}