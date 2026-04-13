import ShopPanel from "@/component/Shop/ShopManagement/ShopPanel";
import Link from "next/link";
import getAllShops from "@/libs/shops/getAllShops";

export default function shop() {
  const shops = getAllShops();

  return (
    // 1. เปลี่ยน text-white เป็น text-text-main และเพิ่ม bg-background
    <main className="min-h-screen bg-background text-text-main pb-24 px-8 pt-6 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          href="/"
          // 2. เปลี่ยน hover:text-white เป็น hover:text-accent
          className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-text-sub hover:text-accent transition-all duration-300"
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
        <p className="text-text-sub uppercase tracking-[0.2em] text-[10px]">
          Select your preferred shop for a premium experience
        </p>
        
        {/* 3. เปลี่ยนสีเส้นคั่นกลาง จาก bg-blue-900/50 เป็น bg-accent/30 */}
        <div className="h-[1px] w-16 bg-accent/30 mx-auto mt-8" />
      </div>

      <div className="max-w-5xl mx-auto">
        <ShopPanel shopJson={shops}/>
      </div>
      
    </main>
  );
}