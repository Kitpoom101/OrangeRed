"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignoutPage() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start px-8 py-32 transition-colors duration-500">
      
      <div className="max-w-md w-full">
        
        <div className="text-center mb-14">
          <h1 className="text-3xl font-serif uppercase tracking-[0.3em] text-text-main italic">Sign Out</h1>
          <p className="text-[10px] text-text-sub uppercase tracking-[0.3em] mt-4">Are you sure you wish to leave?</p>
          <div className="h-[1px] w-12 bg-accent/30 mx-auto mt-8" />
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-12 backdrop-blur-md shadow-2xl text-center transition-all duration-300">
          
          <p className="text-sm text-text-sub mb-10 leading-relaxed font-light">
            You will need to log in again to manage your <span className="text-text-main font-semibold">reservations</span> and profile details.
          </p>

          <div className="flex flex-col gap-5">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-300 hover:bg-red-500 hover:text-white disabled:opacity-50 shadow-lg shadow-red-500/5"
            >
              {loading ? "Closing session..." : "Confirm Sign Out"}
            </button>

            <Link 
              href="/profile" 
              className="w-full py-4 bg-surface/30 border border-card-border text-text-sub text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-300 hover:border-text-sub hover:text-text-main flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* ข้อความปิดท้ายเล็กๆ */}
        <p className="mt-12 text-center text-[9px] uppercase tracking-[0.3em] text-text-sub opacity-50">
          ✦ See you again soon at Venue Explorer ✦
        </p>
      </div>
    </main>
  );
}