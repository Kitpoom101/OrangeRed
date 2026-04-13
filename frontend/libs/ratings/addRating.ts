interface AddRatingParams {
  reservationId?: string;
  shopId?: string;
  score: number;
  review: string;
  token: string;
}

export default async function addRating({
  reservationId,
  shopId,
  score,
  review,
  token,
}: AddRatingParams) {
  const endpoint = reservationId
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/${reservationId}/ratings`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops/${shopId}/rating`;

  const res = await fetch(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score, review, shop: shopId }),
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to add rating");
  }

  return res.json();
}
