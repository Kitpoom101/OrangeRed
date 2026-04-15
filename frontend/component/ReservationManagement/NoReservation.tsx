import Link from "next/link";

export default function NoReservation({
  isAdmin
}:{
  isAdmin: boolean;
}){

  return(
    <main className="min-h-[80vh] bg-background text-text-main flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="text-[20rem] font-serif italic">Empty</div>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
          {/* Symbol */}
          <div className="mb-10 relative">
            <div className="text-2xl text-gold opacity-40 animate-pulse">✦</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-gold/10 rounded-full scale-150" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-[11px] uppercase tracking-[0.6em] text-gold font-bold">
              {isAdmin ? "Registry is Empty" : "Archive Vacant"}
            </h2>
            
            <div className="h-px w-8 bg-gold/20 mx-auto" />

            <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub leading-loose opacity-70">
              {isAdmin 
                ? "The sanctuary awaits its first guests. No entry has been recorded in our scrolls yet." 
                : "Your journey has yet to begin. No active reservations were found in our celestial registry."}
            </p>
          </div>

          <div className="mt-16 flex flex-col items-center gap-6">
            {!isAdmin && (
              <Link 
                href="/shop" 
                className="group relative px-10 py-4 overflow-hidden rounded-full border border-gold/20 transition-all duration-500 hover:border-gold/50"
              >
                <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative text-[9px] uppercase tracking-[0.4em] text-gold group-hover:text-text-main transition-colors">
                  Explore Our Shops
                </span>
              </Link>
            )}

            <Link 
              href="/" 
              className="text-[9px] uppercase tracking-[0.3em] text-text-sub hover:text-gold transition-colors duration-300 py-2 border-b border-transparent hover:border-gold/30"
            >
              Return to Home
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 opacity-20">
            <p className="text-[8px] font-mono tracking-widest uppercase">Null_State // 000</p>
            <p className="text-[8px] font-mono tracking-widest uppercase">Venue_Explorer_v3</p>
        </div>
      </main>
  )
}