'use client'

import deleteShop from "@/libs/shops/deleteShop";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ shopId }: { shopId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to permanently remove this shop from the registry?")) return;

    try {
      if (!session) {
        signIn(undefined, {
          callbackUrl: window.location.href 
        });
        return;
      }
      
      const res = await deleteShop(shopId, session?.user.token);
      if (res?.success || res?.ok || res) {
        router.push("/shop");
        router.refresh(); 
      }
    } catch (err) {
      console.error("Cannot delete:", err);
    }
  }

  if (session?.user?.role !== "admin") return null;

  return (
    <button 
      onClick={handleDelete}
      className="fixed bottom-10 right-10 group flex flex-col items-end gap-1"
    >
      <div className="px-6 py-2 bg-[#1e2d3d]/80 backdrop-blur-md border border-red-500/30 rounded-xl transition-all duration-500 group-hover:border-red-600 group-hover:bg-red-950/20 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]">
        <span className="text-[10px] uppercase tracking-[0.4em] text-red-500 group-hover:text-red-400 transition-colors font-medium">
          Delete Shop
        </span>
      </div>
      
      <span className="text-[8px] italic text-gray-600 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 pr-2">
        — Permanent Action —
      </span>
    </button>
  );
}