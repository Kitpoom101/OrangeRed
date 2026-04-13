"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { IUser } from "@/interface";

export default function UserCard({
  session
}:{
  session: IUser
}) {

  const [profilePicture, setProfilePicture] = useState<string | null>(null);


  const avatarSrc = profilePicture ?? session?.profilePicture ?? null;
  const displayName = session?.name ?? "Member";
  const displayEmail = session?.email ?? "";

  return (
    <div className="rounded-lg border border-gray-800/60 bg-slate-800 p-8 shadow-xl">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-900/40"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-900/20 border border-blue-900/40 flex items-center justify-center text-blue-400 text-3xl font-serif">
              {displayName[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="text-lg font-serif font-medium tracking-tight text-white mb-1">
          {displayName}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
          {displayEmail}
        </p>
      </div>

      <div className="h-[1px] w-full bg-gray-800/60 mb-8" />
    </div>
  );
}