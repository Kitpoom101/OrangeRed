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
      className={`border ${
        isEditing
          ? "border-blue-500/50 bg-blue-900/10"
          : "border-gray-700/30 bg-gray-800/20"
      } rounded-lg p-5 mb-6 flex flex-col gap-3 transition-colors`}
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </p>
          {disabledMessage && !isEditing ? (
            <p className="mt-2 text-sm text-amber-300">{disabledMessage}</p>
          ) : null}
        </div>
        {canCancelEdit ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-[9px] uppercase tracking-wider text-red-400 hover:text-red-300"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>

      <StarPicker
        value={score}
        onChange={onScoreChange}
        disabled={isDisabled && !isEditing}
      />
      <textarea
        value={review}
        onChange={(e) => onReviewChange(e.target.value)}
        placeholder="Share your experience... (optional)"
        rows={3}
        disabled={isDisabled && !isEditing}
        className="bg-transparent border border-gray-700/40 rounded p-3 text-sm text-gray-100
          placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50
          transition-colors duration-200 resize-none disabled:opacity-50"
      />
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={(score === 0 && !isEditing) || isSubmitting || (isDisabled && !isEditing)}
          className={`text-[10px] uppercase tracking-[0.25em] px-4 py-2 border rounded transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed
            ${
              isEditing
                ? "border-blue-400/80 text-blue-300 bg-blue-500/20 hover:bg-blue-500/30"
                : "border-blue-500/40 text-blue-400 hover:bg-blue-500/10"
            }`}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Review" : "Submit"}
        </button>
      </div>
    </form>
  );
}
