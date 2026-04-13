"use client";

import { useState } from "react";

export default function StarPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => !disabled && setHovered(i + 1)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onChange(i + 1)}
          disabled={disabled}
          className={`${(hovered || value) > i ? "text-blue-400" : "text-gray-700"} ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
