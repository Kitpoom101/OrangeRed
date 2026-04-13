'use client'
import Link from "next/link";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
}

export default function SuccessModal({ isOpen, onClose, shopName }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      <div className="relative bg-card border border-white/5 w-full max-w-[400px] overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all animate-in zoom-in-95 duration-300">
        
        <div className="h-1.5 w-full bg-accent relative overflow-hidden">
           <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>

        <div className="p-12 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] text-accent/5 font-serif italic pointer-events-none select-none">
            S
          </div>

          <div className="mb-8 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center mb-4">
               <span className="text-accent text-sm">✦</span>
            </div>
            <p className="text-accent text-[10px] tracking-[0.6em] uppercase font-bold">Transaction Complete</p>
          </div>

          <h2 className="text-2xl font-serif italic tracking-tight text-text-main mb-3">
            Reservation Secured
          </h2>
          
          <div className="flex flex-col items-center gap-4 mb-12">
             <div className="py-2 px-4 bg-accent/5 border border-accent/10 rounded-lg">
                <p className="text-[10px] font-mono tracking-widest text-text-sub uppercase">
                  Shop: <span className="text-accent font-bold ml-1">{shopName}</span>
                </p>
             </div>
             
             <p className="max-w-[240px] text-[10px] text-text-sub uppercase tracking-[0.2em] leading-loose opacity-60">
               Your session has been saved. 
               We are preparing for your arrival.
             </p>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <Link 
              href="/reservations" 
              className="group relative w-full py-4 bg-accent text-white text-[10px] uppercase tracking-[0.4em] transition-all duration-500 font-bold rounded-xl overflow-hidden shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">View My Schedule</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <button 
              onClick={onClose}
              className="w-full py-2 text-text-sub/50 hover:text-accent text-[9px] uppercase tracking-[0.3em] transition-colors duration-300"
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* System Stamp */}
        <div className="absolute bottom-4 right-8 opacity-[0.05]">
            <p className="text-[8px] font-mono uppercase tracking-tighter italic">Verified_Booking_ID</p>
        </div>
      </div>
    </div>
  );
}