"use client";

import { useState, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import createShop, { MassageType } from "@/libs/shops/createShop";
import uploadImage from "@/libs/shops/uploadImage";

import {
  Field,
  Textarea,
  SectionLabel,
  MassageCard,
  ImageDropZone,
  MobileImageDrop,
  Spinner,
  Step,
  emptyMassage,
} from "./ShopFormShared";

// ─── submit steps ─────────────────────────────────────────────────────────────
type SubmitStep = "idle" | "creating" | "uploading" | "done" | "error";

// ─── CreateShopForm ───────────────────────────────────────────────────────────
export default function CreateShopForm() {
  const [name, setName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [tel, setTel] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [massageTypes, setMassageTypes] = useState<(MassageType & { _id: string })[]>([
    emptyMassage(),
  ]);

  const [previewURL, setPreviewURL] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [submitStep, setSubmitStep] = useState<SubmitStep>("idle");
  const [error, setError] = useState("");

  const { data: session } = useSession();

  // ── image file handler ────────────────────────────────────────────────────
  const handleFileChange = useCallback((file: File) => {
    setImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
  }, []);

  // ── massage type handlers ─────────────────────────────────────────────────
  const addMassage = () => setMassageTypes((p) => [...p, emptyMassage()]);
  const removeMassage = (id: string) =>
    setMassageTypes((p) => p.filter((m) => m._id !== id));
  const updateMassage = (
    id: string,
    field: keyof MassageType,
    value: string | number
  ) =>
    setMassageTypes((p) =>
      p.map((m) => (m._id === id ? { ...m, [field]: value } : m))
    );

  // ── submit: 1) create shop → 2) upload image (URL wins over file) ─────────
  async function handleCreate() {
    setError("");

    if (!session) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }
    if (!name || !street || !tel || !open || !close) {
      setError("Please fill in all required fields (name, street, tel, hours).");
      return;
    }
    if (tel.length !== 10 || !/^\d+$/.test(tel)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (massageTypes.some((m) => !m.name || !m.price)) {
      setError("Each massage type must have a name and price.");
      return;
    }

    try {
      setSubmitStep("creating");
      const payload = massageTypes.map(({ _id, ...rest }) => rest);

      // URL takes priority — pass it directly if present
      const pictureArg = imageURL.trim() || undefined;

      const result = await createShop(
        session.user.token,
        name,
        { street, district, province, postalcode },
        tel,
        { open, close },
        payload,
        pictureArg,
        shopDescription || undefined
      );

      const shopId: string = result.data._id;

      // Only upload file if no URL was provided
      if (!imageURL.trim() && imageFile) {
        setSubmitStep("uploading");
        await uploadImage(session.user.token, shopId, imageFile);
      }

      setSubmitStep("done");
    } catch {
      setSubmitStep("error");
      setError("Something went wrong. Please try again.");
    }
  }

  // ── button label ──────────────────────────────────────────────────────────
  const busy = submitStep === "creating" || submitStep === "uploading";

  const buttonLabel: Record<SubmitStep, React.ReactNode> = {
    idle: "Create Shop",
    creating: (
      <span className="flex items-center justify-center gap-2">
        <Spinner /> Creating shop…
      </span>
    ),
    uploading: (
      <span className="flex items-center justify-center gap-2">
        <Spinner /> Uploading image…
      </span>
    ),
    done: "✓ Shop Created",
    error: "Try Again",
  };

  // ── done state ────────────────────────────────────────────────────────────
  if (submitStep === "done") {
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
      {/* ── LEFT: image drop (desktop) ── */}
      <ImageDropZone
        imageURL={imageURL}
        onImageURLChange={setImageURL}
        previewURL={previewURL}
        onFileChange={handleFileChange}
        shopName={name}
        massageCount={massageTypes.length}
      />

      {/* ── RIGHT: form ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-8 pt-12 pb-8 border-b border-stone-800">
          <p className="text-[9px] tracking-[0.35em] text-amber-400 uppercase mb-2">
            ✦ New Listing
          </p>
          <h1 className="text-3xl font-light text-stone-100 tracking-tight">
            Register a Shop
          </h1>
        </div>

        <div className="px-8 py-8 space-y-10 flex-1">
          {/* mobile image */}
          <MobileImageDrop
            imageURL={imageURL}
            onImageURLChange={setImageURL}
            previewURL={previewURL}
            onFileChange={handleFileChange}
          />

          {/* Basics */}
          <div>
            <SectionLabel>Basics</SectionLabel>
            <div className="space-y-5">
              <Field
                label="Shop Name *"
                value={name}
                onChange={setName}
                placeholder="e.g. Serenity Massage"
              />
              <Field
                label="Phone Number *"
                value={tel}
                onChange={setTel}
                placeholder="0812345678"
                type="tel"
              />
              <Textarea
                label="Shop Description"
                value={shopDescription}
                onChange={setShopDescription}
                placeholder="Tell customers what makes your shop special..."
              />
            </div>
          </div>

          {/* Hours */}
          <div>
            <SectionLabel>Opening Hours</SectionLabel>
            <div className="grid grid-cols-2 gap-5">
              <Field
                label="Opens At *"
                value={open}
                onChange={setOpen}
                placeholder="09:00"
                type="time"
              />
              <Field
                label="Closes At *"
                value={close}
                onChange={setClose}
                placeholder="21:00"
                type="time"
              />
            </div>
          </div>

          <div>
            <SectionLabel>Address</SectionLabel>
            <div className="space-y-5">
              <Field
                label="Street *"
                value={street}
                onChange={setStreet}
                placeholder="715 Metz Road"
              />
              <div className="grid grid-cols-2 gap-5">
                <Field
                  label="District"
                  value={district}
                  onChange={setDistrict}
                  placeholder="Khlong Toei"
                />
                <Field
                  label="Province"
                  value={province}
                  onChange={setProvince}
                  placeholder="Bangkok"
                />
              </div>
              <Field
                label="Postal Code"
                value={postalcode}
                onChange={setPostalcode}
                placeholder="10110"
              />
            </div>
          </div>

          {/* Massage Types */}
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

          {error && (
            <p className="text-red-400 text-xs tracking-wide border-l-2 border-red-500 pl-3">
              {error}
            </p>
          )}
        </div>

        {/* ── footer ── */}
        <div className="sticky bottom-0 px-8 py-5 bg-[#0f0f0f] border-t border-stone-800">
          {busy && (
            <div className="flex items-center gap-2 mb-3">
              <Step
                active={submitStep === "creating"}
                done={submitStep === "uploading"}
                label="Create shop"
              />
              <div className="flex-1 h-px bg-stone-800" />
              <Step
                active={submitStep === "uploading"}
                done={false}
                label="Upload image"
              />
            </div>
          )}
          <button
            onClick={handleCreate}
            disabled={busy}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300
              disabled:bg-stone-700 disabled:cursor-not-allowed
              text-black disabled:text-stone-500 font-bold text-xs tracking-[0.25em] uppercase
              transition-all duration-200"
          >
            {buttonLabel[submitStep]}
          </button>
        </div>
      </div>
    </div>
  );
}