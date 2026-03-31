"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import getRatingsByShop from "@/libs/ratings/getRatingsByShop";
import AvgRatingBadge from "@/component/Rating/AvgRatingBadge";

export default function Card({
  shopId,
  shopName,
  imgSrc,
  address,
  openClose,
}: {
  shopId: string;
  shopName: string;
  imgSrc: string;
  address: {
    street: string;
    district: string;
    province: string;
    postalcode: string;
  };
  openClose: {
    open: string;
    close: string;
  };
}) {
  const [ratings, setRatings] = useState([]);

  // Fetch real ratings for the card
  useEffect(() => {
    const fetchRatings = async () => {
      if (!shopId) return;
      try {
        // Note: If your GET route is public, you can pass an empty string for the token. 
        // If it strictly requires a token, you'll need to pass the token as a prop to this Card too.
        const res = await getRatingsByShop(shopId, ""); 
        setRatings(res.data || []);
      } catch (error) {
        console.error("Failed to fetch ratings for card", error);
      }
    };
    fetchRatings();
  }, [shopId]);

  return (
    <div className="group relative w-full bg-[#1e2d3d] rounded-xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-blue-500/50">
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={imgSrc}
          alt={shopName}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      </div>

      <div className="p-6 text-center">
        <h3 className="text-lg font-serif tracking-widest uppercase text-gray-100 mb-1">
          {shopName}
        </h3>

        {/* ── Rating Badge ── */}
        <div className="flex justify-center mb-4">
          <AvgRatingBadge ratings={ratings} />
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 text-[11px] font-mono tracking-tighter text-gray-300 uppercase">
          <span>OPEN: {openClose.open}</span>
          <span>CLOSE: {openClose.close}</span>
          <div className="text-gray-400 mt-2">ADDRESS: {address.street}, {address.district}</div>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-blue-400 group-hover:text-blue-300 transition-colors cursor-pointer">
          — View Detail —
        </p>
      </div>
    </div>
  );
}