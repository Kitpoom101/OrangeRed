export interface MassageType {
  name: string;
  description?: string;
  price: number;
  picture?: string;
}

export default async function createShop(
  token: string,
  name: string,
  address: {
    street: string;
    district: string;
    province: string;
    postalcode: string;
  },
  tel: string,
  openClose: {
    open: string;
    close: string;
  },
  massageType: MassageType[],
  picture?: string,
  shopDescription?: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address,
        tel,
        openClose,
        massageType,
        ...(picture && { picture }),
        ...(shopDescription && { shopDescription }),
      }),
    }
  );

  if (!response.ok) {
    console.log("Fetch failed with status:", response.status);
    throw new Error("Failed to create shop");
  }

  const result = await response.json();
  return result;
}