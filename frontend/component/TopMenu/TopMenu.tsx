'use client'
import LogoSection from "./LogoSection";
import TopMenuItem from "./TopMenuItem";
import UserSection from "./UserSection";
import { useSession } from "next-auth/react";

export default function TopMenu(){
  const {data: session} = useSession();
  
  return(
    <div className="w-full h-20 border-b-2 border-white/40 flex justify-between items-center relative">
      <LogoSection/>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center gap-12 tracking-wide uppercase text-sm font-light">
        <TopMenuItem item="Profile" pageRef="/profile"/>
        <TopMenuItem item="Reservation" pageRef="/reservations"/>
        {session ? (
          <TopMenuItem item="Logout" pageRef="api/auth/signout"/>
        ):(
          <TopMenuItem item="Login" pageRef="api/auth/signin"/>
        )}
      </div>

      <UserSection/>
    </div>
  )
}