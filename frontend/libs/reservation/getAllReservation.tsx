type GetAllReservationsOptions = {
  page?: number;
  limit?: number;
};

export default async function getAllReservations(
  token: string,
  options: GetAllReservationsOptions = {}
) {
  const params = new URLSearchParams();

  if (options.page) {
    params.set("page", String(options.page));
  }

  if (options.limit) {
    params.set("limit", String(options.limit));
  }

  const queryString = params.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if(!res.ok){
    throw Error("Failed to fetch data");
  }

  const result = await res.json();
  return result;
}
