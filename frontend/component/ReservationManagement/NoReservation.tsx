import Link from "next/link";

export default function NoReservation({
  isAdmin
}:{
  isAdmin: boolean;
}){

  return(
    <main className="min-h-screen bg-[#0f172a] text-white pb-24 px-8 pt-6 flex flex-col">
        <div className="max-w-6xl w-full mx-auto mb-10">
          <Link href="/" className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300">
            <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-16 h-[1px] bg-blue-500/30 mb-8" />
          
          <h2 className="text-xs uppercase tracking-[0.4em] text-gray-400 font-light">
            {isAdmin ? "Registry is Empty" : "Your Archive is Empty"}
          </h2>
          
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-10">
            {isAdmin 
              ? "No users have made any reservations yet" 
              : "No active reservations found in our registry"}
          </p>

          {!isAdmin && (
            <Link href="/shop" className="px-8 py-3 border border-blue-500/30 text-blue-400 text-[10px] uppercase tracking-[0.3em] hover:bg-blue-500/10 transition-all duration-300">
              Browse Our Shops
            </Link>
          )}
        </div>
      </main>
  )
}