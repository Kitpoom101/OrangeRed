export default function AvgRatingBadge({ avgRating = 0, ratingCount = 0 }: { avgRating?: number; ratingCount?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-accent text-xs">★</span>
      
      <span className="text-text-main text-xs font-mono">
        {avgRating.toFixed(1)}
      </span>
      
      <span className="text-text-sub text-[10px] tracking-wide">
        ({ratingCount} reviews)
      </span>
    </div>
  );
}