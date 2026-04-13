export default function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span 
          key={i} 

          className={`text-sm ${
            i < score 
              ? "text-accent" 
              : "text-text-sub opacity-30"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}