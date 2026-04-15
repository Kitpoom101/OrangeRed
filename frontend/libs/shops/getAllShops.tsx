type GetAllShopsOptions = {
  page?: number;
  limit?: number;
};

export default async function getAllShops(options: GetAllShopsOptions = {}) {
  const params = new URLSearchParams();

  if (options.page) {
    params.set("page", String(options.page));
  }

  if (options.limit) {
    params.set("limit", String(options.limit));
  }

  const queryString = params.toString();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
      console.log('Fetch failed with status:', response.status);
      throw new Error("Failed to fetch shops");
  }

  const result = await response.json();
  
  return result; 
}
