"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.token) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`, {
      headers: { authorization: `Bearer ${session.user.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProfilePicture(data.data.profilePicture ?? null);
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
        </div>
      </main>
    );
  }

  const initials = session.user.name
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
          className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-text-sub hover:text-text-main transition-all duration-300"
        >
          <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4 text-text-main">
          Member Profile
        </h1>
        <p className="text-text-sub uppercase tracking-[0.2em] text-[10px]">
          Registry Details & Account Identity
        </p>
        {/* ใช้สีทอง (gold) เป็นจุดเน้น */}
        <div className="h-[1px] w-16 bg-gold/30 mx-auto mt-8" />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-card-border rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl transition-colors duration-300">
          <div className="h-1 w-full bg-gradient-to-r from-accent via-gold/50 to-accent" />

          <div className="p-10 space-y-10">

            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-card-border bg-surface">
                {profilePicture ? (
                  <Image src={profilePicture} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold text-2xl font-serif select-none">
                    {initials}
                  </div>
                )}
              </div>

              {showUrlInput ? (
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="w-full bg-background border border-card-border text-text-main text-xs px-3 py-2 rounded focus:outline-none focus:border-accent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveUrl}
                      disabled={saving}
                      className="px-4 py-1.5 bg-accent/20 border border-accent/50 text-accent text-[10px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all rounded-sm"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setShowUrlInput(false); setUrlInput(""); setError(null); }}
                      className="px-4 py-1.5 border border-card-border text-text-sub text-[10px] uppercase tracking-widest hover:text-text-main transition-all rounded-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowUrlInput(true)}
                  className="text-[9px] text-text-sub uppercase tracking-[0.2em] hover:text-accent transition-colors"
                >
                  Change photo URL
                </button>
              )}
            </div>

            {/* Name & Role */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.3em] text-accent font-bold">Account Holder</p>
                <h2 className="text-2xl font-serif text-text-main">{session.user.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase tracking-[0.3em] text-text-sub font-semibold">Access Level</p>
                <span className={`text-[10px] font-mono px-3 py-1 rounded-full border border-accent/30 text-accent uppercase tracking-widest mt-1 inline-block`}>
                  {session.user.role}
                </span>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.2em] text-text-sub">Email Address</p>
                <p className="text-sm font-light text-text-main tracking-wide">{session.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.2em] text-text-sub">Contact Number</p>
                <p className="text-sm font-mono text-text-main">
                  {session.user.tel || "Unregistered"}
                </p>
              </div>
            </div>

            {/* Logout Footer */}
            <div className="pt-8 border-t border-card-border flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.2em] text-text-sub/50">Member Status</p>
                <p className="text-[10px] text-gold italic uppercase tracking-widest">— Verified Identity —</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group flex flex-col items-end"
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-red-500/70 group-hover:text-red-500 transition-colors font-bold">
                  Log out
                </span>
                <div className="h-[1px] w-0 bg-red-500 group-hover:w-full transition-all duration-300 mt-1" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}