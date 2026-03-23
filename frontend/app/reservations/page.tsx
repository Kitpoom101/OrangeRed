'use client'
import ReservationCard from "@/component/ReservationManagement/ReservationCard";
import deleteReservation from "@/libs/reservation/deleteReservation";
import getAllReservations from "@/libs/reservation/getAllReservation";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ReservationPage(){
  const {data: session, status} = useSession()
  const [reservations, setReservations] = useState<Reservations | null>(null);

  useEffect(()=>{
    if (!session?.user?.token) return;
    const token = session?.user.token;

    async function fetchReservations() {
      try{
        const data = await getAllReservations(token);
        setReservations(data);
      }catch(err){
        console.log("Cannot fetch data");
      }
    }
    fetchReservations()
  }, [])

  async function handleDelete(rid: string) {
    if (!session) return;

    await deleteReservation({
      token: session.user.token,
      rid: rid
    });

    setReservations(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        data: prev.data.filter(r => r._id !== rid)
      };
    });
  }
  
  return(
    <div>
      {reservations?.data.map((item)=>(
        <ReservationCard key={item._id} item={item} onDelete={handleDelete}/>
      ))}
    </div>
  )
}