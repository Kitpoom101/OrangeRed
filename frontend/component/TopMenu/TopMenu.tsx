'use client'
import LogoSection from "./LogoSection";
import TopMenuItem from "./TopMenuItem";
import UserSection from "./UserSection";
import { useSession } from "next-auth/react";

export default function TopMenu(){
  const {data: session} = useSession();
  return(
    <div className="w-full h-32 border-b-2 border-white flex justify-between relative">
      <LogoSection/>
      <div className="w-132 h-full absolute left-1/2 -translate-x-1/2 flex justify-evenly px-3 gap-8 items-center ">
        <TopMenuItem item="Profile" pageRef=""/>
        <TopMenuItem item="Reservation" pageRef=""/>
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