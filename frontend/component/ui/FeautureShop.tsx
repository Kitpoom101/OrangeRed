"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopItem } from "@/interface";

const PLACEHOLDER_IMG = "https://i.pinimg.com/1200x/4b/35/23/4b352395a4843dd059b7eb96444433ff.jpg";

export default function FeaturedShop({ shops }: { shops: ShopItem[] }) {
  const [featured, setFeatured] = useState<ShopItem | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Set initial random shop
  useEffect(() => {
    if (shops.length > 0) {
      setFeatured(shops[Math.floor(Math.random() * shops.length)]);
    }
  }, [shops]);

  const handleShuffle = () => {
    if (shops.length < 2) return;
    setIsShuffling(true);

    setTimeout(() => {
      let newShop;
      do {
        newShop = shops[Math.floor(Math.random() * shops.length)];
      } while (featured && newShop._id === featured._id);
      
      setFeatured(newShop);
      setIsShuffling(false);
    }, 400);
  };

  if (!featured) return null;

  // Image validation check
  const isValidUrl = featured.picture && featured.picture.startsWith("http");
  const displayImage = isValidUrl ? featured.picture : PLACEHOLDER_IMG;

  return (
    <div className={`relative group overflow-hidden rounded-2xl border border-white/5 bg-[#1e2d3d]/20 transition-all duration-500 
      ${isShuffling ? "opacity-40 scale-[0.98] blur-sm" : "opacity-100 scale-100 blur-0"} hover:border-blue-500/30`}>
      
      {/* Shuffle Button */}
      <button
        onClick={handleShuffle}
        className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-blue-500/20 border border-white/10 rounded-full transition-all duration-300 group/shuff"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
          className="w-4 h-4 text-gray-400 group-hover/shuff:rotate-180 transition-transform duration-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>

      <Link href={`/shop/${featured._id}`} className="flex flex-col md:flex-row items-center gap-8 p-6">
        <div className="relative w-full md:w-72 h-40 overflow-hidden rounded-xl bg-gray-900">
          <Image
            src={displayImage}
            alt={featured.name}
            fill
            className="object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-[10px] uppercase tracking-[0.4em] text-blue-400 font-bold">Featured Destination</p>
          <h2 className="text-2xl font-serif tracking-tight text-gray-100">{featured.name}</h2>
          <p className="text-xs text-gray-400 font-light tracking-wide line-clamp-2 max-w-md">
            Located at {featured.address.street}, {featured.address.district}.
            <span className="block mt-1 text-blue-400/60 font-mono">Open: {featured.openClose.open} — {featured.openClose.close}</span>
          </p>
          <div className="pt-2 flex items-center gap-2 text-[10px] text-blue-300 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500">
            Explore Session →
          </div>
        </div>
      </Link>
    </div>
  );
}