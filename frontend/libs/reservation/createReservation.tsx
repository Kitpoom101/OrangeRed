export default async function createReservations(
  token:string, 
  name:string, 
  time:string, 
  sid:string, 
  massageType: string, 
  massagePrice: Number){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops/${sid}/reservations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      appDate: time,
      user: name,
      massageType: massageType,
            massagePrice: massagePrice
    })
  })

  if(!res.ok){
    throw Error("Failed to fetch data");
  }

  const result = await res.json();
  return result;
}