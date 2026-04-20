import ShopPanel from "@/component/Shop/ShopManagement/ShopPanel";
import Link from "next/link";
import getAllShops from "@/libs/shops/getAllShops";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth/authOption";

const SHOPS_PER_PAGE = 6;

export default async function shop({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parsedPage = Number(resolvedSearchParams?.page ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  
  const session = await getServerSession(authOptions);
  const fetchOptions: { page: number; limit: number; ownerId?: string ; sort: string } = {
    page: currentPage,
    limit: SHOPS_PER_PAGE,
    sort: "-averageRating,_id"
  };
  
  // If user is a shopowner, only show their shops
  if (session?.user?.role === "shopowner" && session?.user?._id) {
    fetchOptions.ownerId = session.user._id;
  }
  
  const shops = await getAllShops(fetchOptions);

  return (
    <main className="min-h-screen bg-background text-text-main pb-24 px-8 pt-6 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          href="/"
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
        
        <div className="h-[1px] w-16 bg-accent/30 mx-auto mt-8" />
      </div>

      <div className="max-w-5xl mx-auto">
        <ShopPanel shopJson={shops} currentPage={currentPage} />
      </div>
      
    </main>
  );
}
