import Link from "next/link";
import ShopCard from "./ShopCard";
import { ShopJson } from "@/interface";
import PaginationLinkNav from "@/component/ui/PaginationLinkNav";

export default async function ShopPanel({
  shopJson,
  currentPage,
}: {
  shopJson: ShopJson;
  currentPage: number;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {shopJson.data.map((shopItem) => (
          <div key={shopItem._id} className="w-full">
            <Link href={`/shop/${shopItem._id}`} className="block group">
              <ShopCard
                shopId={shopItem._id}
                shopName={shopItem.name}
                imgSrc={
                  shopItem.picture
                    ? shopItem.picture
                    : "https://i.pinimg.com/1200x/4b/35/23/4b352395a4843dd059b7eb96444433ff.jpg"
                }
                address={shopItem.address}
                openClose={shopItem.openClose}
                avgRating={shopItem.averageRating ?? 0}
                ratingCount={shopItem.ratingCount ?? 0}
              />
            </Link>
          </div>
        ))}
      </div>
      <PaginationLinkNav
        currentPage={currentPage}
        totalPages={shopJson.pagination.totalPages}
      />
    </div>
  );
}
