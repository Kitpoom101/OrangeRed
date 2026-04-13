"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StarRating from "../Rating/StarRating";
import StarPicker from "../Rating/StarPicker";
// Adjust these imports to match your actual folder structure!
import getRatingsByShop from "@/libs/ratings/getRatingsByShop";
import addRating from "@/libs/ratings/addRating";
import updateRating from "@/libs/ratings/updateRating";
import deleteRating from "@/libs/ratings/deleteRating";
import BsTrash from "@/component/icons/trashbin";
import BsPencil from "@/component/icons/edit";

interface ReviewComment {
  _id: string;
  user: { _id: string; name: string; profilePicture?: string };
  shop: { _id: string; name: string };
  reservation: string;
  score: number;
  review: string;
  createdAt: string;
}

interface UserCommentsProps {
  shopId: string;
  token?: string;
  reservationId?: string;
  userId?: string; // <-- Added userId to track ownership
  isAdmin?: boolean;
}

export default function UserComments({ shopId, token = "", reservationId, userId, isAdmin = false }: UserCommentsProps) {
  const [ratings, setRatings] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [score, setScore] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const res = await getRatingsByShop(shopId, token);
      setRatings(res.data || []);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchRatings();
    }
  }, [shopId, token]);

  // Check if user already reviewed
  const userHasReviewed = ratings.some(r => r.user._id === userId);

  // ── Handlers ──
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        // UPDATE existing review
        await updateRating(editingId, score, review, token);
      } else {
        // CREATE new review (Requires reservationId)
        if (!reservationId) throw new Error("Missing reservation ID to create review.");
        await addRating(reservationId, score, review, token);
      }
      
      // Reset state and refresh
      handleCancelEdit();
      await fetchRatings();
    } catch (err: any) {
      alert(err.message || "Could not submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (comment: ReviewComment) => {
    setEditingId(comment._id);
    setScore(comment.score);
    setReview(comment.review || "");
    // Smooth scroll to form
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setScore(0);
    setReview("");
  };

  const handleDeleteClick = async (ratingId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    
    try {
      await deleteRating(ratingId, token);
      if (editingId === ratingId) handleCancelEdit(); // Clear form if they deleted what they were editing
      await fetchRatings();
    } catch (err: any) {
      alert(err.message || "Failed to delete review");
    }
  };

  if (loading) return <div className="mt-12 text-gray-500 text-sm">Loading reviews...</div>;

  return (
    <div className="mt-12">
      {/* ── Header ── */}
      <p className="text-[11px] uppercase tracking-[0.4em] text-accent dark:text-accent mb-6 font-bold">
        — Reviews —
      </p>

      {/* ── Create / Edit Review Box ── */}
      {token && (editingId || (!isAdmin && reservationId && !userHasReviewed)) && (
        <form
          onSubmit={handleSubmit}
          className={`border rounded-lg p-5 mb-6 flex flex-col gap-3 transition-all duration-300 shadow-sm
            ${editingId 
              ? 'border-accent/50 bg-accent/5 dark:border-accent/50 dark:bg-accent/10' 
              : 'border-card-border bg-card/50'}`}
        >
          <div className="flex justify-between items-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-text-sub">
              {editingId ? "Edit Your Review" : "Write a Review"}
            </p>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="text-[9px] uppercase tracking-wider text-red-500 hover:text-red-600 font-bold"
              >
                Cancel Edit
              </button>
            )}
          </div>
          
          <StarPicker value={score} onChange={setScore} />
          
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience... (optional)"
            rows={3}
            disabled={isSubmitting}
            className="bg-transparent border border-card-border rounded p-3 text-sm text-text-main
              placeholder:text-text-sub/50 focus:outline-none focus:border-accent dark:focus:border-accent/50
              transition-colors duration-200 resize-none disabled:opacity-50"
          />
          
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={score === 0 || isSubmitting}
              className={`text-[10px] uppercase tracking-[0.25em] px-4 py-2 border rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed font-bold
                ${editingId 
                  ? 'border-accent text-accent hover:bg-accent/10' 
                  : 'border-accent dark:border-accent/40 text-accent dark:text-accent hover:bg-accent/5 dark:hover:bg-accent/10'}`}
            >
              {isSubmitting ? "Saving..." : (editingId ? "Update Review" : "Submit")}
            </button>
          </div>
        </form>
      )}

      {/* ── Comment List ── */}
      {ratings.length === 0 ? (
        <p className="text-text-sub text-sm italic">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {ratings.map((comment) => {
            const isOwner = comment.user._id === userId;
            
            return (
              <div
                key={comment._id}
                className={`border border-card-border bg-card/40 rounded-lg p-5 relative transition-all duration-300
                  ${editingId === comment._id ? 'opacity-40 grayscale-[0.5]' : 'hover:border-accent/30 dark:hover:border-accent/30'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent/30 dark:border-accent/40 shrink-0 shadow-inner">
                    {comment.user.profilePicture ? (
                      <Image
                        src={comment.user.profilePicture}
                        alt={comment.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent dark:text-accent text-xs font-bold">
                        {comment.user.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-text-main text-sm font-medium tracking-wide">
                      {comment.user.name} 
                      {isOwner && (
                        <span className="ml-2 text-[9px] text-accent dark:text-accent border border-accent/30 dark:border-accent/30 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-text-sub text-[10px] tracking-wider opacity-80">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric" 
                      })}
                    </p>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-2">
                    <StarRating score={comment.score} />
                    
                    {(isOwner || isAdmin) && !editingId && (
                      <div className="flex gap-3 mt-1">
                        <button
                          onClick={() => handleEditClick(comment)}
                          className="text-text-sub hover:text-accent dark:hover:text-accent transition-colors p-1"
                          title="Edit Review"
                        >
                          <BsPencil />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(comment._id)}
                          className="text-text-sub hover:text-red-500 transition-colors p-1"
                          title="Delete Review"
                        >
                          <BsTrash/>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {comment.review && (
                  <p className="text-text-main text-sm font-light leading-relaxed pl-11 border-l border-card-border/50 italic">
                    "{comment.review}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}