import Link from "next/link";
import { signIn } from "next-auth/react";

export default function ReservationNoSession(){

  return(
    <main className="min-h-screen bg-background text-text-main flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Terminal Line */}
        <div className="w-12 h-[1px] bg-accent/40 mb-10" />
        
        <div className="space-y-4 mb-12 text-center">
          <h2 className="text-[11px] uppercase tracking-[0.6em] text-accent font-bold">
            Identity Required
          </h2>
          <div className="flex justify-center">
             <div className="h-px w-4 bg-accent/20" />
          </div>
          <p className="max-w-[280px] text-[10px] uppercase tracking-[0.2em] text-text-sub leading-loose opacity-70">
            Authorization is needed to access the reservation registry.
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full max-w-[280px]">
          {/* Sign In - Primary Action */}
          <button 
            onClick={() => signIn()}
            className="group relative w-full py-4 bg-accent/10 border border-accent/30 rounded-xl transition-all duration-500 hover:bg-accent hover:shadow-[0_0_30px_rgba(51,86,203,0.3)] active:scale-[0.98]"
          >
            <span className="relative z-10 text-accent group-hover:text-white text-[10px] uppercase tracking-[0.4em] font-bold transition-colors">
              Sign In
            </span>
          </button>
          
          {/* Register - Secondary Action */}
          <Link 
            href="/register" 
            className="w-full py-4 bg-transparent border border-white/5 text-text-sub text-[10px] text-center uppercase tracking-[0.4em] hover:bg-white/[0.02] hover:text-text-main hover:border-white/10 transition-all duration-500 rounded-xl"
          >
            Register Account
          </Link>

          <Link 
            href="/" 
            className="mt-6 text-center text-[9px] uppercase tracking-[0.3em] text-text-sub/50 hover:text-accent transition-colors duration-300 group"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 mr-2">←</span>
            Return to Gateway
          </Link>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-24 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 opacity-30">
            <div className="h-px w-6 bg-accent" />
            <p className="text-[8px] text-accent uppercase tracking-[0.8em] font-medium">
              Secure Access
            </p>
            <div className="h-px w-6 bg-accent" />
          </div>
          <p className="text-[7px] text-text-sub/30 font-mono tracking-widest">
            ENCRYPTED_SESSION_v3
          </p>
        </div>
      </div>
    </main>
  )
}