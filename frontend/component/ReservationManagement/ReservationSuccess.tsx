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
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-[#1e2d3d] border border-gray-700/50 w-full max-w-md overflow-hidden rounded-xl shadow-2xl transform transition-all">
        
        <div className="h-1 w-full bg-blue-500/50" />

        <div className="p-10 text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <span className="text-blue-400 text-[10px] tracking-[0.5em] uppercase">— Success —</span>
          </div>

          <h2 className="text-xl font-serif uppercase tracking-[0.2em] text-gray-100 mb-2">
            Reservation Secured
          </h2>
          
          <div className="flex flex-col items-center gap-2 mb-10">
             <p className="text-[11px] font-mono tracking-tighter text-gray-400 uppercase">
               Venue: <span className="text-gray-200">{shopName}</span>
             </p>
             <div className="h-[1px] w-8 bg-gray-700" />
             <p className="max-w-[200px] text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
               We look forward to providing your premium wellness experience.
             </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/reservations" 
              className="w-full py-3 bg-transparent border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-[0.3em] transition-all duration-300"
            >
              View My Schedule
            </Link>
            
            <button 
              onClick={onClose}
              className="w-full py-3 text-gray-500 hover:text-gray-300 text-[9px] uppercase tracking-[0.3em] transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}