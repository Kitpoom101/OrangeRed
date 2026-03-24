export default async function getAllReservations(token:string){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok){
    throw Error("Failed to fetch data");
  }

  const result = await res.json();
  return result;
}