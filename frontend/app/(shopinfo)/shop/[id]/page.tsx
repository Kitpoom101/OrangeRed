import getSingleShops from "@/libs/shops/getSingleShop";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_IMG =
  "https://i.pinimg.com/1200x/4b/35/23/4b352395a4843dd059b7eb96444433ff.jpg";

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopDetail = await getSingleShops(id);
  const shop: ShopItem = shopDetail.data;

  const isValidUrl =
    shop.picture && shop.picture.includes("//") && shop.picture.includes(".");
  const displayImage = isValidUrl ? shop.picture : PLACEHOLDER_IMG;

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
        <div className="max-w-4xl w-full bg-[#1e2d3d] rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
              <Image
                src={displayImage}
                alt={shop.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2d3d] via-transparent to-transparent opacity-60 md:hidden" />
            </div>

            <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl font-serif tracking-[0.2em] uppercase text-gray-100 mb-6">
                {shop.name}
              </h1>

              <div className="space-y-4 font-mono text-sm tracking-tighter text-gray-300 uppercase">
                <div className="flex items-center gap-4 border-b border-gray-700/50 pb-2">
                  <span className="text-blue-400 font-bold w-16">TIME</span>
                  <span>
                    OPEN: {shop.openClose.open} — CLOSE: {shop.openClose.close}
                  </span>
                </div>

                <div className="flex items-start gap-4 border-b border-gray-700/50 pb-2">
                  <span className="text-blue-400 font-bold w-16">ADDR</span>
                  <span className="leading-relaxed">
                    {shop.address.street}, {shop.address.district}, <br />
                    {shop.address.province} {shop.address.postalcode}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-blue-400 font-bold w-16">TEL</span>
                  <span className="tracking-[0.1em]">{shop.tel}</span>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-blue-500/20">
                <p className="text-[11px] uppercase tracking-[0.4em] text-blue-400 mb-4">
                  — Make a Reservation —
                </p>

                <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-gray-700 text-gray-500 text-center text-xs italic">
                  date picker
                </div>
              </div>
            </div>
          </div>
        </div>
        <form action="submit">
          
        </form>
      </div>
    </div>
  );
}
