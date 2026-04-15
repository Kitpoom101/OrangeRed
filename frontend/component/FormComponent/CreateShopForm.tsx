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

type SubmitStep = "idle" | "creating" | "uploading" | "done" | "error";

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

  const handleFileChange = useCallback((file: File) => {
    setImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
  }, []);

  const addMassage = () => setMassageTypes((p) => [...p, emptyMassage()]);
  const removeMassage = (id: string) => setMassageTypes((p) => p.filter((m) => m._id !== id));
  const updateMassage = (id: string, field: keyof MassageType, value: string | number) =>
    setMassageTypes((p) => p.map((m) => (m._id === id ? { ...m, [field]: value } : m)));

  async function handleCreate() {
    setError("");
    if (!session) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }
    if (!name || !street || !tel || !open || !close) {
      setError("Please fill in all required fields.");
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

  const busy = submitStep === "creating" || submitStep === "uploading";

  const buttonLabel: Record<SubmitStep, React.ReactNode> = {
    idle: "Create Shop",
    creating: <span className="flex items-center justify-center gap-2"><Spinner /> Creating...</span>,
    uploading: <span className="flex items-center justify-center gap-2"><Spinner /> Uploading Image...</span>,
    done: "✓ Shop Created",
    error: "Try Again",
  };

  if (submitStep === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-4xl text-gold animate-pulse">✦</div>
          <p className="text-gold tracking-[0.4em] uppercase text-[10px] font-bold">
            Project Registered
          </p>
          <p className="text-text-sub text-[11px] font-light tracking-[0.2em] uppercase italic">{name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-stretch font-['DM_Sans',sans-serif]">
      <ImageDropZone
        imageURL={imageURL}
        onImageURLChange={setImageURL}
        previewURL={previewURL}
        onFileChange={handleFileChange}
        shopName={name}
        massageCount={massageTypes.length}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header Section */}
        <div className="px-10 pt-16 pb-10 border-b border-card-border/50">
          <p className="text-[8px] tracking-[0.5em] text-gold uppercase mb-3 font-bold">
            ✦ New Establishment
          </p>
          <h1 className="text-4xl font-extralight text-text-main tracking-tight italic">
            Register Shop
          </h1>
        </div>

        <div className="px-10 py-12 space-y-16 flex-1 max-w-3xl">
          <MobileImageDrop
            imageURL={imageURL}
            onImageURLChange={setImageURL}
            previewURL={previewURL}
            onFileChange={handleFileChange}
          />

          {/* Basics */}
          <section>
            <SectionLabel>Information</SectionLabel>
            <div className="space-y-8">
              <Field label="Studio Name *" value={name} onChange={setName} placeholder="e.g. Aura Wellness" />
              <Field label="Phone *" value={tel} onChange={setTel} placeholder="08XXXXXXXX" type="tel" />
              <Textarea label="Narrative" value={shopDescription} onChange={setShopDescription} placeholder="Describe the atmosphere..." />
            </div>
          </section>

          {/* Hours */}
          <section>
            <SectionLabel>Operating Hours</SectionLabel>
            <div className="grid grid-cols-2 gap-10">
              <Field label="Opens *" value={open} onChange={setOpen} type="time" />
              <Field label="Closes *" value={close} onChange={setClose} type="time" />
            </div>
          </section>

          {/* Address */}
          <section>
            <SectionLabel>Location</SectionLabel>
            <div className="space-y-8">
              <Field label="Street & No. *" value={street} onChange={setStreet} placeholder="123 Serenity Blvd" />
              <div className="grid grid-cols-2 gap-10">
                <Field label="District" value={district} onChange={setDistrict} placeholder="Pathum Wan" />
                <Field label="Province" value={province} onChange={setProvince} placeholder="Bangkok" />
              </div>
              <Field label="Postal" value={postalcode} onChange={setPostalcode} placeholder="10XXX" />
            </div>
          </section>

          {/* Massage Types */}
          <section>
            <SectionLabel>Service Catalog</SectionLabel>
            <div className="space-y-4">
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
                className="w-full py-4 border border-dashed border-card-border hover:border-gold/50
                  text-text-sub/40 hover:text-gold text-[9px] tracking-[0.4em] uppercase
                  transition-all duration-500 rounded-sm flex items-center justify-center gap-3 bg-card/5"
              >
                <span className="text-sm font-light">+</span> Add Service Type
              </button>
            </div>
          </section>

          {error && (
            <p className="text-red-400 text-[10px] tracking-[0.2em] uppercase border-l border-red-500/50 pl-4 py-1 italic">
              — {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-10 py-6 bg-background/80 backdrop-blur-md border-t border-card-border/50">
          {busy && (
            <div className="flex items-center gap-4 mb-4">
              <Step active={submitStep === "creating"} done={submitStep === "uploading"} label="Protocol: Creation" />
              <div className="flex-1 h-px bg-card-border/30" />
              <Step active={submitStep === "uploading"} done={false} label="Protocol: Asset Upload" />
            </div>
          )}
          <button
            onClick={handleCreate}
            disabled={busy}
            className="w-full py-4 bg-gold hover:bg-gold/90
              disabled:bg-card-border/20 disabled:cursor-not-allowed
              text-background disabled:text-text-sub/30 font-bold text-[10px] tracking-[0.5em] uppercase
              transition-all duration-700 shadow-lg shadow-gold/5"
          >
            {buttonLabel[submitStep]}
          </button>
        </div>
      </div>
    </div>
  );
}