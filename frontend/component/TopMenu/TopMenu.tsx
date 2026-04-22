'use client'
import LogoSection from "./LogoSection";
import TopMenuItem from "./TopMenuItem";
import UserSection from "./UserSection";
import ThemeToggle from "./ThemeToggle"; 
import { useSession } from "next-auth/react";

export default function TopMenu(){
  const { data: session } = useSession();
  
  return(

    <div className="w-full h-20 border-b border-card-border flex justify-between items-center relative px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <LogoSection/>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center gap-12 tracking-wide uppercase text-sm font-light text-text-main">
        <TopMenuItem item="Shop" pageRef="/shop"/>
        <TopMenuItem 
          item="Reservation" 
          pageRef={session?.user?.role === "shopowner" ? "/shopowner/reservations" : "/reservations"}
        />
        {session?.user?.role === "shopowner" && (
          <TopMenuItem item="Chat" pageRef="/chat" />
        )}
        
        {session?.user.role==="admin" && <TopMenuItem item="AllUser" pageRef="/admin/user"/>}
        {session ? (
          <>
<TopMenuItem item="Logout" pageRef="/api/auth/signout"/>
          </>
        ) : (
          <TopMenuItem item="Login" pageRef="/api/auth/signin"/>
        )}          
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserSection/>
      </div>
    </div>
  )
}