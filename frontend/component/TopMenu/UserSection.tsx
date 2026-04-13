'use client'
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export default function UserSection(){
  const { data: session } = useSession();
  const name = session?.user.name;
  const role = session?.user.role;
  const raw = session?.user?.profilePicture;
  const profilePicture = raw && /^https?:\/\//i.test(raw) ? raw : null;

  const isAdmin = role === "admin";
  const initials = name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return(
    <Link
      href="/profile"
      className="group flex items-center gap-3 px-8 border-l border-gray-800 hover:bg-blue-500/5 transition-all duration-500"
    >
      {/* Avatar */}
      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-700 group-hover:border-blue-500/50 transition-colors duration-300 shrink-0">
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt={name ?? "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold ${isAdmin ? "bg-red-900/40 text-red-300" : "bg-blue-900/40 text-blue-300"}`}>
            {session ? initials : "?"}
          </div>
        )}
      </div>

      {/* Name & role */}
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
