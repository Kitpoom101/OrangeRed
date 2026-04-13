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
  token,
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
      if (!token) return;
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
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-blue-400">
            — Reviews —
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Read what other customers think before booking.
          </p>
        </div>
        <div className="rounded-full border border-gray-700/50 bg-gray-900/40 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-gray-400">
          {ratings.length} Review{ratings.length === 1 ? "" : "s"}
        </div>
      </div>

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
            const showActions = (isOwner || isAdmin) && !editingId;
            
            return (
              <div
                key={comment._id}
                className={`relative overflow-hidden rounded-2xl border border-gray-700/40 bg-gradient-to-br from-[#182331] via-[#111927] to-[#0d1420] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] ${editingId === comment._id ? 'opacity-50' : ''}`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
                <div className="flex gap-4">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-blue-500/30 bg-slate-900">
                    {comment.user.profilePicture ? (
                      <Image
                        src={comment.user.profilePicture}
                        alt={comment.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-500/15 text-sm font-semibold text-blue-300">
                        {comment.user.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-base font-medium tracking-wide text-gray-100">
                            {comment.user.name}
                          </p>
                          {isOwner ? (
                            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-blue-300">
                              You
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric" 
                          })}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <StarRating score={comment.score} />
                          <span className="text-sm font-medium text-gray-300">{comment.score}.0</span>
                        </div>
                      </div>
                      <div className="flex min-h-8 min-w-16 items-start justify-end">
                        {showActions ? (
                          <div className="flex gap-2 rounded-full border border-gray-700/50 bg-black/20 px-2 py-1">
                            <button
                              onClick={() => handleEditClick(comment)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                              aria-label="Edit review"
                            >
                              <BsPencil />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(comment._id)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                              aria-label="Delete review"
                            >
                              <BsTrash/>
                            </button>
                          </div>
                        ) : (
                          <div className="h-9 w-16 rounded-full border border-transparent" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-white/5 bg-black/15 px-4 py-3">
                      {comment.review ? (
                        <p className="text-sm leading-7 text-gray-300">{comment.review}</p>
                      ) : (
                        <p className="text-sm italic text-gray-500">No written comment.</p>
                      )}
                    </div>
                    {showActions ? (
                      <div className="mt-3 text-[10px] uppercase tracking-[0.22em] text-gray-500">
                        You can edit or delete this review here.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
