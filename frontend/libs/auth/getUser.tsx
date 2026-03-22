export default async function getUser(token:string) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if(!res.ok){
    throw Error("Failed to login")
  }
  return await res.json();
}