"use client";

import { useState } from "react";

export default function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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