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
            {session?.user.role === "admin" && (
              <TopMenuItem item="CreateShop" pageRef="/admin/create"/>
            )}
            
            {session ? (
              <>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="relative group px-4 py-2 h-full flex items-center text-[12px] font-mono uppercase tracking-[0.3em] text-gray-300 hover:text-white transition-all duration-300"
                >
                  Logout
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500/50 group-hover:w-full transition-all duration-500" />
                </button>
                <TopMenuItem item="Chat" pageRef="/chat"/>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="relative group px-4 py-2 h-full flex items-center text-[12px] font-mono uppercase tracking-[0.3em] text-gray-300 hover:text-white transition-all duration-300"
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500/50 group-hover:w-full transition-all duration-500" />
              </button>
            )}
          </>
        )}        
      </div>

      <UserSection/>
    </div>
  )
}