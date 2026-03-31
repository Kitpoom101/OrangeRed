import ShopPanel from "@/component/Shop/ShopManagement/ShopPanel";
import Link from "next/link";
import getAllShops from "@/libs/shops/getAllShops";

export default function shop() {
  const shops = getAllShops();

  return (
    <main className="min-h-screen text-white pb-24 px-8 pt-6">
      
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          href="/"
          className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300"
        >
          <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4">
          Browse Our Shops
        </h1>
        <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
          Select your preferred shop for a premium experience
        </p>
        <div className="h-[1px] w-16 bg-blue-900/50 mx-auto mt-8" />
      </div>

      <div className="max-w-5xl mx-auto">
        <ShopPanel shopJson={shops}/>
      </div>
      
    </main>
  );
}