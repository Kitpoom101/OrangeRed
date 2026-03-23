import Link from "next/link";
import Banner from "@/component/ui/Banner";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <Banner></Banner>
      <div className="flex justify-end max-w-7xl mx-auto">
        <Link href={'/shop'} className="group">
          <h1 className="text-[11px] font-serif italic tracking-[0.3em] uppercase text-gray-400 transition-all duration-500 group-hover:text-blue-300">
            Browse Our Shops
            <span className="block h-[1px] w-0 bg-blue-300 transition-all duration-500 group-hover:w-full mt-1 opacity-50" />
          </h1>
        </Link>
      </div>
    </main>
  );
}