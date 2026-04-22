"use client";

import ChatRoom from "@/component/Chat/ChatRoom";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { ShopItem } from "@/interface";

type ShopsResponse = {
  success: boolean;
  data: ShopItem[];
  message?: string;
};

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shops, setShops] = useState<ShopItem[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [loadingShops, setLoadingShops] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedShop = useMemo(
    () => shops.find((shop) => shop._id === selectedShopId) ?? null,
    [shops, selectedShopId],
  );

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user?.token || session.user.role !== "shopowner") {
      setLoadingShops(false);
      return;
    }

    const fetchShops = async () => {
      setLoadingShops(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          owner: session.user._id ?? "",
          limit: "100",
          sort: "-_id",
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops?${query.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${session.user.token}`,
            },
          },
        );

        const result: ShopsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load shops");
        }

        setShops(result.data || []);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load shops",
        );
      } finally {
        setLoadingShops(false);
      }
    };

    void fetchShops();
  }, [session, status]);

  useEffect(() => {
    if (shops.length === 0) {
      setSelectedShopId("");
      return;
    }

    const queryShopId = searchParams.get("shopId") ?? "";
    const isValidSelection = shops.some((shop) => shop._id === queryShopId);
    const nextSelectedId = isValidSelection ? queryShopId : shops[0]._id;

    if (nextSelectedId !== selectedShopId) {
      setSelectedShopId(nextSelectedId);
    }

    if (queryShopId !== nextSelectedId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("shopId", nextSelectedId);
      router.replace(`/chat?${params.toString()}`);
    }
  }, [shops, searchParams, router, selectedShopId]);

  const handleShopChange = (shopId: string) => {
    setSelectedShopId(shopId);

    const params = new URLSearchParams(searchParams.toString());
    params.set("shopId", shopId);
    router.push(`/chat?${params.toString()}`);
  };

  if (status === "loading" || loadingShops) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-text-main">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center rounded-3xl border border-card-border bg-card/70">
          <p className="text-[10px] uppercase tracking-[0.4em] text-text-sub animate-pulse">
            Loading chat...
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-text-main">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center rounded-3xl border border-card-border bg-card/70 px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4">
            Authentication Required
          </p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            Sign in to access chat
          </h1>
          <p className="max-w-xl text-sm text-text-sub leading-7 mb-8">
            Shop chat is available for shop owners so they can review customer
            conversations for each shop.
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-accent transition-all duration-300 hover:bg-accent hover:text-background"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (session.user.role !== "shopowner") {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-text-main">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center rounded-3xl border border-card-border bg-card/70 px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4">
            Shop Owner Only
          </p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            This chat view is for shop owners
          </h1>
          <p className="max-w-xl text-sm text-text-sub leading-7 mb-8">
            Use the shop detail page chat if you are browsing a shop as a
            customer.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-accent transition-all duration-300 hover:bg-accent hover:text-background"
          >
            Browse Shops
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-text-main">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center rounded-3xl border border-card-border bg-card/70 px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-red-400 font-bold mb-4">
            Chat Unavailable
          </p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            Could not load your shops
          </h1>
          <p className="max-w-xl text-sm text-text-sub leading-7 mb-8">
            {error}
          </p>
          <Link
            href="/shopowner/create"
            className="inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-accent transition-all duration-300 hover:bg-accent hover:text-background"
          >
            Create Shop
          </Link>
        </div>
      </main>
    );
  }

  if (shops.length === 0) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-text-main">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center rounded-3xl border border-card-border bg-card/70 px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4">
            No Shop Yet
          </p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">
            Create a shop to use chat
          </h1>
          <p className="max-w-xl text-sm text-text-sub leading-7 mb-8">
            You are signed in as a shop owner, but there are no shops linked to
            your account yet.
          </p>
          <Link
            href="/shopowner/create"
            className="inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-accent transition-all duration-300 hover:bg-accent hover:text-background"
          >
            Create Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-8 py-10 text-text-main">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-card-border bg-card/70 p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-3">
              Shop Chat Console
            </p>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-3">
              Choose a shop, then open its messages
            </h1>
            <p className="max-w-2xl text-sm text-text-sub leading-7">
              Select which shop you want to manage. The chat panel below will
              update to show the customer threads for that shop.
            </p>
          </div>

          <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.35em] text-text-sub">
            Select Shop
            <select
              value={selectedShopId}
              onChange={(event) => handleShopChange(event.target.value)}
              className="min-w-[260px] rounded-2xl border border-card-border bg-background px-4 py-3 text-sm text-text-main outline-none transition-colors focus:border-accent"
            >
              {shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedShop ? (
          <div className="h-[720px] overflow-hidden rounded-3xl border border-card-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <ChatRoom
              key={selectedShop._id}
              shopId={selectedShop._id}
              shopName={selectedShop.name}
              isAdmin={true}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}