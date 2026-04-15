
"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  // ป้องกัน Hydration Error ของ Next.js
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
      {/* Background Overlay - ตัวนี้จะทำหน้าที่เบลอทั้งหน้าจอ */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="relative max-w-[360px] w-full bg-card border border-white/5 rounded-[2rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <h2 className="text-lg font-serif uppercase tracking-[0.3em] text-text-main mb-4">{title}</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub leading-loose mb-10 opacity-70">
            {message}
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onConfirm(), 150);
              }}
              className={`w-full py-4 text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-500 ${
                isDanger ? "bg-red-600 text-white" : "bg-accent text-white"
              }`}
            >
              {confirmText}
            </button>
            <button onClick={onClose} className="text-[9px] uppercase tracking-[0.3em] text-text-sub/40 hover:text-text-main transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body 
  );
}