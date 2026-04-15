import Image from "next/image"
import ReservationForm from "../FormComponent/ReservationForm";
import Link from "next/link";
import { Session } from "next-auth";
import { ShopItem } from "@/interface";
import AvgRatingBadge from "../Rating/AvgRatingBadge";

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
  const isValidUrl = shop.picture && shop.picture.includes("//") && shop.picture.includes(".");
  const displayImage = isValidUrl ? shop.picture : PLACEHOLDER_IMG;
  const isLimitReached = session?.user.role === "user" && reservationCount >= 3;
  const slotLabel = reservationCount === 1 ? "Slot" : "Slots";

  return (
    <div className="flex flex-col md:flex-row bg-background transition-colors duration-300">
      <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
        <Image
          src={displayImage}
          alt={shop.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 md:hidden" />
      </div>

      <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center">
        <h1 className="text-3xl font-serif tracking-[0.2em] uppercase text-text-main mb-2">
          {shop.name}
        </h1>
        <div className="mb-6">
          <AvgRatingBadge avgRating={shop.averageRating ?? 0} ratingCount={shop.ratingCount ?? 0} />
        </div>

        <div className="space-y-4 font-mono text-sm tracking-tighter text-text-sub uppercase">
          <div className="flex items-center gap-4 border-b border-card-border pb-2">
            <span className="text-accent dark:text-accent font-bold w-16">TIME</span>
            <span className="text-text-main">OPEN: {shop.openClose.open} — CLOSE: {shop.openClose.close}</span>
          </div>
          <div className="flex items-start gap-4 border-b border-card-border pb-2">
            <span className="text-accent dark:text-accent font-bold w-16">ADDR</span>
            <span className="leading-relaxed text-text-main">
              {shop.address.street}, {shop.address.district}, <br /> 
              {shop.address.province} {shop.address.postalcode}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-accent dark:text-accent font-bold w-16">TEL</span>
            <span className="tracking-[0.1em] text-text-main">{shop.tel}</span>
          </div>
        </div>

        {/* ── ส่วน Reservation Section ── */}
        <div className="mt-10 pt-6 border-t border-card-border">
          {!session ? (
            <div className="bg-card p-6 rounded-xl border border-card-border text-center shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-text-sub mb-6">
                Authentication Required
              </p>
              <Link 
                href="/api/auth/signin"
                className="inline-block w-full py-3 bg-transparent border border-accent text-accent dark:text-accent text-[10px] uppercase tracking-[0.4em] hover:bg-accent/5  transition-all rounded-lg"
              >
                Sign In
              </Link>
            </div>
          ) : isLimitReached ? (
            <div className="group relative overflow-hidden bg-red-500/5 border border-red-500/20 rounded-xl p-8 transition-all duration-500">
               <span className="absolute -right-4 -bottom-2 text-6xl font-bold text-red-500/5 select-none pointer-events-none uppercase italic">Limit</span>
               <div className="relative z-10 text-center">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-red-500 font-bold mb-3">Maximum Quota Reached</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub leading-relaxed mb-6 max-w-[200px] mx-auto">
                    Member sessions are capped at 3 active reservations. Passed visits move to your archive automatically.
                  </p>
                  <Link href="/reservations" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-red-400/80 hover:text-red-500 transition-colors">
                    Manage Appointments <span className="text-xs">→</span>
                  </Link>
               </div>
            </div>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-[0.4em] text-accent dark:text-accent mb-4 font-bold">
                — Make a Reservation —
              </p>
              <ReservationForm shop={shop} />
              <div className="mt-4 flex justify-between items-center px-2">
                <span className="text-[8px] text-text-sub uppercase tracking-widest">Active Reservation Count</span>
                <span className="text-[8px] text-accent/50 dark:text-accent/50 uppercase tracking-widest font-mono">{reservationCount}/3 {slotLabel}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
