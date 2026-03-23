import deleteReservation from "@/libs/reservation/deleteReservation"
import { useSession } from "next-auth/react"

export default function ReservationCard({item, onDelete}:{
  item:ReservationItem, 
  onDelete:(rid:string)=>void
}){
  const {data: session} = useSession();

  return(
    <div>
      {item.appDate}
      <p>{item.user.name}</p>
      <button className="bg-red-500 cursor-pointer" onClick={() => onDelete(item._id)}>delete</button>
    </div>
  )
}