"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

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

  const initials = session.user.name
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
        <div className="bg-[#1e2d3d]/40 border border-gray-700/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-blue-900 via-blue-500/40 to-blue-900" />

          <div className="p-10 space-y-10">

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

              {showUrlInput ? (
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
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setShowUrlInput(false); setUrlInput(""); setError(null); }}
                      className="px-4 py-1.5 border border-gray-700 text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-all rounded-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowUrlInput(true)}
                  className="text-[9px] text-gray-600 uppercase tracking-[0.2em] hover:text-gray-400 transition-colors"
                >
                  Change photo URL
                </button>
              )}

              {error && (
                <p className="text-[10px] text-red-400 uppercase tracking-widest">{error}</p>
              )}
            </div>

            {/* Name & Role */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.3em] text-blue-400 font-semibold">Account Holder</p>
                <h2 className="text-2xl font-serif text-gray-100">{session.user.name}</h2>
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

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Email Address</p>
                <p className="text-sm font-light text-gray-200 tracking-wide">{session.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Contact Number</p>
                <p className="text-sm font-mono text-gray-200">
                  {session.user.tel || "Unregistered"}
                </p>
              </div>
            </div>

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
