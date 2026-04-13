"use client";

import { useState, useCallback, useEffect } from "react";
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

  // 1. Memory Leak Cleanup: ทำความสะอาด Object URL เมื่อปิดคอมโพเนนต์
  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleFileChange = useCallback((file: File) => {
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
  }, []);

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

  async function handleCreate() {
    setError("");

    if (!session) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }
    // Validation Logic...
    if (!name || !street || !tel || !open || !close) {
      setError("Please fill in all required fields.");
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
    } catch (err) {
      setSubmitStep("error");
      setError("Something went wrong. Please check your connection.");
    }
  }

  const busy = submitStep === "creating" || submitStep === "uploading";

  const buttonLabel: Record<SubmitStep, React.ReactNode> = {
    idle: "Register Shop",
    creating: <span className="flex items-center gap-2"><Spinner /> Creating...</span>,
    uploading: <span className="flex items-center gap-2"><Spinner /> Uploading Image...</span>,
    done: "✓ Registration Complete",
    error: "Retry Registration",
  };

  if (submitStep === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-500">
        <div className="text-center space-y-6">
          <div className="text-6xl text-accent animate-bounce">✦</div>
          <p className="text-accent tracking-[0.4em] uppercase text-sm font-bold">Shop Created Successfully</p>
          <p className="text-text-sub text-xs tracking-widest italic">{name}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 text-[10px] uppercase tracking-widest text-text-sub border-b border-text-sub/30 hover:text-accent hover:border-accent transition-all"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    // 2. ปรับสีพื้นหลังให้เป็น bg-background
    <div className="min-h-screen bg-background flex items-stretch font-sans transition-colors duration-500">
      
      {/* LEFT: Image Area */}
      <ImageDropZone
        imageURL={imageURL}
        onImageURLChange={setImageURL}
        previewURL={previewURL}
        onFileChange={handleFileChange}
        shopName={name}
        massageCount={massageTypes.length}
      />

      {/* RIGHT: Form Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-card/20">
        <div className="px-8 pt-16 pb-8 border-b border-card-border/50">
          <p className="text-[9px] tracking-[0.4em] text-accent uppercase mb-3 font-bold">
            ✦ New Listing
          </p>
          <h1 className="text-4xl font-serif text-text-main tracking-tight italic">
            Register your Haven
          </h1>
        </div>

        <div className="px-8 py-10 space-y-12 flex-1">
          <MobileImageDrop
            imageURL={imageURL}
            onImageURLChange={setImageURL}
            previewURL={previewURL}
            onFileChange={handleFileChange}
          />

          <section>
            <SectionLabel>Basic Information</SectionLabel>
            <div className="space-y-6">
              <Field label="Shop Name *" value={name} onChange={setName} placeholder="Serenity Oasis" />
              <Field label="Phone Number *" value={tel} onChange={setTel} placeholder="08xxxxxxxx" type="tel" />
              <Textarea label="Shop Description" value={shopDescription} onChange={setShopDescription} placeholder="Share the essence of your wellness center..." />
            </div>
          </section>

          <section>
            <SectionLabel>Business Hours</SectionLabel>
            <div className="grid grid-cols-2 gap-6">
              <Field label="Opens At *" value={open} onChange={setOpen} type="time" />
              <Field label="Closes At *" value={close} onChange={setClose} type="time" />
            </div>
          </section>

          <section>
            <SectionLabel>Location Details</SectionLabel>
            <div className="space-y-6">
              <Field label="Street Address *" value={street} onChange={setStreet} placeholder="123 Sukhumvit Rd." />
              <div className="grid grid-cols-2 gap-6">
                <Field label="District" value={district} onChange={setDistrict} placeholder="Watthana" />
                <Field label="Province" value={province} onChange={setProvince} placeholder="Bangkok" />
              </div>
              <Field label="Postal Code" value={postalcode} onChange={setPostalcode} placeholder="10110" />
            </div>
          </section>

          <section>
            <SectionLabel>Service Menu</SectionLabel>
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
                className="w-full py-4 border border-dashed border-card-border hover:border-accent
                  text-text-sub hover:text-accent text-[10px] tracking-[0.2em] uppercase
                  transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-surface/20"
              >
                <span className="text-lg">+</span> Add Treatment Type
              </button>
            </div>
          </section>

          {error && (
            <div className="bg-red-500/5 border-l-4 border-red-500 p-4">
              <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 px-8 py-6 bg-background/80 backdrop-blur-md border-t border-card-border transition-colors">
          {busy && (
            <div className="flex items-center gap-4 mb-4">
              <Step active={submitStep === "creating"} done={submitStep === "uploading"} label="Profile" />
              <div className="flex-1 h-[1px] bg-card-border" />
              <Step active={submitStep === "uploading"} done={false} label="Media" />
            </div>
          )}
          <button
            onClick={handleCreate}
            disabled={busy}
            className="w-full py-4 bg-accent hover:opacity-90 disabled:bg-card-border
              text-white disabled:text-text-sub font-bold text-[10px] tracking-[0.3em] uppercase
              transition-all duration-300 rounded-xl shadow-xl shadow-accent/10"
          >
            {buttonLabel[submitStep]}
          </button>
        </div>
      </div>
    </div>
  );
}