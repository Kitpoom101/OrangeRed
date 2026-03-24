export default async function deleteShop(id:string, token:string){
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    }
  })

  if (!response.ok) {
      console.log('Fetch failed with status:', response.status);
      throw new Error("Failed to delete shops");
  }

  const result = await response.json();
  
  return result; 
}