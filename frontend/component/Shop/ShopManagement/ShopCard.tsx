import Image from "next/image";
import AvgRatingBadge from "@/component/Rating/AvgRatingBadge";

export default function Card({
  shopName,
  imgSrc,
  address,
  openClose,
  avgRating = 0,
  ratingCount = 0,
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
  avgRating?: number;
  ratingCount?: number;
}) {

  return (
    // เปลี่ยน hover:border-blue-500/50 เป็น hover:border-accent/50
    <div className="group relative w-full bg-card rounded-xl overflow-hidden border border-card-border transition-all duration-300 hover:border-accent/50 shadow-sm">
      
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
        <h3 className="text-lg font-serif tracking-widest uppercase text-text-main mb-1">
          {shopName}
        </h3>

        {/* ── Rating Badge ── */}
        <div className="flex justify-center mb-4">
          {/* ส่งผ่านสี accent เข้าไปใน Badge (ถ้า Component นั้นรับ props สีนะครับ) */}
          <AvgRatingBadge avgRating={avgRating} ratingCount={ratingCount} />
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 text-[11px] font-mono tracking-tighter text-text-sub uppercase">
          <span>OPEN: {openClose.open}</span>
          <span>CLOSE: {openClose.close}</span>
          <div className="text-text-sub opacity-70 mt-2 w-full text-center">
            {address.street}, {address.district}
          </div>
        </div>

        {/* ── View Detail ── */}
        {/* เปลี่ยนจาก text-blue-400 เป็น text-accent */}
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-accent font-bold group-hover:opacity-80 transition-all cursor-pointer">
          — View Detail —
        </p>
      </div>
    </div>
  );
}