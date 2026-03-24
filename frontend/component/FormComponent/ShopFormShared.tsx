"use client";

import Image from "next/image";
import { useRef, useCallback, useState } from "react";
import { MassageType } from "@/libs/shops/createShop";

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold tracking-[0.18em] text-stone-400 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-b border-stone-700 py-1.5 text-sm text-stone-100
          placeholder:text-stone-600 focus:outline-none focus:border-amber-400
          transition-colors duration-200 w-full"
      />
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold tracking-[0.18em] text-stone-400 uppercase">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="bg-transparent border border-stone-700 rounded p-2 text-sm text-stone-100
          placeholder:text-stone-600 focus:outline-none focus:border-amber-400
          transition-colors duration-200 w-full resize-none"
      />
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] font-black tracking-[0.3em] text-amber-400 uppercase whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-stone-700" />
    </div>
  );
}

// ─── MassageCard ──────────────────────────────────────────────────────────────
export const emptyMassage = (): MassageType & { _id: string } => ({
  _id: crypto.randomUUID(),
  name: "",
  description: "",
  price: 0,
  picture: "",
});

export function MassageCard({
  index,
  item,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  item: MassageType & { _id: string };
  onChange: (id: string, field: keyof MassageType, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  return (
    <div className="border border-stone-800 bg-stone-900/40 p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-[0.25em] text-stone-600 uppercase">
          Type {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(item._id)}
            className="text-stone-700 hover:text-red-400 transition-colors text-xs tracking-wider"
          >
            ✕ Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Name *"
          value={item.name}
          onChange={(v) => onChange(item._id, "name", v)}
          placeholder="Thai Traditional"
        />
        <Field
          label="Price (THB) *"
          value={item.price === 0 ? "" : String(item.price)}
          onChange={(v) => onChange(item._id, "price", Number(v))}
          placeholder="500"
          type="number"
        />
      </div>
      <Field
        label="Description"
        value={item.description ?? ""}
        onChange={(v) => onChange(item._id, "description", v)}
        placeholder="60-minute full-body massage..."
      />
      <Field
        label="Picture URL"
        value={item.picture ?? ""}
        onChange={(val) => onChange(item._id, "picture", val)}
        placeholder="https://example.com/image.jpg"
      />
    </div>
  );
}

// ─── ImageDropZone ────────────────────────────────────────────────────────────
/**
 * Handles both URL input and file drag-and-drop / click-to-browse.
 * URL takes priority: when imageURL is non-empty the preview shows the URL
 * image and the file input is ignored on submit.
 */
export function ImageDropZone({
  imageURL,
  onImageURLChange,
  previewURL,       // object URL from a local file (used only when imageURL is empty)
  onFileChange,
  shopName,
  massageCount,
}: {
  imageURL: string;
  onImageURLChange: (url: string) => void;
  previewURL: string;
  onFileChange: (file: File) => void;
  shopName: string;
  massageCount: number;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlMode, setUrlMode] = useState<boolean>(!!imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFileChange(file);
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // The preview source: URL wins over local file blob
  const activePreview = imageURL.trim() || previewURL;

  return (
    <div className="hidden md:flex md:w-[380px] flex-shrink-0 flex-col">
      {/* ── drop area ── */}
      <div
        className={`flex-1 relative cursor-pointer group transition-all duration-300
          ${isDragging ? "bg-stone-800" : "bg-[#141414]"}
          ${urlMode ? "pointer-events-none" : ""}`}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !urlMode && fileInputRef.current?.click()}
      >
        {activePreview ? (
          <>
            <Image
              src={activePreview}
              alt="shop preview"
              fill
              className="object-cover opacity-80 group-hover:opacity-50 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {!urlMode && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                <div className="border border-white/30 px-6 py-2 backdrop-blur-sm">
                  <p className="text-white text-xs tracking-[0.2em] uppercase">Change Photo</p>
                </div>
              </div>
            )}
            {/* URL badge */}
            {imageURL.trim() && (
              <div className="absolute top-3 left-3 bg-amber-400/90 text-black text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                URL
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors
                ${isDragging ? "border-amber-400 bg-amber-400/10" : "border-stone-600 group-hover:border-stone-400"}`}
            >
              <svg
                className={`w-6 h-6 transition-colors ${isDragging ? "text-amber-400" : "text-stone-500 group-hover:text-stone-300"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className={`text-xs tracking-[0.2em] uppercase transition-colors
                  ${isDragging ? "text-amber-400" : "text-stone-500 group-hover:text-stone-400"}`}
              >
                {isDragging ? "Drop to upload" : "Drag & drop photo"}
              </p>
              <p className="text-[10px] text-stone-700 mt-1 tracking-wider">or click to browse</p>
              <p className="text-[10px] text-stone-700 mt-1 tracking-wider">uploaded on submit</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {/* ── URL / File toggle + URL input ── */}
      <div className="bg-[#141414] border-t border-stone-800 px-5 pt-4 pb-3 space-y-3">
        {/* toggle */}
        <div className="flex items-center gap-1 bg-stone-900 rounded p-0.5 w-fit">
          <button
            type="button"
            onClick={() => setUrlMode(false)}
            className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
              ${!urlMode ? "bg-stone-700 text-stone-100" : "text-stone-600 hover:text-stone-400"}`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setUrlMode(true)}
            className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
              ${urlMode ? "bg-amber-400 text-black font-bold" : "text-stone-600 hover:text-stone-400"}`}
          >
            Image URL
          </button>
        </div>

        {/* URL input — only visible when urlMode */}
        {urlMode && (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-[0.18em] text-stone-400 uppercase">
              Image URL
            </label>
            <input
              type="url"
              value={imageURL}
              onChange={(e) => onImageURLChange(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="bg-transparent border-b border-stone-700 py-1.5 text-xs text-stone-100
                placeholder:text-stone-600 focus:outline-none focus:border-amber-400
                transition-colors duration-200 w-full"
            />
            {imageURL.trim() && (
              <p className="text-[9px] text-amber-400 tracking-wider mt-0.5">
                ✦ URL takes priority over file upload
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── name / count preview ── */}
      <div className="bg-[#141414] px-8 py-6 border-t border-stone-800">
        <p className="text-[9px] tracking-[0.3em] text-stone-600 uppercase mb-1">Shop</p>
        <p className="text-stone-200 text-lg font-light tracking-wider truncate">
          {shopName || <span className="text-stone-700 italic">Untitled</span>}
        </p>
        {massageCount > 0 && (
          <p className="text-stone-600 text-xs mt-1 tracking-wide">
            {massageCount} massage type{massageCount > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── MobileImageDrop ──────────────────────────────────────────────────────────
export function MobileImageDrop({
  imageURL,
  onImageURLChange,
  previewURL,
  onFileChange,
}: {
  imageURL: string;
  onImageURLChange: (url: string) => void;
  previewURL: string;
  onFileChange: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlMode, setUrlMode] = useState<boolean>(!!imageURL);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePreview = imageURL.trim() || previewURL;

  return (
    <div className="md:hidden space-y-3">
      {/* toggle */}
      <div className="flex items-center gap-1 bg-stone-900 rounded p-0.5 w-fit">
        <button
          type="button"
          onClick={() => setUrlMode(false)}
          className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
            ${!urlMode ? "bg-stone-700 text-stone-100" : "text-stone-600 hover:text-stone-400"}`}
        >
          File Upload
        </button>
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded transition-all
            ${urlMode ? "bg-amber-400 text-black font-bold" : "text-stone-600 hover:text-stone-400"}`}
        >
          Image URL
        </button>
      </div>

      {urlMode ? (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold tracking-[0.18em] text-stone-400 uppercase">
            Image URL
          </label>
          <input
            type="url"
            value={imageURL}
            onChange={(e) => onImageURLChange(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="bg-transparent border-b border-stone-700 py-1.5 text-sm text-stone-100
              placeholder:text-stone-600 focus:outline-none focus:border-amber-400
              transition-colors duration-200 w-full"
          />
          {activePreview && (
            <div className="relative h-40 rounded overflow-hidden mt-2">
              <Image src={activePreview} alt="preview" fill className="object-cover" />
              <div className="absolute top-2 left-2 bg-amber-400/90 text-black text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                URL
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="border border-dashed border-stone-700 rounded-lg p-6 text-center
            cursor-pointer hover:border-stone-500 transition-colors"
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file?.type.startsWith("image/")) onFileChange(file);
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewURL ? (
            <div className="relative h-40 rounded overflow-hidden">
              <Image src={previewURL} alt="preview" fill className="object-cover" />
            </div>
          ) : (
            <p className="text-stone-500 text-xs tracking-widest uppercase">
              {isDragging ? "Drop here" : "Tap to add photo"}
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileChange(f);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
export function Step({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-1.5 h-1.5 rounded-full transition-colors
          ${done ? "bg-emerald-400" : active ? "bg-amber-400" : "bg-stone-700"}`}
      />
      <span
        className={`text-[9px] tracking-widest uppercase transition-colors
          ${done ? "text-emerald-400" : active ? "text-amber-400" : "text-stone-700"}`}
      >
        {label}
      </span>
    </div>
  );
}
