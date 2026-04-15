export default function ShopDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-text-main pb-24 px-8 pt-6 transition-colors duration-500">
      
      <div className="h-4 w-32 bg-text-sub/10 rounded animate-pulse mb-4" />

      <div className="min-h-screen flex flex-col items-center py-16 px-4">
        <div className="max-w-5xl w-full bg-card rounded-2xl overflow-hidden border border-card-border shadow-2xl">
          <div className="h-64 bg-text-sub/5 animate-pulse" />
          <div className="p-8 space-y-4">
            <div className="h-6 w-48 bg-text-sub/20 rounded animate-pulse" />
            <div className="h-4 w-72 bg-text-sub/10 rounded animate-pulse" />
            <div className="h-4 w-56 bg-text-sub/10 rounded animate-pulse" />
          </div>
        </div>

        <div className="max-w-5xl w-full mt-16">
          <div className="mb-10 text-center space-y-4">
            <div className="h-6 w-36 bg-text-sub/20 rounded animate-pulse mx-auto" />
            <div className="h-[1px] w-12 bg-accent/30 mx-auto" />
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-24 bg-card/50 border border-card-border/50 rounded-xl animate-pulse" 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}