import Link from "next/link";
import ShopCard from "./ShopCard";
import { ShopJson } from "@/interface";

export default async function ShopPanel({
  shopJson,
}: {
  shopJson: Promise<ShopJson>;
}) {
  const shopJsonReady = await shopJson;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {shopJsonReady.data.map((shopItem) => (
          <div key={shopItem._id} className="w-full">
            <Link href={`/shop/${shopItem._id}`} className="block group">
              <ShopCard
                shopName={shopItem.name}
                imgSrc={
                  shopItem.picture
                    ? shopItem.picture
                    : "https://i.pinimg.com/1200x/4b/35/23/4b352395a4843dd059b7eb96444433ff.jpg"
                }
                address={shopItem.address}
                openClose={shopItem.openClose}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
