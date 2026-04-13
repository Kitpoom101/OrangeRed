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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-card border border-card-border w-full max-w-md overflow-hidden rounded-xl shadow-2xl transform transition-all duration-300">
        
        <div className="h-1 w-full bg-accent/50" />

        <div className="p-10 text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <span className="text-accent text-[10px] tracking-[0.5em] uppercase font-bold">— Success —</span>
          </div>

          <h2 className="text-xl font-serif uppercase tracking-[0.2em] text-text-main mb-2">
            Reservation Secured
          </h2>
          
          <div className="flex flex-col items-center gap-2 mb-10">
             <p className="text-[11px] font-mono tracking-tighter text-text-sub uppercase">
               Shop: <span className="text-text-main font-bold">{shopName}</span>
             </p>
             <div className="h-[1px] w-8 bg-card-border" />
             <p className="max-w-[200px] text-[10px] text-text-sub uppercase tracking-widest leading-relaxed opacity-80">
               We look forward to providing your premium wellness experience.
             </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/reservations" 
              className="w-full py-3 bg-transparent border border-accent/30 hover:bg-accent/10 text-accent text-[10px] uppercase tracking-[0.3em] transition-all duration-300 font-bold"
            >
              View My Schedule
            </Link>
            
            <button 
              onClick={onClose}
              className="w-full py-3 text-text-sub hover:text-text-main text-[9px] uppercase tracking-[0.3em] transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}