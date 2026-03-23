export default async function getSingleShops(id:string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/shops/${id}`, {
    method: "GET",
  })

    if (!response.ok) {
        console.log('Fetch failed with status:', response.status);
        throw new Error("Failed to fetch shops");
    }

    const result = await response.json();
    
    return result; 
}