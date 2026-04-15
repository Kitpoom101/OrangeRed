export default async function editAdminUser(token:string, uid:string, payload:Record<string, string | null>){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/${uid}`,{
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Failed to update user");
  }

  return data;
}