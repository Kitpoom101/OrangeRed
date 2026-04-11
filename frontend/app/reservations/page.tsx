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
    await deleteReservation({ token: session.user.token, rid: rid });
    setReservations((prev) =>
      prev ? { ...prev, data: prev.data.filter((r) => r._id !== rid) } : null,
    );
  }


  if (!session) {
    return (
      <ReservationNoSession/>
    );
  }

  if (loading)
    return (
      <ReservationLoading/>
    );

  if (!reservations || reservations.data.length === 0) {
    return (
      <NoReservation isAdmin={isAdmin}/>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 px-8 pt-6">
      <div className="max-w-6xl mx-auto mb-10">
        <Link href="/" className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
          <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-3xl font-serif tracking-[0.1em] uppercase text-gray-100">
            {isAdmin ? "User Reservations" : "Your Reservations"}
          </h1>
          <div className="h-[1px] w-12 bg-blue-500/50 mt-4" />
        </div>

        <div className="space-y-4">
          {reservations.data.map((item, index) => (
            <ReservationCard 
              key={item._id} 
              item={item} 
              index={index} 
              onDelete={handleDelete} 
            />
          ))}
        </div>

        <div className="pt-20 flex justify-center italic text-gray-600 text-[10px] tracking-[0.5em] uppercase">
          — {isAdmin ? "End of Global Registry" : "End of Registry"} —
        </div>
      </div>
    </div>
  );
}