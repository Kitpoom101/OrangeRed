"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditButton({ shopId }: { shopId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleEdit() {
    router.push(`/shop/${shopId}/edit`);
  }

  if (session?.user?.role !== "admin") return null;

  return (
    <>
      <button
        onClick={handleEdit}
        className="fixed bottom-10 left-10 group flex flex-col items-start gap-1 z-40"
      >
        <div className="px-6 py-2 bg-card/80 backdrop-blur-md border border-emerald-500/30 rounded-xl transition-all duration-500 group-hover:border-emerald-500 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <span className="text-[10px] uppercase tracking-[0.4em] text-emerald-500 group-hover:text-emerald-400 transition-colors font-medium">
            Edit Shop
          </span>
        </div>

        <span className="text-[8px] italic text-text-sub tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 pl-2">
          — Modify Registry —
        </span>
      </button>
    </>
  );
}