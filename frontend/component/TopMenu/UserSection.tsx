'use client'
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function UserSection(){
  const { data: session } = useSession();
  const name = session?.user.name;
  const role = session?.user.role;
  
  const isAdmin = role === "admin";

  return(
    <Link 
      href="/profile" 
      className="group flex flex-col justify-center px-8 border-l border-gray-800 hover:bg-blue-500/5 transition-all duration-500"
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 group-hover:text-blue-400 transition-colors">
          {name || "Guest Access"}
        </p>

        <div className="flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full animate-pulse ${isAdmin ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"}`} />
          <p className={`text-[8px] font-mono uppercase tracking-[0.3em] ${isAdmin ? "text-red-400/80" : "text-gray-500"}`}>
            {role || "External"}
          </p>
        </div>
      </div>
    </Link>
  )
}