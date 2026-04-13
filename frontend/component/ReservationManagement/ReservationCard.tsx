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

  const handleUpdate = async (newDateTime: string) => {
    try {
      if (!session) return;
      await updateReservation(item._id, newDateTime, session.user.token);
      setIsEditOpen(false);
      // Using reload to keep it simple, or you could pass a refresh function from parent
      window.location.reload(); 
    } catch (err) {
      alert("Could not update reservation.");
    }
  };

  return (
    <>
      <div className="group relative grid grid-cols-1 cursor-default md:grid-cols-[60px_1fr_auto] items-center gap-y-6 p-8 bg-[#1e2d3d]/40 border border-gray-700/30 rounded-xl hover:border-blue-500/30 transition-all duration-500">
        
        {/* Index Number */}
        <div className="hidden md:flex justify-start">
          <span className="text-[10px] font-mono text-blue-500/30 tracking-tighter">
            {(index + 1).toString().padStart(2, "0")}
          </span>
        </div>

        {/* Info Grid */}
        <div className={`flex-1 grid grid-cols-1 ${isRoleUser ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-8`}>
          {!isRoleUser && (
            <div className="space-y-1">
              <p className="text-[8px] uppercase tracking-[0.3em] text-blue-400 font-semibold">User</p>
              <h2 className="text-lg font-serif text-text-main tracking-tight">{item.user.name}</h2>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Shop Venue</p>
            <Link 
              href={`/shop/${item.shop._id}`} 
              className="inline-block text-[11px] font-medium text-gray-300 uppercase tracking-widest hover:text-blue-400 transition-colors duration-300 border-b border-transparent hover:border-blue-400/30"
            >
              {item.shop.name}
            </Link>
          </div>

          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-[0.2em] text-blue-400/80 font-bold">Treatment & Fee</p>
            <div className="flex flex-col">
              <p className="text-[11px] font-medium text-text-main uppercase tracking-wider">
                {item.massageType || "Standard Massage"}
              </p>
              <p className="text-[10px] font-mono text-blue-400 mt-0.5">
                {item.massagePrice ? `$${item.massagePrice}` : "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Appointment Date</p>
            <p className="text-[11px] font-medium text-gray-300 font-mono">
               {new Date(item.appDate).toLocaleDateString('en-GB', { 
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit' 
               })}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Contact</p>
            <p className="text-[11px] font-medium text-gray-300">{item.shop.tel}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row md:flex-col gap-6 items-end justify-end border-t md:border-t-0 border-gray-700/50 pt-6 md:pt-0">
          <button
            onClick={() => setIsEditOpen(true)}
            className="group/btn relative py-1 transition-all cursor-pointer"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-text-sub hover:text-blue-400 transition-colors duration-150">
              Reschedule
            </span>
            <div className="absolute bottom-0 right-0 w-0 h-[1px] bg-blue-500/50 group-hover/btn:w-full transition-all duration-300" />
          </button>

          <button
            onClick={() => setIsCancelOpen(true)}
            className="group/btn relative py-1 transition-all cursor-pointer"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 group-hover/btn:text-red-500 transition-colors duration-300">
              Cancel Order
            </span>
            <div className="absolute bottom-0 right-0 w-0 h-[1px] bg-red-900 group-hover/btn:w-full transition-all duration-500" />
          </button>
        </div>
      </div>

      {/* MODALS */}
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
        message={`Are you sure you want to cancel your ${item.massageType || 'session'} at ${item.shop.name}?`}
        confirmText="Confirm Cancellation"
        isDanger={true}
      />
    </>
  );
}