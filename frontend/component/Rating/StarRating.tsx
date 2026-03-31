export default function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < score ? "text-blue-400" : "text-gray-700"}>
          ★
        </span>
      ))}
    </div>
  );
}