"use client";
import Image from "next/image"
import { useEffect, useState } from "react";
import ReservationForm from "../FormComponent/ReservationForm";
import Link from "next/link";
import { Session } from "next-auth";
import { ShopItem } from "@/interface";
import AvgRatingBadge from "../Rating/AvgRatingBadge";
import getRatingsByShop from "@/libs/ratings/getRatingsByShop";

const PLACEHOLDER_IMG = "https://i.pinimg.com/1200x/4b/35/23/4b352395a4843dd059b7eb96444433ff.jpg";

export default function ShopUI({ 
  shop, 
  session, 
  reservationCount = 0 
}: { 
  shop: ShopItem, 
  session: Session | null,
  reservationCount?: number 
}) {
  const [ratings, setRatings] = useState([]);

  const isValidUrl = shop.picture && shop.picture.includes("//") && shop.picture.includes(".");
  const displayImage = isValidUrl ? shop.picture : PLACEHOLDER_IMG;
  const isLimitReached = session?.user.role === "user" && reservationCount >= 3;

  // Fetch real ratings for the badge
  useEffect(() => {
    const fetchRatings = async () => {
      if (!shop.id) return;
      try {
        const token = session?.user?.token || "";
        const res = await getRatingsByShop(shop.id, token);
        // Assuming your backend returns data in a "data" property
        setRatings(res.data || []);
      } catch (error) {
        console.error("Failed to fetch ratings for badge", error);
      }
    };
    fetchRatings();
  }, [shop.id, session]);

  return (
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
        <h1 className="text-3xl font-serif tracking-[0.2em] uppercase text-gray-100 mb-2">
          {shop.name}
        </h1>
        <div className="mb-6">
          <AvgRatingBadge ratings={ratings} />
        </div>

        <div className="space-y-4 font-mono text-sm tracking-tighter text-gray-300 uppercase">
          <div className="flex items-center gap-4 border-b border-gray-700/50 pb-2">
            <span className="text-blue-400 font-bold w-16">TIME</span>
            <span>OPEN: {shop.openClose.open} — CLOSE: {shop.openClose.close}</span>
          </div>
          <div className="flex items-start gap-4 border-b border-gray-700/50 pb-2">
            <span className="text-blue-400 font-bold w-16">ADDR</span>
            <span className="leading-relaxed">{shop.address.street}, {shop.address.district}, <br /> {shop.address.province} {shop.address.postalcode}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blue-400 font-bold w-16">TEL</span>
            <span className="tracking-[0.1em]">{shop.tel}</span>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-500/20">
          {!session ? (
            <div className="bg-[#0f172a]/50 p-6 rounded-xl border border-gray-800 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-6">
                Authentication Required
              </p>
              <Link 
                href="/auth/signin"
                className="inline-block w-full py-3 bg-transparent border border-blue-500/30 text-blue-400 text-[10px] uppercase tracking-[0.4em] hover:bg-blue-500/10 transition-all rounded-lg"
              >
                Sign In
              </Link>
            </div>
          ) : isLimitReached ? (
            <div className="group relative overflow-hidden bg-red-950/10 border border-red-500/20 rounded-xl p-8 transition-all duration-500 hover:border-red-500/40">
               <span className="absolute -right-4 -bottom-2 text-6xl font-bold text-red-500/5 select-none pointer-events-none uppercase italic">
                Limit
               </span>
               
               <div className="relative z-10 text-center">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-red-500 font-bold mb-3">
                    Maximum Quota Reached
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 leading-relaxed mb-6 max-w-[200px] mx-auto">
                    Member sessions are capped at 3 active reservations.
                  </p>
                  <Link 
                    href="/reservations" 
                    className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-red-400/80 hover:text-red-400 transition-colors"
                  >
                    Manage Appointments <span className="text-xs">→</span>
                  </Link>
               </div>
            </div>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-[0.4em] text-blue-400 mb-4">
                — Make a Reservation —
              </p>
              <ReservationForm shop={shop} />
              <div className="mt-4 flex justify-between items-center px-2">
                <span className="text-[8px] text-gray-600 uppercase tracking-widest">Membership Status: Active</span>
                <span className="text-[8px] text-blue-400/50 uppercase tracking-widest font-mono">{reservationCount}/3 Slots</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}