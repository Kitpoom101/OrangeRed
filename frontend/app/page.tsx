"use client";
import Link from "next/link";
import Banner from "@/component/ui/Banner";
import FeaturedShop from "@/component/Shop/FeautureShop";
import { useState, useEffect } from "react";
import { ShopItem } from "@/interface";
import ChatBox from "@/component/Chat/ChatBox";

export default function Home() {
  const [allShops, setAllShops] = useState<ShopItem[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops`);
        const { data } = await response.json();
        if (data) setAllShops(data);
      } catch (err) {
        console.error("Failed to fetch shops", err);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-8 space-y-12">
        <Banner />
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-end">
            <Link href={"/shop"} className="group">
              <h1 className="text-[11px] font-serif italic tracking-[0.3em] uppercase text-gray-400 transition-all duration-500 group-hover:text-blue-300">
                Browse All Shops
                <span className="block h-[1px] w-0 bg-blue-300 transition-all duration-500 group-hover:w-full mt-1 opacity-50" />
              </h1>
            </Link>
          </div>

          {/* New Featured Component */}
          <FeaturedShop shops={allShops} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 border-t border-gray-800/50 bg-[#0f172a]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-sm font-serif tracking-widest uppercase text-gray-200">JobPhobia Massage</h3>
            <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">© 2026 Digital Wellness For Job Phobic People</p>
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Contact", "Support"].map((item) => (
              <a key={item} href="#" className="text-[9px] uppercase tracking-[0.3em] text-gray-500 hover:text-blue-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}