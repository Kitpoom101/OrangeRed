"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import BsPencil from "@/component/icons/edit";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSuccess, setInfoSuccess] = useState<string | null>(null);
  const infoEditorRef = useRef<HTMLDivElement | null>(null);
  const [displayProfile, setDisplayProfile] = useState({
    name: "",
    email: "",
    tel: "",
  });
  const [draftProfile, setDraftProfile] = useState({
    name: "",
    email: "",
    tel: "",
  });

  const openAvatarEditor = () => {
    setShowUrlInput(true);
    setUrlInput(profilePicture ?? "");
    setError(null);
  };

  const closeAvatarEditor = () => {
    setShowUrlInput(false);
    setUrlInput("");
    setError(null);
  };

  useEffect(() => {
    if (!session?.user) return;
    const profile = {
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      tel: session.user.tel ?? "",
    };
    setDisplayProfile(profile);
    setDraftProfile(profile);
  }, [session?.user]);

  // Sync from session — only accept http/https URLs to avoid Next.js image crashes
  useEffect(() => {
    const raw = session?.user?.profilePicture ?? null;
    const isValid = !!raw && /^https?:\/\//i.test(raw);
    setProfilePicture(isValid ? raw : null);
  }, [session?.user?.profilePicture]);

  const handleSaveUrl = async () => {
    if (!urlInput.trim() || !session?.user?.token) return;

    try {
      new URL(urlInput.trim());
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setSaving(true);
    setError(null);
    setInfoSuccess(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/avatar`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${session.user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profilePictureUrl: urlInput.trim() }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setProfilePicture(data.profilePicture);
        await update({ profilePicture: data.profilePicture });
        setShowUrlInput(false);
        setUrlInput("");
        
        setInfoSuccess("Identity Updated Successfully"); 
        
      } else {
        setError(data.message ?? "Failed to save");
      }
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenInfoEditor = () => {
    setDraftProfile(displayProfile);
    setInfoError(null);
    setInfoSuccess(null);
    setIsEditingInfo(true);
  };

  const handleCancelInlineEdit = () => {
    setDraftProfile(displayProfile);
    setInfoError(null);
    setInfoSuccess(null);
    setIsEditingInfo(false);
  };

  const handleInfoBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!isEditingInfo) return;
    const nextFocused = e.relatedTarget as Node | null;

    if (nextFocused && infoEditorRef.current?.contains(nextFocused)) {
      return;
    }

    handleCancelInlineEdit();
  };

  const handleSaveInfo = async () => {
    if (!session?.user?.token) return;

    const payload = {
      name: draftProfile.name.trim(),
      email: draftProfile.email.trim(),
      tel: draftProfile.tel.trim(),
    };

    if (!payload.name || !payload.email || !payload.tel) {
      setInfoError("Name, email and number are required");
      return;
    }

    setInfoSaving(true);
    setInfoError(null);
    setInfoSuccess(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${session.user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setInfoError(data.message ?? "Failed to update profile");
        return;
      }

      const profile = {
        name: data.data.name ?? payload.name,
        email: data.data.email ?? payload.email,
        tel: data.data.tel ?? payload.tel,
      };

      setDisplayProfile(profile);
      setDraftProfile(profile);
      await update(profile);
      setIsEditingInfo(false);
      setInfoSuccess("Profile updated");
    } catch {
      setInfoError("Failed to update profile");
    } finally {
      setInfoSaving(false);
    }
  };

  // 1. Loading State: เปลี่ยนพื้นหลังและสีตัวหนังสือ
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-text-sub flex items-center justify-center font-mono uppercase tracking-[0.2em] text-xs transition-colors duration-500">
        <div className="animate-pulse">Verifying Identity...</div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!session) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-8 transition-colors duration-500">
        <div className="w-16 h-[1px] bg-accent/30 mb-8" />
        <h2 className="text-xs uppercase tracking-[0.4em] text-text-sub font-light mb-4">
          Identity Required
        </h2>
        <p className="max-w-xs text-center text-[10px] uppercase tracking-[0.2em] text-text-sub/60 mb-10 leading-relaxed">
          Please login to view your profile
        </p>
        <div className="flex flex-col gap-4 w-full max-w-[260px]">
          <button
            onClick={() => signIn()}
            className="w-full py-4 bg-accent/10 border border-accent/50 text-accent text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all duration-500 rounded-sm"
          >
            Sign In
          </button>
          <Link
            href="/register"
            className="w-full py-4 bg-transparent border border-card-border text-text-sub text-[10px] text-center uppercase tracking-[0.3em] hover:border-text-sub hover:text-text-main transition-all duration-500 rounded-sm"
          >
            Register
          </Link>
          <Link
            href="/"
            className="mt-4 text-center text-[9px] uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors"
          >
            Return to Home
          </Link>
        </div>
        <div className="mt-16 flex items-center gap-4 opacity-20">
          <div className="h-[1px] w-8 bg-white" />
          <p className="text-[8px] text-white uppercase tracking-[0.6em] italic">
            Private Access
          </p>
          <div className="h-[1px] w-8 bg-white" />
        </div>
      </main>
    );
  }

  const initials =
    (displayProfile.name || session.user.name)
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 px-8 pt-6 animate-in fade-in duration-700 transition-colors duration-500">
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          href="/"
          className="group inline-flex items-center text-[11px] uppercase tracking-[0.4em] text-text-sub hover:text-text-main transition-all duration-300"
        >
          <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4 text-text-main">
          Member Profile
        </h1>
        <p className="text-text-sub uppercase tracking-[0.3em] text-[10px] opacity-70">
          Registry Details & Account Identity
        </p>
        <div className="h-[1px] w-16 bg-gold/30 mx-auto mt-8" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500">
          <div className="h-1 w-full bg-gradient-to-r from-accent via-gold/50 to-accent" />

          <button
            type="button"
            onClick={handleOpenInfoEditor}
            className="absolute right-6 top-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-background/60 text-gold shadow-lg backdrop-blur-md transition-all duration-500 hover:border-gold hover:bg-gold hover:text-background z-10"
            aria-label="Edit profile details"
          >
            <BsPencil className="h-4 w-4" />
          </button>

          <div
            className="p-12 space-y-12"
            ref={infoEditorRef}
            onBlur={handleInfoBlur}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-28 h-28 rounded-full p-[2px] bg-gradient-to-b from-gold/40 to-transparent shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <div className="relative w-full h-full rounded-full overflow-hidden border border-card-border bg-surface">
                  {profilePicture ? (
                    <Image
                      src={session.user?.profilePicture!}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold text-3xl font-serif select-none">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              {isEditingInfo && (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm animate-in fade-in zoom-in-95 duration-300">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://image-url.com/avatar.png"
                    className="w-full bg-background/50 border-b border-card-border text-text-main text-[11px] px-2 py-2 focus:outline-none focus:border-gold transition-colors text-center font-mono"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveUrl}
                      disabled={saving}
                      className="px-6 py-2 bg-gold/10 border border-gold/30 text-gold text-[9px] uppercase tracking-[0.3em] hover:bg-gold hover:text-background transition-all rounded-full disabled:opacity-50"
                    >
                      {saving ? "Processing..." : "Update Portrait"}
                    </button>
                    <button
                      onClick={closeAvatarEditor}
                      className="px-6 py-2 border border-card-border text-text-sub text-[9px] uppercase tracking-[0.3em] hover:text-text-main transition-all rounded-full"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-10">
              {/* Name & Role Section */}
              <div className="flex justify-between items-end border-b border-card-border pb-6">
                <div className="space-y-2">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gold font-bold">
                    Account Holder
                  </p>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      value={draftProfile.name}
                      onChange={(e) =>
                        setDraftProfile((p) => ({ ...p, name: e.target.value }))
                      }
                      autoFocus
                      className="bg-transparent border-b border-gold/40 text-2xl font-serif text-text-main focus:outline-none py-1"
                    />
                  ) : (
                    <h2
                      className="text-3xl font-serif text-text-main tracking-tight"
                      aria-label="User display name"
                      data-testid="profile-name"
                    >
                      {displayProfile.name || session.user.name}
                    </h2>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-text-sub font-bold">
                    Access Level
                  </p>
                  <span
                    className={`text-[9px] font-mono px-4 py-1.5 rounded-full border border-card-border uppercase tracking-[0.2em] inline-block ${
                      session.user.role === "admin"
                        ? "text-accent border-accent/30 bg-accent/5"
                        : "text-text-sub"
                    }`}
                  >
                    {session.user.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  {
                    label: "Email Address",
                    key: "email",
                    value: displayProfile.email,
                    type: "email",
                  },
                  {
                    label: "Contact Number",
                    key: "tel",
                    value: displayProfile.tel,
                    type: "tel",
                  },
                ].map((field) => (
                  <div key={field.key} className="space-y-2 group">
                    <p className="text-[8px] uppercase tracking-[0.4em] text-text-sub font-bold">
                      {field.label}
                    </p>
                    {isEditingInfo ? (
                      <input
                        type={field.type}
                        value={
                          draftProfile[field.key as keyof typeof draftProfile]
                        }
                        onChange={(e) =>
                          setDraftProfile((p) => ({
                            ...p,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full bg-transparent border-b border-gold/40 text-[13px] text-text-main focus:outline-none py-1 transition-all"
                      />
                    ) : (
                      <p className="text-[13px] font-light text-text-main tracking-wide py-1 border-b border-transparent group-hover:border-card-border transition-all">
                        {field.value || "Not Provided"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isEditingInfo && (
  <div className="flex justify-center gap-4 mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
    <button
      onClick={handleSaveInfo}
      disabled={infoSaving}
      className="px-8 py-2 bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-background transition-all duration-500 rounded-full disabled:opacity-50"
    >
      {infoSaving ? "Saving..." : "Confirm Changes"}
    </button>
    
    <button
      onClick={handleCancelInlineEdit}
      className="px-8 py-2 border border-card-border text-text-sub text-[10px] uppercase tracking-[0.3em] hover:text-text-main transition-all duration-500 rounded-full"
    >
      Cancel
    </button>
  </div>
)}

            {(infoSuccess || infoError || infoSaving) && (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-2">
                {infoSaving && (
                  <p className="text-[9px] text-accent uppercase tracking-[0.3em] italic">
                    Synchronizing Registry...
                  </p>
                )}
                {infoSuccess && (
                  <p className="text-[9px] text-emerald-500 uppercase tracking-[0.3em]">
                    Identity Updated Successfully
                  </p>
                )}
                {infoError && (
                  <p className="text-[9px] text-red-500 uppercase tracking-[0.3em]">
                    {infoError}
                  </p>
                )}
              </div>
            )}

            <div className="pt-10 border-t border-card-border flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.4em] text-text-sub/40">
                  Registry Status
                </p>
                <p className="text-[10px] text-gold italic uppercase tracking-[0.2em]">
                  — Verified Member —
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group flex flex-col items-end"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-red-500/60 group-hover:text-red-500 transition-colors font-bold">
                  Sign Out
                </span>
                <div className="h-[1px] w-0 bg-red-500 group-hover:w-full transition-all duration-500 mt-1" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[9px] uppercase tracking-[0.5em] text-text-sub/40 italic">
          Bespoke Wellness — Premium Registry System
        </p>
      </div>
    </main>
  );
}
