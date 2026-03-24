export default async function deleteReservation({token, rid}: DeleteProps) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/${rid}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok){
    throw Error("Failed to login")
  }
  return await res.json();
}

interface DeleteProps{
  token: string
  rid: string
}
