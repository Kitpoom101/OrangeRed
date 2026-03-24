export default function ShopDetailLoading() {
  return (
    <div className="min-h-screen text-white pb-24 px-8 pt-6">
      {/* Back link skeleton */}
      <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse mb-4" />

      <div className="min-h-screen flex flex-col items-center py-16 px-4">
        {/* Shop card skeleton */}
        <div className="max-w-5xl w-full bg-[#1e2d3d] rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
          <div className="h-64 bg-gray-700/30 animate-pulse" />
          <div className="p-8 space-y-4">
            <div className="h-6 w-48 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-4 w-72 bg-gray-700/40 rounded animate-pulse" />
            <div className="h-4 w-56 bg-gray-700/40 rounded animate-pulse" />
          </div>
        </div>

        {/* Service menu skeleton */}
        <div className="max-w-5xl w-full mt-16">
          <div className="mb-10 text-center space-y-4">
            <div className="h-6 w-36 bg-gray-700/50 rounded animate-pulse mx-auto" />
            <div className="h-[1px] w-12 bg-blue-500/50 mx-auto" />
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}