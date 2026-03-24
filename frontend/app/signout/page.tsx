'use client'
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function SignoutPage() {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-start px-8 py-32">
      
      <div className="max-w-md w-full">
        
        <div className="text-center mb-14">
          <h1 className="text-3xl font-serif uppercase tracking-[0.3em] text-gray-100">Sign Out</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-4">Are you sure you wish to leave?</p>
          <div className="h-[1px] w-12 bg-blue-500/30 mx-auto mt-8" />
        </div>

        <div className="bg-[#1e2d3d]/40 border border-gray-700/30 rounded-2xl p-12 backdrop-blur-md shadow-2xl text-center">
          
          <p className="text-sm text-gray-400 mb-10 leading-relaxed">
            You will need to log in again to manage your reservations and profile details.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-4 bg-red-900/20 border border-red-500/40 text-red-400 text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-500 hover:bg-red-600 hover:text-white disabled:opacity-50 shadow-lg shadow-red-900/20"
            >
              {loading ? "Processing..." : "Confirm Sign Out"}
            </button>

            <Link 
              href="/profile" 
              className="w-full py-4 bg-transparent border border-gray-800 text-gray-500 text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-500 hover:border-gray-400 hover:text-white"
            >
              Cancel
            </Link>
          </div>

        </div>

     
      </div>
    </main>
  )
}