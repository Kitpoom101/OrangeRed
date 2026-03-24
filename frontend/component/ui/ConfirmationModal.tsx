"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isDanger?: boolean;
}

export default function ConfirmationModal({
  isOpen, onClose, onConfirm, title, message, confirmText, isDanger = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="max-w-sm w-full bg-[#1e2d3d] border border-gray-700/50 rounded-2xl p-10 shadow-2xl scale-in-95 animate-in duration-300">
        <div className="text-center">
          <h2 className="text-xl font-serif uppercase tracking-[0.2em] text-gray-100 mb-4">{title}</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 leading-loose mb-10">
            {message}
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`w-full py-4 text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-300 ${
                isDanger 
                  ? "bg-red-900/20 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-white" 
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {confirmText}
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-4 bg-transparent text-gray-600 text-[10px] uppercase tracking-[0.4em] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}