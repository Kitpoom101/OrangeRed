"use client";
import ReservationCard from "@/component/ReservationManagement/ReservationCard";
import deleteReservation from "@/libs/reservation/deleteReservation";
import getAllReservations from "@/libs/reservation/getAllReservation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reservations } from "@/interface";
import NoReservation from "@/component/ReservationManagement/NoReservation";
import ReservationLoading from "@/component/ReservationManagement/ReservationLoading";
import ReservationNoSession from "@/component/ReservationManagement/ReservationNoSession";
import PaginationLinkNav from "@/component/ui/PaginationLinkNav";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const RESERVATIONS_PER_PAGE = 6;

export default function ShopOwnerReservationsPage() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [loading, setLoading] = useState(true);
  const parsedPage = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  async function fetchReservations(page: number) {
    if (!session?.user?.token) return;

    setLoading(true);

    try {
      const data = await getAllReservations(session.user.token, {
        page,
        limit: RESERVATIONS_PER_PAGE,
      });
      setReservations(data);
    } catch {
      console.error("Cannot fetch data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!session?.user?.token) return;
    void fetchReservations(currentPage);
  }, [currentPage, session?.user?.token]);

  async function handleDelete(rid: string) {
    if (!session) return;
    
    try {
      await deleteReservation({ token: session.user.token, rid: rid });
      const nextPage =
        reservations && reservations.data.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      
      if (nextPage !== currentPage) {
        const params = new URLSearchParams(searchParams.toString());
        if (nextPage === 1) {
          params.delete("page");
        } else {
          params.set("page", String(nextPage));
        }

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
        return;
      }

      await fetchReservations(nextPage);
    } catch (err) {
      console.error("Delete failed");
    }
  }

  if (!session) {
    return <ReservationNoSession />;
  }

  if (session.user.role !== "shopowner") {
    return (
      <div className="min-h-screen bg-background text-text-main flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-main mb-4">Access Denied</h1>
          <p className="text-text-sub mb-8">Only shop owners can view this page.</p>
          <Link href="/" className="text-accent hover:text-accent/80 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <ReservationLoading />;

  if (!reservations || reservations.data.length === 0) {
    return <NoReservation isAdmin={false} />;
  }

  const now = Date.now();
  const activeReservationCount = reservations.data.filter(
    (item) => new Date(item.appDate).getTime() >= now
  ).length;
  const passedReservationCount = reservations.data.length - activeReservationCount;

  return (
    <div className="min-h-screen bg-background text-text-main pb-32 px-8 pt-8 selection:bg-accent/30">
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <Link
          href="/shop"
          className="group inline-flex items-center text-[10px] uppercase tracking-[0.3em] text-text-sub hover:text-accent transition-all duration-500"
        >
          <span className="mr-3 transition-transform duration-500 group-hover:-translate-x-2 text-accent">
            <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 4H17.5M1 3.5L0.5 4L1 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Return to Sanctuary</span>
        </Link>
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold mb-3">
            ✦ Shop Owner Collection
          </p>
          <h1 className="text-4xl font-serif tracking-tight text-text-main">
            Your Shop Reservations
          </h1>
          <div className="h-[1px] w-20 bg-gradient-to-r from-accent/60 to-transparent mt-6" />
          <div className="mt-6 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.3em]">
            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-emerald-300">
              {activeReservationCount} Active
            </div>
            <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-amber-200">
              {passedReservationCount} Passed
            </div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 gap-6">
          {reservations.data.map((item: any, index: number) => (
            <div key={item._id} className="transition-all duration-500 hover:translate-y-[-2px]">
              <ReservationCard
                item={item}
                index={index}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {reservations.pagination.totalPages > 1 && (
        <div className="max-w-6xl mx-auto">
          <PaginationLinkNav
            currentPage={currentPage}
            totalPages={reservations.pagination.totalPages}
          />
        </div>
      )}

      <div className="pt-32 flex flex-col items-center gap-4 opacity-40">
        <div className="h-px w-12 bg-card-border" />
        <div className="italic text-text-sub text-[9px] tracking-[0.6em] uppercase">
          — End of Shop Owner Registry —
        </div>
      </div>
    </div>
  );
}
