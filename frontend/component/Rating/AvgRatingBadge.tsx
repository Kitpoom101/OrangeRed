export default function AvgRatingBadge({ ratings = [] }: { ratings: any[] }) {
  const reviewCount = ratings.length;
  const avgRating = reviewCount > 0 
    ? Math.round((ratings.reduce((sum, c) => sum + c.score, 0) / reviewCount) * 10) / 10 
    : 0;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-blue-400 text-xs">★</span>
      <span className="text-gray-200 text-xs font-mono">{avgRating.toFixed(1)}</span>
      <span className="text-gray-600 text-[10px] tracking-wide">({reviewCount} reviews)</span>
    </div>
  );
}