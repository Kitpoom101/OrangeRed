"use client";

import { useState, useEffect, useRef } from "react";
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

  const formRef = useRef<HTMLDivElement>(null);

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
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
    <div id="reviews" className="mt-20 scroll-mt-24">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-bold">
            ✦ Guest Experiences
          </p>
          <p className="mt-2 text-sm text-text-sub italic font-light">
            Insights from our valued community.
          </p>
        </div>
        <div className="rounded-full border border-card-border bg-surface/40 px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-text-sub">
          {ratings.length} {ratings.length === 1 ? "Review" : "Reviews"}
        </div>
      </div>

      <div ref={formRef} className="mb-12">
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
      </div>

      {ratings.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-card-border rounded-3xl">
          <p className="text-text-sub text-xs uppercase tracking-widest opacity-50">No reviews shared yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {ratings.map((comment) => {
            const isOwner = comment.user._id === userId;
            const showActions = (isOwner || isAdmin) && !editingId;
            
            return (
              <div
                key={comment._id}
                className={`relative overflow-hidden rounded-3xl border border-card-border bg-card/40 p-6 transition-all duration-500 ${editingId === comment._id ? 'opacity-30 scale-[0.98]' : 'hover:shadow-xl hover:shadow-black/5'}`}
              >
                {/* เส้นตกแต่งด้านบนเปลี่ยนเป็นสีทองจางๆ */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                
                <div className="flex gap-5">
                  {/* Profile Picture Frame */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-accent/20 bg-surface shadow-inner">
                    {comment.user.profilePicture ? (
                      <Image
                        src={comment.user.profilePicture}
                        alt={comment.user.name}
                        fill
                        className="object-cover transition-transform hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent/5 text-sm font-serif italic text-accent">
                        {comment.user.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-base font-serif tracking-wide text-text-main">
                            {comment.user.name}
                          </p>
                          {isOwner && (
                            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-accent font-bold">
                              Verified Author
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-text-sub/60">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric" 
                          })}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          {/* StarRating ควรส่ง Props สี accent เข้าไปถ้าทำได้ครับ */}
                          <StarRating score={comment.score} />
                          <span className="text-[12px] font-mono font-medium text-accent">{comment.score}.0</span>
                        </div>
                      </div>

                      {/* Action Buttons ปรับสีให้เบาลง */}
                      <div className="flex min-h-8 items-start justify-end">
                        {showActions ? (
                          <div className="flex gap-2 rounded-xl border border-card-border bg-surface/50 p-1.5 shadow-sm">
                            <button
                              onClick={() => handleEditClick(comment)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-sub transition-all hover:bg-accent/10 hover:text-accent"
                              title="Edit review"
                            >
                              <BsPencil />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(comment._id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-sub transition-all hover:bg-red-500/10 hover:text-red-500"
                              title="Delete review"
                            >
                              <BsTrash/>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Review Text Area */}
                    <div className="mt-5 rounded-2xl border border-card-border/50 bg-surface/20 px-5 py-4">
                      {comment.review ? (
                        <p className="text-sm leading-relaxed text-text-main/90 font-light italic">
                          "{comment.review}"
                        </p>
                      ) : (
                        <p className="text-xs italic text-text-sub opacity-50">The guest preferred to stay silent.</p>
                      )}
                    </div>
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
