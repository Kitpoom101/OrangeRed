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
        
        {/* 2. Wait for the session status to resolve before rendering dynamic buttons */}
        {status === "loading" ? (
          // Optional: You can put a loading skeleton or a blank div here to prevent layout shift
          <div className="w-[60px] h-[32px]"></div>
        ) : (
          <>
          <TopMenuItem item="Chat" pageRef="/chat"/>
          <TopMenuItem item="Logout" pageRef="/api/auth/signout"/>
          </>
        )}        
      </div>

      <UserSection/>
    </div>
  )
}