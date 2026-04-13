"use client";
import ReservationCard from "@/component/ReservationManagement/ReservationCard";
import deleteReservation from "@/libs/reservation/deleteReservation";
import getAllReservations from "@/libs/reservation/getAllReservation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reservations } from "@/interface";
import NoReservation from "@/component/ReservationManagement/NoReservation";
import ReservationLoading from "@/component/ReservationManagement/ReservationLoading";
import ReservationNoSession from "@/component/ReservationManagement/ReservationNoSession";

export default function ReservationPage() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (!session?.user?.token) return;

    async function fetchReservations() {
      try {
        const data = await getAllReservations(session!.user.token);
        setReservations(data);
      } catch (err) {
        console.error("Cannot fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchReservations();
  }, [session]);

async function handleDelete(rid: string) {
  if (!session) return;
  
  try {
    await deleteReservation({ token: session.user.token, rid: rid });

    setTimeout(() => {
      setReservations((prev) =>
        prev ? { ...prev, data: prev.data.filter((r) => r._id !== rid) } : null,
      );
    }, 400); 

  } catch (err) {
    console.error("Delete failed");
  }
}

  if (!session) {
    return <ReservationNoSession />;
  }

  if (loading) return <ReservationLoading />;

  if (!reservations || reservations.data.length === 0) {
    return <NoReservation isAdmin={isAdmin} />;
  }

  return (
    <div className="min-h-screen bg-background text-text-main pb-32 px-8 pt-8 selection:bg-accent/30">
      
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <Link 
          href="/" 
          className="group inline-flex items-center text-[10px] uppercase tracking-[0.3em] text-text-sub hover:text-accent transition-all duration-500"
        >
          <span className="mr-3 transition-transform duration-500 group-hover:-translate-x-2 text-accent">
            <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.646447 3.64645C0.451184 3.84171 0.451184 4.15829 0.646447 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646447 3.64645ZM18 3.5L1 3.5V4.5L18 4.5V3.5Z" fill="currentColor"/>
            </svg>
          </span>
          <span>Return to Sanctuary</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Page Title Section */}
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold mb-3">
            ✦ {isAdmin ? "Management Console" : "Private Collection"}
          </p>
          <h1 className="text-4xl font-serif tracking-tight text-text-main">
            {isAdmin ? "Global Registry" : "Your Reservations"}
          </h1>
          <div className="h-[1px] w-20 bg-gradient-to-r from-accent/60 to-transparent mt-6" />
        </div>

        {/* Reservations List */}
        <div className="grid grid-cols-1 gap-6">
          {reservations.data.map((item, index) => (
            <div key={item._id} className="transition-all duration-500 hover:translate-y-[-2px]">
              <ReservationCard 
                item={item} 
                index={index} 
                onDelete={handleDelete} 
              />
            </div>
          ))}
        </div>

        {/* Footer Signature */}
        <div className="pt-32 flex flex-col items-center gap-4 opacity-40">
          <div className="h-px w-12 bg-card-border" />
          <div className="italic text-text-sub text-[9px] tracking-[0.6em] uppercase">
            — {isAdmin ? "End of Global Registry" : "End of Private Registry"} —
          </div>
        </div>
      </div>
    </div>
  );
}