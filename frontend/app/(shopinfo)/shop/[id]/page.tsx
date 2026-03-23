import ShopUI from "@/component/ui/ShopUI";
import MassageServiceList from "@/component/ui/MassageServiceList";
import getSingleShops from "@/libs/shops/getSingleShop";
import Link from "next/link";
import { getServerSession } from "next-auth";
import DeleteButton from "@/component/ui/DeleteButton";
import { authOptions } from "@/libs/auth/authOption";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopDetail = await getSingleShops(id);
  const shop: ShopItem = shopDetail.data;

  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen text-white pb-24 px-8 pt-6">
      <Link
        href="/shop"
        className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300"
      >
        <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        <span>Browse More Shops</span>
      </Link>

      <div className="min-h-screen flex flex-col items-center py-16 px-4">
        <div className="max-w-5xl w-full bg-[#1e2d3d] rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
          <ShopUI shop={shop}/>
        </div>

        <div className="max-w-5xl w-full mt-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-gray-100">
              Service Menu
            </h2>
            <div className="h-[1px] w-12 bg-blue-500/50 mx-auto mt-4" />
          </div>
          <MassageServiceList services={shop.massageType} />
        </div>
      </div>
      {session?.user.role==="admin" && <DeleteButton shopId={shop._id}/>}
    </div>
  );
}
