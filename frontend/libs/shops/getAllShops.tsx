type GetAllShopsOptions = {
  page?: number;
  limit?: number;
  sort?: string;
  ownerId?: string;
};

export default async function getAllShops(options: GetAllShopsOptions = {}) {
  const params = new URLSearchParams();

  if (options.page) {
    params.set("page", String(options.page));
  }

  if (options.limit) {
    params.set("limit", String(options.limit));
  }

  // Filter by owner if ownerId is provided
  if (options.ownerId) {
    params.set("owner", options.ownerId);
  }

  if (options.sort) {
    params.set("sort", options.sort);
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
