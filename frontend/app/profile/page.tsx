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

  useEffect(() => {
    if (!session?.user?.token) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`, {
      headers: { authorization: `Bearer ${session.user.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const profile = {
            name: data.data.name ?? "",
            email: data.data.email ?? "",
            tel: data.data.tel ?? "",
          };
          setProfilePicture(data.data.profilePicture ?? null);
          setDisplayProfile(profile);
          setDraftProfile(profile);
        }
      })
      .catch(() => {});
  }, [session?.user?.token]);

  const handleSaveUrl = async () => {
    if (!urlInput.trim() || !session?.user?.token) return;

    setSaving(true);
    setError(null);

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
        }
      );
      const data = await res.json();
      if (data.success) {
        setProfilePicture(data.profilePicture);
        await update({ profilePicture: data.profilePicture });
        setShowUrlInput(false);
        setUrlInput("");
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${session.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono uppercase tracking-[0.2em] text-xs">
        Verifying Identity...
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-8">
        <div className="w-16 h-[1px] bg-blue-500/30 mb-8" />
        <h2 className="text-xs uppercase tracking-[0.4em] text-gray-400 font-light mb-4">
          Identity Required
        </h2>
        <p className="max-w-xs text-center text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-10 leading-relaxed">
          Please login to view your profile
        </p>
        <div className="flex flex-col gap-4 w-full max-w-[260px]">
          <button
            onClick={() => signIn()}
            className="w-full py-4 bg-blue-600/10 border border-blue-500/50 text-blue-400 text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all duration-500 rounded-sm shadow-lg shadow-blue-900/20"
          >
            Sign In
          </button>
          <Link
            href="/register"
            className="w-full py-4 bg-transparent border border-gray-700/50 text-gray-400 text-[10px] text-center uppercase tracking-[0.3em] hover:border-gray-500 hover:text-white transition-all duration-500 rounded-sm"
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

  const initials = (displayProfile.name || session.user.name)
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <main className="min-h-screen bg-[#0f172a] text-white pb-24 px-8 pt-6 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          href="/"
          className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all duration-300"
        >
          <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">
            ?
          </span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4">
          Member Profile
        </h1>
        <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
          Registry Details & Account Identity
        </p>
        <div className="h-[1px] w-16 bg-blue-900/50 mx-auto mt-8" />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative bg-[#1e2d3d]/40 border border-gray-700/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-blue-900 via-blue-500/40 to-blue-900" />

          <button
            type="button"
            onClick={handleOpenInfoEditor}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-[#0f172a]/90 text-blue-300 shadow-lg shadow-black/20 transition-all duration-300 hover:border-blue-400 hover:bg-[#15203a] hover:text-white"
            aria-label="Edit profile details"
            title="Edit profile details"
          >
            <BsPencil className="h-4 w-4" />
          </button>

          <div className="p-10 space-y-10" ref={infoEditorRef} onBlur={handleInfoBlur}>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700/50">
                {profilePicture ? (
                  <Image
                    src={session.user?.profilePicture!}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1e3a5f] flex items-center justify-center text-blue-300 text-2xl font-serif select-none">
                    {initials}
                  </div>
                )}
              </div>

              {isEditingInfo ? (
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="w-full bg-[#0f172a] border border-gray-700 text-gray-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveUrl}
                      disabled={saving}
                      className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all rounded-sm"
                    >
                      {saving ? "Saving..." : "Save Photo"}
                    </button>
                    <button
                      onClick={closeAvatarEditor}
                      className="px-4 py-1.5 border border-gray-700 text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-all rounded-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : null}

              {error && (
                <p className="text-[10px] text-red-400 uppercase tracking-widest">{error}</p>
              )}
            </div>

            <div>
              {/* Name & Role */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-blue-400 font-semibold">Account Holder</p>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      value={draftProfile.name}
                      onChange={(e) => setDraftProfile((prev) => ({ ...prev, name: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSaveInfo();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          handleCancelInlineEdit();
                        }
                      }}
                      autoFocus
                      className="w-full bg-transparent border-b border-blue-500/60 text-2xl font-serif text-gray-100 focus:outline-none"
                      aria-label="Edit name"
                    />
                  ) : (
                    <p className="text-left text-2xl font-serif text-gray-100">
                      {displayProfile.name || session.user.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-semibold">Access Level</p>
                  <span className={`text-[10px] font-mono px-3 py-1 rounded-full border ${
                    session.user.role === "admin"
                      ? "border-blue-500/50 text-blue-400"
                      : "border-gray-700 text-gray-400"
                  } uppercase tracking-widest mt-1 inline-block`}>
                    {session.user.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                <div className="space-y-1">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Email Address</p>
                  {isEditingInfo ? (
                    <input
                      type="email"
                      value={draftProfile.email}
                      onChange={(e) => setDraftProfile((prev) => ({ ...prev, email: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSaveInfo();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          handleCancelInlineEdit();
                        }
                      }}
                      className="w-full bg-transparent border-b border-blue-500/60 text-sm font-light text-gray-200 tracking-wide focus:outline-none"
                      aria-label="Edit email"
                    />
                  ) : (
                    <p className="text-left text-sm font-light text-gray-200 tracking-wide">
                      {displayProfile.email || "Unregistered"}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Contact Number</p>
                  {isEditingInfo ? (
                    <input
                      type="tel"
                      value={draftProfile.tel}
                      onChange={(e) => setDraftProfile((prev) => ({ ...prev, tel: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleSaveInfo();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          handleCancelInlineEdit();
                        }
                      }}
                      className="w-full bg-transparent border-b border-blue-500/60 text-sm font-mono text-gray-200 focus:outline-none"
                      aria-label="Edit contact number"
                    />
                  ) : (
                    <p className="text-left text-sm font-mono text-gray-200">
                      {displayProfile.tel || "Unregistered"}
                    </p>
                  )}
                </div>
              </div>

              {isEditingInfo ? (
                <div className="flex gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => void handleSaveInfo()}
                    disabled={infoSaving}
                    className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all rounded-sm disabled:opacity-60"
                  >
                    {infoSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelInlineEdit}
                    disabled={infoSaving}
                    className="px-4 py-1.5 border border-gray-700 text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-all rounded-sm disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>

            {infoSuccess ? (
              <p className="text-[9px] text-emerald-400 uppercase tracking-[0.2em]">{infoSuccess}</p>
            ) : null}
            {infoSaving ? (
              <p className="text-[9px] text-blue-300 uppercase tracking-[0.2em]">Saving...</p>
            ) : null}
            {infoError ? (
              <p className="text-[10px] text-red-400 uppercase tracking-widest">{infoError}</p>
            ) : null}

            {/* Footer */}
            <div className="pt-8 border-t border-gray-700/30 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.2em] text-gray-600">Member Status</p>
                <p className="text-[10px] text-gray-400 italic uppercase tracking-widest">— Verified Identity —</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group flex flex-col items-end"
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-red-500/70 group-hover:text-red-400 transition-colors">
                  Log out
                </span>
                <div className="h-[1px] w-0 bg-red-500/50 group-hover:w-full transition-all duration-300 mt-1" />
              </button>
            </div>

          </div>
        </div>

        <p className="mt-8 text-center text-[9px] uppercase tracking-[0.4em] text-gray-600 italic">
          Bespoke Wellness � Premium Registry
        </p>
      </div>
    </main>
  );
}
