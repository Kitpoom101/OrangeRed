"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import createShop, { MassageType } from "@/libs/shops/createShop";

function Field({
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

function Textarea({
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] font-black tracking-[0.3em] text-amber-400 uppercase whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-stone-700" />
    </div>
  );
}

// ─── empty massage entry ──────────────────────────────────────────────────────
const emptyMassage = (): MassageType & { _id: string } => ({
  _id: crypto.randomUUID(),
  name: "",
  description: "",
  price: 0,
  picture: "",
});

// ─── massage card ─────────────────────────────────────────────────────────────
function MassageCard({
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
    <div className="border border-stone-800 bg-stone-900/40 p-4 rounded-lg space-y-3 relative group">
      {/* index badge */}
      <div className="flex items-center justify-between mb-1">
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
        onChange={(v) => onChange(item._id, "picture", v)}
        placeholder="https://..."
      />
    </div>
  );
}

// ─── main form ────────────────────────────────────────────────────────────────
export default function CreateShopForm() {
  // shop fields
  const [name, setName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [tel, setTel] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");

  const [massageTypes, setMassageTypes] = useState<
    (MassageType & { _id: string })[]
  >([emptyMassage()]);

  const [imageURL, setImageURL] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: session } = useSession();

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageURL(URL.createObjectURL(file));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const addMassage = () =>
    setMassageTypes((prev) => [...prev, emptyMassage()]);

  const removeMassage = (id: string) =>
    setMassageTypes((prev) => prev.filter((m) => m._id !== id));

  const updateMassage = (
    id: string,
    field: keyof MassageType,
    value: string | number
  ) =>
    setMassageTypes((prev) =>
      prev.map((m) => (m._id === id ? { ...m, [field]: value } : m))
    );

  async function handleCreate() {
    setError("");

    if (!session) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }

    // basic validation
    if (!name || !street || !tel || !open || !close) {
      setError("Please fill in all required fields (name, street, tel, hours).");
      return;
    }
    if (tel.length !== 10 || !/^\d+$/.test(tel)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    const invalidMassage = massageTypes.some((m) => !m.name || !m.price);
    if (invalidMassage) {
      setError("Each massage type must have a name and price.");
      return;
    }

    setLoading(true);
    try {
      // strip internal _id before sending
      const payload = massageTypes.map(({ _id, ...rest }) => rest);

      await createShop(
        session.user.token,
        name,
        { street, district, province, postalcode },
        tel,
        { open, close },
        payload,
        imageURL || undefined,
        shopDescription || undefined
      );
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">✦</div>
          <p className="text-amber-400 tracking-[0.3em] uppercase text-sm font-bold">
            Shop Created
          </p>
          <p className="text-stone-500 text-xs tracking-widest">{name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-stretch font-['DM_Sans',sans-serif]">

      {/* ── LEFT: image drop panel ── */}
      <div className="hidden md:flex md:w-[380px] flex-shrink-0 flex-col">
        <div
          className={`flex-1 relative cursor-pointer group transition-all duration-300
            ${isDragging ? "bg-stone-800" : "bg-[#141414]"}`}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          {imageURL ? (
            <>
              <Image
                src={imageURL}
                alt="shop preview"
                fill
                className="object-cover opacity-80 group-hover:opacity-50 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="border border-white/30 px-6 py-2 backdrop-blur-sm">
                  <p className="text-white text-xs tracking-[0.2em] uppercase">Change Photo</p>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-200
                ${isDragging ? "border-amber-400 bg-amber-400/10" : "border-stone-600 group-hover:border-stone-400"}`}>
                <svg className={`w-6 h-6 transition-colors ${isDragging ? "text-amber-400" : "text-stone-500 group-hover:text-stone-300"}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className={`text-xs tracking-[0.2em] uppercase transition-colors
                  ${isDragging ? "text-amber-400" : "text-stone-500 group-hover:text-stone-400"}`}>
                  {isDragging ? "Drop to upload" : "Drag & drop photo"}
                </p>
                <p className="text-[10px] text-stone-700 mt-1 tracking-wider">or click to browse</p>
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        {/* name preview */}
        <div className="bg-[#141414] px-8 py-6 border-t border-stone-800">
          <p className="text-[9px] tracking-[0.3em] text-stone-600 uppercase mb-1">Shop</p>
          <p className="text-stone-200 text-lg font-light tracking-wider truncate">
            {name || <span className="text-stone-700 italic">Untitled</span>}
          </p>
          {massageTypes.length > 0 && (
            <p className="text-stone-600 text-xs mt-1 tracking-wide">
              {massageTypes.length} massage type{massageTypes.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* ── RIGHT: form ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* header */}
        <div className="px-8 pt-12 pb-8 border-b border-stone-800">
          <p className="text-[9px] tracking-[0.35em] text-amber-400 uppercase mb-2">✦ New Listing</p>
          <h1 className="text-3xl font-light text-stone-100 tracking-tight">Register a Shop</h1>
        </div>

        <div className="px-8 py-8 space-y-10 flex-1">

          {/* mobile image drop */}
          <div className="md:hidden border border-dashed border-stone-700 rounded-lg p-6 text-center cursor-pointer
            hover:border-stone-500 transition-colors"
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}>
            {imageURL ? (
              <div className="relative h-40 rounded overflow-hidden">
                <Image src={imageURL} alt="preview" fill className="object-cover" />
              </div>
            ) : (
              <p className="text-stone-500 text-xs tracking-widest uppercase">
                {isDragging ? "Drop here" : "Tap to add photo"}
              </p>
            )}
          </div>

          {/* ── Basics ── */}
          <div>
            <SectionLabel>Basics</SectionLabel>
            <div className="space-y-5">
              <Field label="Shop Name *" value={name} onChange={setName} placeholder="e.g. Serenity Massage" />
              <Field label="Phone Number *" value={tel} onChange={setTel} placeholder="0812345678" type="tel" />
              <Textarea
                label="Shop Description"
                value={shopDescription}
                onChange={setShopDescription}
                placeholder="Tell customers what makes your shop special..."
              />
            </div>
          </div>

          {/* ── Hours ── */}
          <div>
            <SectionLabel>Opening Hours</SectionLabel>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Opens At *" value={open} onChange={setOpen} placeholder="09:00" type="time" />
              <Field label="Closes At *" value={close} onChange={setClose} placeholder="21:00" type="time" />
            </div>
          </div>

          {/* ── Address ── */}
          <div>
            <SectionLabel>Address</SectionLabel>
            <div className="space-y-5">
              <Field label="Street *" value={street} onChange={setStreet} placeholder="715 Metz Road" />
              <div className="grid grid-cols-2 gap-5">
                <Field label="District" value={district} onChange={setDistrict} placeholder="Khlong Toei" />
                <Field label="Province" value={province} onChange={setProvince} placeholder="Bangkok" />
              </div>
              <Field label="Postal Code" value={postalcode} onChange={setPostalcode} placeholder="10110" />
            </div>
          </div>

          {/* ── Massage Types ── */}
          <div>
            <SectionLabel>Massage Types</SectionLabel>
            <div className="space-y-3">
              {massageTypes.map((item, index) => (
                <MassageCard
                  key={item._id}
                  index={index}
                  item={item}
                  onChange={updateMassage}
                  onRemove={removeMassage}
                  canRemove={massageTypes.length > 1}
                />
              ))}

              {/* add button */}
              <button
                type="button"
                onClick={addMassage}
                className="w-full py-3 border border-dashed border-stone-700 hover:border-amber-400/50
                  text-stone-600 hover:text-amber-400 text-xs tracking-[0.2em] uppercase
                  transition-all duration-200 rounded-lg flex items-center justify-center gap-2"
              >
                <span className="text-base leading-none">+</span>
                Add Massage Type
              </button>
            </div>
          </div>

          {/* error */}
          {error && (
            <p className="text-red-400 text-xs tracking-wide border-l-2 border-red-500 pl-3">
              {error}
            </p>
          )}
        </div>

        {/* sticky footer */}
        <div className="sticky bottom-0 px-8 py-5 bg-[#0f0f0f] border-t border-stone-800">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:bg-stone-700
              text-black disabled:text-stone-500 font-bold text-xs tracking-[0.25em] uppercase
              transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating…
              </span>
            ) : (
              "Create Shop"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
