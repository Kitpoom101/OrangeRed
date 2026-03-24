export default async function getAllShops() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops`, {
    method: "GET",
    cache: "no-store",
  })

  if (!response.ok) {
      console.log('Fetch failed with status:', response.status);
      throw new Error("Failed to fetch shops");
  }

  const result = await response.json();
  
  return result; 
}