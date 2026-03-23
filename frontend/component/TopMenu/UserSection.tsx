'use client'
import { useSession } from "next-auth/react"

export default function UserSection(){
  const {data: session} = useSession();
  const name = session?.user.name;
  const role = session?.user.role;
  return(
    <div className="w-64 h-full p-5 flex font-mono flex-col justify-center gap-1 cursor-default hover:bg-sky-500/10 transition-all duration-150">
      <p className="text-green-400">User : {session?.user.name || "Guest"}</p>
      <p className={`${role=="admin" ? "text-red-400" : "text-yellow-400"}`}>Role : {role || "Guest"}</p>
    </div>
  )
}