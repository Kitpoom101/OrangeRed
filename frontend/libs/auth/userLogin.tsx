export default async function userLogin(uesrEmail:string, userPassword:string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: uesrEmail,
      password: userPassword,
    }),
  })

  if(!res.ok){
    throw Error("Failed to login")
  }
  return await res.json();
}
