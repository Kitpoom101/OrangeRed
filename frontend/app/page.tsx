"use client";
import Link from "next/link";
import Banner from "@/component/ui/Banner";
import FeaturedShop from "@/component/Shop/FeautureShop";
import { useState, useEffect } from "react";
import { ShopItem } from "@/interface";
import Image from "next/image";
import getAllShops from "@/libs/shops/getAllShops";

export default function Home() {
  const [allShops, setAllShops] = useState<ShopItem[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      const data = await getAllShops();
      setAllShops(data);
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
              <h1 className="text-[11px] font-serif italic tracking-[0.3em] uppercase text-text-sub transition-all duration-500 group-hover:text-accent">
                Browse All Shops
                <span className="block h-[1px] w-0 bg-accent transition-all duration-500 group-hover:w-full mt-1 opacity-50" />
              </h1>
            </Link>
          </div>

          <FeaturedShop shops={allShops} />
        </div>
      </main>
    </div>
  );
}
