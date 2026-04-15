"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ReservationItem } from "@/interface";
import { useState } from "react";
import ConfirmationModal from "../ui/ConfirmationModal";
import updateReservation from "@/libs/reservation/updateReservation"; 
import EditReservationModal from "./EditReservationModal";

export default function ReservationCard({
  item,
  onDelete,
  index,
}: {
  item: ReservationItem;
  onDelete: (rid: string) => void;
  index: number;
}) {
  const { data: session } = useSession();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const isRoleUser = session?.user?.role === "user";
  const isPastReservation = new Date(item.appDate).getTime() < Date.now();
  const statusLabel = isPastReservation ? "Passed" : "Upcoming";
  const statusClasses = isPastReservation
    ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

  const handleUpdate = async (newDateTime: string) => {
  try {
    if (!session) return;
    
    setIsEditOpen(false); 

    await updateReservation(item._id, newDateTime, session.user.token);
    
    setTimeout(() => {
        window.location.reload();
    }, 300);

  } catch (err) {
    alert("An error occurred while updating the registry.");
  }
};

  return (
    <>
      <div className={`group relative border rounded-[1.5rem] p-8 transition-all duration-500 ${isPastReservation ? "bg-card/10 border-amber-500/15 hover:border-amber-500/30" : "bg-card/20 border-card-border hover:bg-card/30 hover:border-accent/20"}`}>
        
        {/* Background Decorative Index */}
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] select-none pointer-events-none">
          <span className="text-8xl font-serif italic text-accent">{(index + 1).toString().padStart(2, "0")}</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
          
          {/* Main Info Section */}
          <div className={`grid grid-cols-1 ${isRoleUser ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-10`}>
            
            {!isRoleUser && (
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-[0.4em] text-accent/60 font-bold">Client</p>
                <h2 className="text-lg font-serif text-text-main italic tracking-tight">{item.user.name}</h2>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.4em] text-text-sub font-bold">Shop</p>
              <Link 
                href={`/shop/${item.shop._id}`} 
                className="inline-block text-[11px] font-medium text-text-main uppercase tracking-[0.2em] hover:text-accent transition-colors duration-500 border-b border-white/5 hover:border-accent/30 pb-0.5"
              >
                    {item.shop.name}
              </Link>
              <div className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-[8px] font-bold uppercase tracking-[0.35em] ${statusClasses}`}>
                {statusLabel}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.4em] text-accent/60 font-bold">Treatment</p>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-medium text-text-main uppercase tracking-widest leading-none">
                  {item.massageType || "Signature Session"}
                </p>
                <p className="text-[10px] font-mono text-accent opacity-80">
                  {item.massagePrice ? `฿${item.massagePrice}` : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.4em] text-text-sub font-bold">Scheduled Arrival</p>
              <div className="text-[11px] font-medium text-text-main font-mono tracking-tight">
                 <span className="text-accent/80 italic">
                   {new Date(item.appDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                 </span>
                 <span className="mx-2 opacity-20">|</span>
                 <span>
                   {new Date(item.appDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.4em] text-text-sub font-bold">Reference</p>
              <p className="text-[10px] font-mono text-text-sub/60 uppercase">{item._id.slice(-8)}</p>
            </div>
          </div>

          {/* Action Buttons: Vertical Stack */}
          <div className="flex flex-row md:flex-col gap-6 justify-end items-end border-t md:border-t-0 border-white/5 pt-8 md:pt-0">
            {isRoleUser && isPastReservation ? (
              <Link
                href={`/shop/${item.shop._id}#reviews`}
                className="group/btn relative py-1 transition-all"
              >
                <span className="text-[9px] uppercase tracking-[0.4em] text-amber-200 hover:text-amber-100 transition-colors">
                  Comment on Shop
                </span>
                <div className="absolute bottom-0 right-0 w-0 h-px bg-amber-300 group-hover/btn:w-full transition-all duration-500" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="group/btn relative py-1 transition-all"
                >
                  <span className="text-[9px] uppercase tracking-[0.4em] text-text-sub hover:text-accent transition-colors">
                    Reschedule
                  </span>
                  <div className="absolute bottom-0 right-0 w-0 h-px bg-accent group-hover/btn:w-full transition-all duration-500" />
                </button>

                <button
                  onClick={() => setIsCancelOpen(true)}
                  className="group/btn relative py-1 transition-all"
                >
                  <span className="text-[9px] uppercase tracking-[0.4em] text-text-sub/40 group-hover/btn:text-red-400 transition-colors">
                    Cancel
                  </span>
                  <div className="absolute bottom-0 right-0 w-0 h-px bg-red-900 group-hover/btn:w-full transition-all duration-500" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hover Highlight Element */}
        <div className="absolute top-0 left-0 w-1 h-0 bg-accent transition-all duration-500 group-hover:h-full opacity-50" />
      </div>

      {/* MODALS */}
      {!isPastReservation && (
        <>
          <EditReservationModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onConfirm={handleUpdate}
            initialDate={item.appDate}
            shop={item.shop}
          />

          <ConfirmationModal
            isOpen={isCancelOpen}
            onClose={() => setIsCancelOpen(false)}
            onConfirm={() => onDelete(item._id)}
            title="Cancel Reservation"
            message={`Confirming the removal of your appointment at ${item.shop.name}. This action will be recorded in the system archives.`}
            confirmText="Confirm Cancellation"
            isDanger={true}
          />
        </>
      )}
    </>
  );
}
