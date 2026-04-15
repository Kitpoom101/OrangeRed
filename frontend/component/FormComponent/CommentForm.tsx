"use client";

import type { FormEvent } from "react";
import StarPicker from "../Rating/StarPicker";

interface CommentFormProps {
  score: number;
  review: string;
  isSubmitting: boolean;
  isEditing: boolean;
  isDisabled: boolean;
  disabledMessage?: string;
  canCancelEdit: boolean;
  onScoreChange: (value: number) => void;
  onReviewChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
}

export default function CommentForm({
  score,
  review,
  isSubmitting,
  isEditing,
  isDisabled,
  disabledMessage,
  canCancelEdit,
  onScoreChange,
  onReviewChange,
  onSubmit,
  onCancelEdit,
}: CommentFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`border rounded-2xl p-6 mb-8 flex flex-col gap-4 transition-all duration-500 shadow-2xl ${
        isEditing
          ? "border-accent bg-accent/5 shadow-accent/5 scale-[1.01]"
          : "border-card-border bg-card/30 shadow-black/10"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-sub font-bold">
            {isEditing ? "✦ Refining Your Experience" : "✦ Share Your Journey"}
          </p>
          {disabledMessage && !isEditing ? (
            <p className="text-[11px] text-accent/80 italic tracking-wide animate-pulse">
              {disabledMessage}
            </p>
          ) : null}
        </div>
        {canCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-[9px] uppercase tracking-widest text-text-sub hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500/50 pb-0.5"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>

      <div className="py-2">
        <StarPicker
          value={score}
          onChange={onScoreChange}
          disabled={isDisabled && !isEditing}
        />
      </div>

      <textarea
        value={review}
        onChange={(e) => onReviewChange(e.target.value)}
        placeholder="How was your visit? (optional)"
        rows={3}
        disabled={isDisabled && !isEditing}
        className="bg-surface/30 border border-card-border rounded-xl p-4 text-sm text-text-main 
          placeholder:text-text-sub/40 focus:outline-none focus:border-accent/50 focus:bg-surface/50
          transition-all duration-300 resize-none disabled:opacity-30 font-light leading-relaxed"
      />

      <div className="flex justify-end gap-3 mt-2">
        <button
          type="submit"
          disabled={(score === 0 && !isEditing) || isSubmitting || (isDisabled && !isEditing)}
          className={`text-[10px] uppercase tracking-[0.3em] px-8 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg
            disabled:opacity-20 disabled:cursor-not-allowed
            ${
              isEditing
                ? "bg-accent text-white hover:opacity-90 shadow-accent/20"
                : "bg-surface border border-accent/40 text-accent hover:bg-accent hover:text-white"
            }`}
        >
          {isSubmitting ? "Sending..." : isEditing ? "Update Experience" : "Publish Review"}
        </button>
      </div>
    </form>
  );
}