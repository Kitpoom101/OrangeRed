export default async function updateReservation(
  rid: string,
  appDate: string,
  token: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/${rid}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appDate }),
    }
  );

  if (!response.ok) throw new Error("Failed to update reservation");
  return response.json();
}