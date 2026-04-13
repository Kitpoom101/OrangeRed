"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StarRating from "../Rating/StarRating";
import CommentForm from "../FormComponent/CommentForm";
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
  userId?: string;
  isAdmin?: boolean;
  canCreateRating?: boolean;
  createDisabledMessage?: string;
}

export default function UserComments({
  shopId,
  token = "",
  reservationId,
  userId,
  isAdmin = false,
  canCreateRating = false,
  createDisabledMessage,
}: UserCommentsProps) {
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

  const userRatings = ratings.filter((rating) => rating.user._id === userId);
  const userRatingCount = userRatings.length;
  const reachedReviewLimit = !isAdmin && userRatingCount >= 5;
  const canSubmitNewRating = Boolean(token) && (isAdmin || (canCreateRating && !reachedReviewLimit));

  const formDisabledMessage = !token
    ? "Please sign in to review this shop."
    : isAdmin
      ? undefined
      : reachedReviewLimit
        ? "You can review this shop at most 5 times. Please edit or delete one of your old reviews first."
        : createDisabledMessage;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateRating(editingId, score, review, token);
      } else {
        if (!canSubmitNewRating) {
          throw new Error(formDisabledMessage || "You cannot review this shop yet.");
        }

        await addRating({
          reservationId,
          shopId,
          score,
          review,
          token,
        });
      }
      
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
      <p className="text-[11px] uppercase tracking-[0.4em] text-blue-400 mb-6">
        — Reviews —
      </p>

      <CommentForm
        score={score}
        review={review}
        isSubmitting={isSubmitting}
        isEditing={Boolean(editingId)}
        isDisabled={!editingId && !canSubmitNewRating}
        disabledMessage={formDisabledMessage}
        canCancelEdit={Boolean(editingId)}
        onScoreChange={setScore}
        onReviewChange={setReview}
        onSubmit={handleSubmit}
        onCancelEdit={handleCancelEdit}
      />

      {ratings.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {ratings.map((comment) => {
            const isOwner = comment.user._id === userId;
            
            return (
              <div
                key={comment._id}
                className={`border border-gray-700/30 bg-gray-800/20 rounded-lg p-5 relative ${editingId === comment._id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-500/40 shrink-0">
                    {comment.user.profilePicture ? (
                      <Image
                        src={comment.user.profilePicture}
                        alt={comment.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                        {comment.user.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm tracking-wide">
                      {comment.user.name} 
                      {isOwner && <span className="ml-2 text-[9px] text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                    </p>
                    <p className="text-gray-600 text-[10px] tracking-wider">
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
                          className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <BsPencil />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(comment._id)}
                          className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <BsTrash/>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {comment.review && (
                  <p className="text-gray-400 text-sm font-light leading-relaxed">{comment.review}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
