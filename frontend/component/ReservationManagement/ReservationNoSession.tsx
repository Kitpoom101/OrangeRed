import Link from "next/link";
import { signIn } from "next-auth/react";

export default function ReservationNoSession(){

  return(
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-8">
      <div className="w-16 h-[1px] bg-blue-500/30 mb-8" />
      
      <h2 className="text-xs uppercase tracking-[0.4em] text-text-sub font-light mb-4">
        Identity Required
      </h2>
      
      <p className="max-w-xs text-center text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-10 leading-relaxed">
        Please login to manage your reservation
      </p>

      <div className="flex flex-col gap-4 w-full max-w-[260px]">
        <button 
          onClick={() => signIn()}
          className="w-full py-4 bg-blue-600/10 border border-blue-500/50 text-blue-400 text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all duration-500 rounded-sm shadow-lg shadow-blue-900/20"
        >
          Sign In
        </button>
        
        <Link 
          href="/register" 
          className="w-full py-4 bg-transparent border border-gray-700/50 text-text-sub text-[10px] text-center uppercase tracking-[0.3em] hover:border-gray-500 hover:text-white transition-all duration-500 rounded-sm"
        >
          Register
        </Link>

        <Link 
          href="/" 
          className="mt-4 text-center text-[9px] uppercase tracking-[0.2em] text-gray-600 hover:text-text-sub transition-colors"
        >
          ← Return to Home
        </Link>
      </div>

      <div className="mt-16 flex items-center gap-4 opacity-20">
        <div className="h-[1px] w-8 bg-white" />
        <p className="text-[8px] text-white uppercase tracking-[0.6em] italic">
          Private Access
        </p>
        <div className="h-[1px] w-8 bg-white" />
      </div>
    </main>
  )
}