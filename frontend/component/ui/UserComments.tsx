"use client";

import { useState } from "react";

// Shaped after Rating model (backend/models/Rating.js)
// user/shop fields reflect what getRatings populates: user { name }, shop { name }
export const MOCK_COMMENTS = [
  {
    _id: "64f1a2b3c4d5e6f7a8b9c001",
    user: { _id: "64f1a2b3c4d5e6f7a8b9u001", name: "Natcha Wongkham" },
    shop: { _id: "64f1a2b3c4d5e6f7a8b9s001", name: "Serenity Spa" },
    reservation: "64f1a2b3c4d5e6f7a8b9r001",
    score: 5,
    review: "Absolutely wonderful experience. The staff were attentive and the atmosphere was incredibly calming.",
    createdAt: "2025-03-15T10:30:00.000Z",
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c002",
    user: { _id: "64f1a2b3c4d5e6f7a8b9u002", name: "James Thornton" },
    shop: { _id: "64f1a2b3c4d5e6f7a8b9s001", name: "Serenity Spa" },
    reservation: "64f1a2b3c4d5e6f7a8b9r002",
    score: 4,
    review: "Great massage, very professional. Will definitely come back again. The Thai traditional was top notch.",
    createdAt: "2025-02-20T14:00:00.000Z",
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c003",
    user: { _id: "64f1a2b3c4d5e6f7a8b9u003", name: "Siriporn Kaewmanee" },
    shop: { _id: "64f1a2b3c4d5e6f7a8b9s001", name: "Serenity Spa" },
    reservation: "64f1a2b3c4d5e6f7a8b9r003",  
    score: 5,
    review: "One of the best massage shops I have visited. Highly recommend the aromatherapy package.",
    createdAt: "2025-01-10T09:15:00.000Z",
  },
];

export const MOCK_AVG_RATING =
  Math.round((MOCK_COMMENTS.reduce((sum, c) => sum + c.score, 0) / MOCK_COMMENTS.length) * 10) / 10;

export const MOCK_REVIEW_COUNT = MOCK_COMMENTS.length;

export function AvgRatingBadge() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-blue-400 text-xs">★</span>
      <span className="text-gray-200 text-xs font-mono">{MOCK_AVG_RATING}</span>
      <span className="text-gray-600 text-[10px] tracking-wide">({MOCK_REVIEW_COUNT} reviews)</span>
    </div>
  );
}

function StarRating({ score }: { score: number }) {
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

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i + 1)}
          className={(hovered || value) > i ? "text-blue-400" : "text-gray-700"}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function UserComments() {
  const [score, setScore] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // mock submit — reset form
    setScore(0);
    setReview("");
  };

  return (
    <div className="mt-12">
      <p className="text-[11px] uppercase tracking-[0.4em] text-blue-400 mb-6">
        — Reviews —
      </p>

      {/* ── Create Review Box ── */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-700/30 bg-gray-800/20 rounded-lg p-5 mb-6 flex flex-col gap-3"
      >
        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Write a Review</p>
        <StarPicker value={score} onChange={setScore} />
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience... (optional)"
          rows={3}
          className="bg-transparent border border-gray-700/40 rounded p-3 text-sm text-gray-100
            placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50
            transition-colors duration-200 resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={score === 0}
            className="text-[10px] uppercase tracking-[0.25em] px-4 py-2 border border-blue-500/40
              text-blue-400 rounded hover:bg-blue-500/10 transition-colors duration-200
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </form>

      {/* ── Comment List ── */}
      <div className="flex flex-col gap-4">
        {MOCK_COMMENTS.map((comment) => (
          <div
            key={comment._id}
            className="border border-gray-700/30 bg-gray-800/20 rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold">
                {comment.user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-gray-200 text-sm tracking-wide">{comment.user.name}</p>
                <p className="text-gray-600 text-[10px] tracking-wider">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="ml-auto">
                <StarRating score={comment.score} />
              </div>
            </div>
            {comment.review && (
              <p className="text-gray-400 text-sm font-light leading-relaxed">{comment.review}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
