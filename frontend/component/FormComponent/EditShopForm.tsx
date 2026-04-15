"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MassageType } from "@/libs/shops/createShop";
import updateShop from "@/libs/shops/updateShop";
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

export interface ShopData {
  _id: string;
  name: string;
  shopDescription?: string;
  address: {
    street: string;
    district?: string;
    province?: string;
    postalcode?: string;
  };
  tel: string;
  openClose: {
    open: string;
    close: string;
  };
  picture?: string;
  massageType: (MassageType & { _id: string })[];
}

export interface EditShopFormProps {
  shop: ShopData;
  onSuccess?: (shopId: string) => void;
}

type SubmitStep = "idle" | "saving" | "uploading" | "done" | "error";

export default function EditShopForm({ shop, onSuccess }: EditShopFormProps) {
  const [name, setName] = useState(shop.name);
  const [shopDescription, setShopDescription] = useState(shop.shopDescription ?? "");
  const [street, setStreet] = useState(shop.address.street);
  const [district, setDistrict] = useState(shop.address.district ?? "");
  const [province, setProvince] = useState(shop.address.province ?? "");
  const [postalcode, setPostalcode] = useState(shop.address.postalcode ?? "");
  const [tel, setTel] = useState(shop.tel);
  const [open, setOpen] = useState(shop.openClose.open);
  const [close, setClose] = useState(shop.openClose.close);
  const [imageURL, setImageURL] = useState(shop.picture ?? "");
  const [massageTypes, setMassageTypes] = useState<(MassageType & { _id: string })[]>(
    shop.massageType.length > 0 ? shop.massageType : [emptyMassage()]
  );

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

  async function handleSave() {
    setError("");
    if (!session) return;
    if (!name || !street || !tel || !open || !close) {
      setError("Please ensure all essential fields are completed.");
      return;
    }

    try {
      setSubmitStep("saving");
      const payload = massageTypes.map(({ _id, ...rest }) => rest);
      const pictureArg = imageURL.trim() || undefined;

      await updateShop(
        session.user.token,
        shop._id,
        name,
        { street, district, province, postalcode },
        tel,
        { open, close },
        payload,
        pictureArg,
        shopDescription || undefined
      );

      if (!imageURL.trim() && imageFile) {
        setSubmitStep("uploading");
        await uploadImage(session.user.token, shop._id, imageFile);
      }

      setSubmitStep("done");
      onSuccess?.(shop._id);
    } catch {
      setSubmitStep("error");
      setError("An unexpected error occurred during the registry update.");
    }
  }

  const busy = submitStep === "saving" || submitStep === "uploading";

  const buttonLabel: Record<SubmitStep, React.ReactNode> = {
    idle: "Update Registry",
    saving: <span className="flex items-center justify-center gap-2"><Spinner /> Syncing Data…</span>,
    uploading: <span className="flex items-center justify-center gap-2"><Spinner /> Processing Media…</span>,
    done: "✓ Successfully Updated",
    error: "Retry Synchronization",
  };

  // ── Success View (Luxury Mode) ──
  if (submitStep === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="max-w-md w-full text-center space-y-10">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
             <div className="relative text-6xl text-gold animate-pulse">✦</div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-white font-serif text-2xl tracking-[0.2em] uppercase">Changes Authorized</h2>
            <p className="text-stone-500 text-[10px] tracking-[0.3em] uppercase">The shop profile has been successfully updated in our registry.</p>
          </div>

          <div className="h-[1px] w-12 bg-gold/30 mx-auto" />

          <div className="grid grid-cols-1 gap-4 pt-4">
            <Link 
              href={`/shop/${shop._id}`}
              className="py-4 bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.4em] hover:bg-gold hover:text-black transition-all duration-500"
            >
              View Updated Shop
            </Link>
            <Link 
              href="/shop"
              className="py-4 border border-stone-800 text-stone-500 text-[10px] uppercase tracking-[0.4em] hover:text-white hover:border-stone-600 transition-all duration-500"
            >
              Return to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-background flex items-stretch font-['DM_Sans',sans-serif] selection:bg-gold/30">
      {/* ── LEFT: image drop (Desktop) ── */}
      <ImageDropZone
        imageURL={imageURL}
        onImageURLChange={setImageURL}
        previewURL={previewURL}
        onFileChange={handleFileChange}
        shopName={name}
        massageCount={massageTypes.length}
      />

      {/* ── RIGHT: form ── */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-background transition-colors duration-500">
        
        {/* Header Section */}
        <div className="px-10 pt-16 pb-10 border-b border-card-border bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-gold" />
            <p className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold italic">Registry Editor</p>
          </div>
          <h1 className="text-4xl font-serif text-text-main tracking-tight">
            Modify <span className="italic font-light text-text-sub">{name}</span>
          </h1>
          <p className="text-text-sub/60 text-[10px] tracking-[0.2em] mt-4 uppercase">Ref ID: {shop._id}</p>
        </div>

        <div className="px-10 py-12 space-y-20 flex-1 max-w-4xl">
          <MobileImageDrop
            imageURL={imageURL}
            onImageURLChange={setImageURL}
            previewURL={previewURL}
            onFileChange={handleFileChange}
          />

          <div className="flex items-center gap-4 text-[10px] tracking-[0.3em] text-text-sub uppercase italic">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Authorized changes will be synchronized with the live directory
          </div>

          {/* Section: Basics */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
               <SectionLabel><span className="text-text-main opacity-90">Core Identity</span></SectionLabel>
               <div className="h-px flex-1 bg-gradient-to-r from-card-border to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-text-main">
              <Field label="Shop Identity *" value={name} onChange={setName} placeholder="Registry Name" />
              <Field label="Contact Line *" value={tel} onChange={setTel} placeholder="08X XXX XXXX" type="tel" />
              <div className="md:col-span-2">
                <Textarea label="Narrative Description" value={shopDescription} onChange={setShopDescription} placeholder="Describe the essence of your establishment..." />
              </div>
            </div>
          </section>

          {/* Section: Hours */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
               <SectionLabel><span className="text-text-main opacity-90">Availability</span></SectionLabel>
               <div className="h-px flex-1 bg-gradient-to-r from-card-border to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-10 text-text-main">
              <Field label="Opening Time *" value={open} onChange={setOpen} type="time" />
              <Field label="Closing Time *" value={close} onChange={setClose} type="time" />
            </div>
          </section>

          {/* Section: Location */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
               <SectionLabel><span className="text-text-main opacity-90">Location Details</span></SectionLabel>
               <div className="h-px flex-1 bg-gradient-to-r from-card-border to-transparent" />
            </div>
            <div className="space-y-8 text-text-main">
              <Field label="Street Address *" value={street} onChange={setStreet} placeholder="Street, Building, Floor" />
              <div className="grid grid-cols-2 gap-10">
                <Field label="District" value={district} onChange={setDistrict} placeholder="District" />
                <Field label="Province" value={province} onChange={setProvince} placeholder="Bangkok" />
              </div>
              <Field label="Postal Code" value={postalcode} onChange={setPostalcode} placeholder="10XXX" />
            </div>
          </section>

          {/* Section: Massage Types */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
               <SectionLabel><span className="text-text-main opacity-90">Service Menu</span></SectionLabel>
               <div className="h-px flex-1 bg-gradient-to-r from-card-border to-transparent" />
            </div>
            
            <div className="grid gap-5">
              {massageTypes.map((item, index) => (
                <div key={item._id} className="bg-card/40 rounded-xl border border-card-border p-1 hover:border-gold/30 transition-all duration-500 shadow-sm">
                   <MassageCard 
                    index={index} 
                    item={item} 
                    onChange={updateMassage} 
                    onRemove={removeMassage} 
                    canRemove={massageTypes.length > 1} 
                   />
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMassage}
                className="w-full py-5 border border-dashed border-card-border hover:border-gold/50 text-text-sub hover:text-gold text-[10px] uppercase tracking-[0.4em] transition-all duration-500 rounded-lg flex items-center justify-center gap-3 group bg-card/20 hover:bg-card/40"
              >
                <span className="text-lg group-hover:scale-125 transition-transform">+</span>
                Add Service Type
              </button>
            </div>
          </section>

          {error && (
            <div className="flex items-center gap-3 text-red-500 text-[10px] tracking-widest uppercase bg-red-500/5 p-4 border-l-2 border-red-500">
              {error}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="sticky bottom-0 px-10 py-8 bg-background/80 backdrop-blur-xl border-t border-card-border">
          {busy && (
            <div className="flex items-center gap-6 mb-8">
              <Step active={submitStep === "saving"} done={submitStep === "uploading"} label="Authorization" />
              <div className="flex-1 h-[1px] bg-card-border" />
              <Step active={submitStep === "uploading"} done={false} label="Media Processing" />
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={busy}
            className="w-full py-5 bg-gold text-background font-bold text-[11px] uppercase tracking-[0.5em] transition-all duration-700 hover:brightness-110 disabled:bg-card-border disabled:text-text-sub rounded-sm shadow-[0_10px_30px_rgba(212,175,55,0.1)] active:scale-[0.99]"
          >
            {buttonLabel[submitStep]}
          </button>
        </div>
      </div>
    </div>
  );
}